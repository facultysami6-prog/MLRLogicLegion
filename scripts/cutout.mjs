/**
 * Build-time cut-out pass.
 *
 * The generated art arrives on a solid light backdrop. This script flood-fills
 * that backdrop away to real alpha, trims the empty padding, downscales the
 * result and writes a compressed PNG — so the produce reads as a true
 * transparent cut-out on any surface.
 *
 *   node scripts/cutout.mjs
 */
import sharp from "sharp";
import fs from "node:fs";

const NAMES = [
  "avocado",
  "basil",
  "blueberry",
  "cabbage",
  "carrot",
  "honey",
  "onion",
  "peach",
  "strawberry",
  "tomato",
];

const SRC_DIR = "public/images";
const MAX = 520;
/** Anything at or above this luminance on all channels counts as backdrop. */
const THRESH = 228;
/** Pixels adjacent to the mask that are this light lose their white fringe. */
const FRINGE = 236;

async function process(name) {
  const src = `${SRC_DIR}/${name}.png`;
  if (!fs.existsSync(src)) {
    console.log(`skip  ${name} (missing)`);
    return;
  }

  const img = sharp(src).resize(MAX, MAX, { fit: "inside", kernel: "lanczos3" }).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const count = w * h;

  const isBackdrop = (i) => {
    const o = i * ch;
    return data[o] >= THRESH && data[o + 1] >= THRESH && data[o + 2] >= THRESH;
  };

  // ---- flood fill the backdrop in from every border pixel ----
  const seen = new Uint8Array(count);
  const stack = [];
  for (let x = 0; x < w; x++) {
    stack.push(x, (h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    stack.push(y * w, y * w + w - 1);
  }
  while (stack.length) {
    const i = stack.pop();
    if (i < 0 || i >= count || seen[i]) continue;
    seen[i] = 1;
    if (!isBackdrop(i)) continue;
    data[i * ch + 3] = 0;
    const x = i % w;
    const y = (i / w) | 0;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - w);
    if (y < h - 1) stack.push(i + w);
  }

  // ---- de-fringe: kill the pale halo hugging the silhouette ----
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (data[i * ch + 3] === 0) continue;
      let touchesMask = false;
      if (x > 0 && data[(i - 1) * ch + 3] === 0) touchesMask = true;
      else if (x < w - 1 && data[(i + 1) * ch + 3] === 0) touchesMask = true;
      else if (y > 0 && data[(i - w) * ch + 3] === 0) touchesMask = true;
      else if (y < h - 1 && data[(i + w) * ch + 3] === 0) touchesMask = true;
      if (!touchesMask) continue;
      const o = i * ch;
      if (data[o] >= FRINGE && data[o + 1] >= FRINGE && data[o + 2] >= FRINGE) data[o + 3] = 0;
    }
  }

  // ---- trim to the subject bounding box so it fills its slot ----
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * ch + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) {
    console.log(`warn  ${name} (no subject found)`);
    return;
  }
  // small breathing room so the drop shadow is not clipped
  const pad = 6;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad);
  maxY = Math.min(h - 1, maxY + pad);

  const outW = maxX - minX + 1;
  const outH = maxY - minY + 1;

  await sharp(data, { raw: info })
    .extract({ left: minX, top: minY, width: outW, height: outH })
    // palette keeps the alpha channel but cuts the payload hard — these are
    // decorative cut-outs displayed around 250–400px, so 255 colours is plenty
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true, quality: 96, colors: 255 })
    .toFile(`${SRC_DIR}/${name}-cut.png`);

  console.log(`ok    ${name}-cut.png  ${outW}x${outH}`);
}

for (const name of NAMES) {
  await process(name);
}
console.log("done");
