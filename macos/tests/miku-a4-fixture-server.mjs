import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPayload } from "../scripts/injector.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const macosRoot = path.resolve(here, "..");
const themeDir = path.resolve(macosRoot, "runtime", "themes", "custom-miku-love-words");
const templatePath = path.resolve(here, "fixtures", "miku-a4-production.html");
const port = Number(process.env.MIKU_A4_FIXTURE_PORT || 4178);

const [{ payload }, template] = await Promise.all([
  loadPayload(themeDir),
  fs.readFile(templatePath, "utf8"),
]);
const html = template.replace("__PAYLOAD_BASE64__", Buffer.from(payload).toString("base64"));

const server = http.createServer((request, response) => {
  if (request.url?.startsWith("/favicon")) {
    response.writeHead(204).end();
    return;
  }
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(html);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`MIKU A4 fixture ready at http://127.0.0.1:${port}`);
});
