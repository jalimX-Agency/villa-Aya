import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const [dir, outDir] = process.argv.slice(2);
const targetHeight = { icon: 1024, favicon: 512, vertical: 1200, horizontal: 600 };
for (const f of readdirSync(dir).filter((f) => f.endsWith(".svg"))) {
  const key = Object.keys(targetHeight).find((k) => f.includes(k));
  const out = join(outDir, f.replace(".svg", ".png"));
  await sharp(join(dir, f), { density: 600 }).resize({ height: targetHeight[key] }).png().toFile(out);
  console.log(out);
}
