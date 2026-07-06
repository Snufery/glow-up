import fs from "fs";
import path from "path";
import sharp from "sharp";

const SRC_DIR = path.join(process.cwd(), "public/images/productos");
const OUT_DIR = path.join(process.cwd(), "public/images/productos-opt");
const MAX_WIDTH = 1000;
const JPEG_QUALITY = 82;
const MIN_SIZE_KB = 75;

fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs.readdirSync(SRC_DIR).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

let totalBefore = 0;
let totalAfter = 0;
const optimized = [];

for (const file of files) {
  const input = path.join(SRC_DIR, file);
  const before = fs.statSync(input).size;

  if (before < MIN_SIZE_KB * 1024) {
    continue;
  }

  totalBefore += before;
  const ext = path.extname(file).toLowerCase();
  const output = path.join(OUT_DIR, file);
  const pipeline = sharp(input).rotate().resize({
    width: MAX_WIDTH,
    height: MAX_WIDTH,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (ext === ".png") {
    await pipeline.png({ compressionLevel: 9, effort: 10 }).toFile(output);
  } else {
    await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(output);
  }

  const after = fs.statSync(output).size;
  totalAfter += after;
  optimized.push(file);
  console.log(`${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
}

console.log(`\nOptimizadas: ${optimized.length}`);
console.log(`Ahorro: ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)}MB`);
console.log(`Salida: ${OUT_DIR}`);