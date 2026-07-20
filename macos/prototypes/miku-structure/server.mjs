import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOST = "127.0.0.1";
const DEFAULT_PORT = 4177;
const PORT = Number.parseInt(process.env.MIKU_PROTOTYPE_PORT || process.argv[2] || DEFAULT_PORT, 10);
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BACKGROUND_PATH = "/Users/mac/Downloads/已生成图像 1 (12).png";

const CONTENT_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
]);

function resolveStaticPath(requestPath) {
  const relativePath = requestPath === "/" ? "index.html" : requestPath.slice(1);
  const candidate = path.resolve(ROOT, relativePath);
  return candidate === ROOT || candidate.startsWith(`${ROOT}${path.sep}`) ? candidate : null;
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${HOST}:${PORT}`);
    if (url.pathname === "/background.png") {
      response.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "no-store" });
      response.end(await readFile(BACKGROUND_PATH));
      return;
    }

    const staticPath = resolveStaticPath(url.pathname);
    if (!staticPath) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    const body = await readFile(staticPath);
    response.writeHead(200, {
      "Content-Type": CONTENT_TYPES.get(path.extname(staticPath)) || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(body);
  } catch (error) {
    response.writeHead(error?.code === "ENOENT" ? 404 : 500, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end(error?.code === "ENOENT" ? "Not found" : "Prototype server error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`MIKU structure prototype: http://${HOST}:${PORT}/?variant=A`);
});
