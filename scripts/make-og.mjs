// Builds the 1200x630 Open Graph / Twitter share image: villa photo + dark fade + logo.
import sharp from "sharp";

const W = 1200, H = 630;
const photo = await sharp("public/images/piscine-02.avif").resize(W, H, { fit: "cover", position: "centre" }).toBuffer();
const fade = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="#1c150f" stop-opacity="0"/><stop offset="1" stop-color="#1c150f" stop-opacity="0.85"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`,
);
const logo = await sharp("public/brand/logo-horizontal-dark.png").resize({ height: 84 }).toBuffer();
await sharp(photo)
  .composite([{ input: fade }, { input: logo, left: 56, top: H - 84 - 48 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/og/og.jpg");
console.log("public/og/og.jpg");
