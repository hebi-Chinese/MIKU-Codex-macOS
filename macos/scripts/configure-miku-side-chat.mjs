import fs from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { readImageMetadata } from "./image-metadata.mjs";

const [themeDirArg, localImageArg] = process.argv.slice(2);
if (!themeDirArg || !localImageArg) {
  throw new Error("Usage: configure-miku-side-chat.mjs <theme-dir> <local-image>");
}

const MAX_CONFIG_BYTES = 1024 * 1024;
const MAX_IMAGE_BYTES = 16 * 1024 * 1024;
const OPEN_FLAGS = fsConstants.O_RDONLY | (fsConstants.O_NOFOLLOW ?? 0);

function sameStat(left, right) {
  return left.isFile() && right.isFile()
    && left.dev === right.dev
    && left.ino === right.ino
    && left.size === right.size
    && left.mtimeMs === right.mtimeMs
    && left.ctimeMs === right.ctimeMs;
}

async function readStableFile(filePath, label, maxBytes) {
  let handle;
  try {
    handle = await fs.open(filePath, OPEN_FLAGS);
  } catch (error) {
    if (error.code === "ELOOP") throw new Error(`${label} must not be a symbolic link`);
    throw error;
  }
  try {
    const before = await handle.stat();
    if (!before.isFile()) throw new Error(`${label} must be a regular file`);
    if (before.size < 1 || before.size > maxBytes) {
      throw new Error(`${label} must be non-empty and no larger than ${maxBytes} bytes`);
    }
    const bytes = await handle.readFile();
    const after = await handle.stat();
    if (!sameStat(before, after)) throw new Error(`${label} changed while it was being read`);
    return bytes;
  } finally {
    await handle.close();
  }
}

function decodeJson(bytes, label) {
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (text.includes("\0")) throw new Error(`${label} contains NUL characters`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} is not valid JSON`);
  }
}

function canonicalImageExtension(bytes) {
  if (
    bytes.length >= 8
    && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
  ) return ".png";
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) return ".jpg";
  if (
    bytes.length >= 12
    && bytes.subarray(0, 4).toString("ascii") === "RIFF"
    && bytes.subarray(8, 12).toString("ascii") === "WEBP"
  ) return ".webp";
  return "";
}

async function atomicWrite(filePath, bytes) {
  const temporary = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporary, bytes, { flag: "wx", mode: 0o600 });
    await fs.rename(temporary, filePath);
    await fs.chmod(filePath, 0o600);
  } finally {
    await fs.rm(temporary, { force: true }).catch(() => {});
  }
}

const themeRoot = await fs.realpath(themeDirArg);
const themeRootStat = await fs.stat(themeRoot);
if (!themeRootStat.isDirectory()) throw new Error("Theme directory must be a directory");

const configPath = path.join(themeRoot, "theme.json");
const configBytes = await readStableFile(configPath, "Theme config", MAX_CONFIG_BYTES);
const theme = decodeJson(configBytes, "Theme config");
if (theme?.schemaVersion !== 1 || typeof theme.image !== "string" || !theme.image) {
  throw new Error("Theme config has an unsupported schema or image field");
}
if (path.basename(theme.image) !== theme.image) {
  throw new Error("Main theme image must stay inside the theme directory");
}
if (
  theme.sideChatImage !== undefined
  && (typeof theme.sideChatImage !== "string" || path.basename(theme.sideChatImage) !== theme.sideChatImage)
) {
  throw new Error("Existing side-chat image must stay inside the theme directory");
}

const localImage = await readStableFile(
  path.resolve(localImageArg),
  "User-provided side-chat image",
  MAX_IMAGE_BYTES,
);
const extension = canonicalImageExtension(localImage);
if (!extension || !readImageMetadata(localImage, extension)) {
  throw new Error("User-provided side-chat image must be a valid PNG, JPEG, or WebP file");
}

const targetName = `love-words-v-side-chat${extension}`;
if (targetName === theme.image) throw new Error("Side-chat image must not replace the main background");
const previousSideChat = theme.sideChatImage;
theme.id = "custom-miku-love-words";
theme.sideChatImage = targetName;

await atomicWrite(path.join(themeRoot, targetName), localImage);
await atomicWrite(configPath, Buffer.from(`${JSON.stringify(theme, null, 2)}\n`, "utf8"));

if (
  previousSideChat
  && previousSideChat !== targetName
  && previousSideChat !== theme.image
  && path.basename(previousSideChat) === previousSideChat
) {
  await fs.rm(path.join(themeRoot, previousSideChat), { force: true });
}

process.stdout.write(targetName);
