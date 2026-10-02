/*
 * Regenerates every served image from the original artwork.
 *
 *   npm install sharp        (anywhere; this repo has no package.json on purpose)
 *   node .claude/build-images.js
 *
 * Sources live in images/src/: header_1.png / header2.png (full-resolution banners with
 * marketing copy and the wordmark baked into the pixels) and the two contact_us*.jfif
 * originals. Output goes to images/. The badges in images/certs/ were encoded from the
 * team's PNGs once and are not regenerated here.
 *
 * The patch rectangles below were measured by scanning the originals for columns and rows
 * containing ink. If a banner is ever replaced, re-measure them — do not guess.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..') + path.sep;
const SRC = ROOT + 'images' + path.sep + 'src' + path.sep;
const OUT = ROOT + 'images' + path.sep;

const patch = (left, top, width, height) => ({
  input: { create: { width, height, channels: 3, background: '#ffffff' } }, left, top
});

// Line art drawn on white: turn the white into alpha so the page colour shows through,
// and optionally lift near-black strokes so they still read on a dark page.
async function knockout(buf, out, lift) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * 4;
    const r = data[o], g = data[o + 1], b = data[o + 2];
    const m = Math.min(r, g, b);
    data[o + 3] = m >= 250 ? 0 : m <= 238 ? 255 : Math.round((250 - m) / 12 * 255);
    if (lift && data[o + 3] > 0) {
      const max = Math.max(r, g, b);
      if (max < lift.below) {
        const k = lift.to / Math.max(max, 1);
        data[o]     = Math.min(255, Math.round(r * k));
        data[o + 1] = Math.min(255, Math.round(g * k));
        data[o + 2] = Math.min(255, Math.round(b * k));
      }
    }
  }
  const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
  if (out.endsWith('.png')) await sharp(data, raw).png({ compressionLevel: 9, palette: true }).toFile(out);
  else await sharp(data, raw).webp({ quality: 82, alphaQuality: 100 }).toFile(out);
  report(out, `${info.width}x${info.height}`);
}

function report(file, size) {
  console.log(path.basename(file).padEnd(20), size.padEnd(12), (fs.statSync(file).size / 1024).toFixed(1) + ' KB');
}

(async () => {
  // --- hero: the banner with its baked-in wordmark and marketing copy painted out ---
  const heroBase = await sharp(SRC + 'header_1.png')
    .composite([
      patch(0, 0, 1250, 1000),        // wordmark (lifted out into logo.png below)
      patch(0, 0, 14, 2100),          // stray line on the left edge
      patch(3400, 0, 2692, 2430),     // "WE BUILD YOUR IDEAS" + tagline + top-right brackets
      patch(4300, 2430, 1792, 1570),  // bottom-right brackets
    ]).png().toBuffer();
  const hero = await sharp(heroBase).trim({ threshold: 12 }).resize({ width: 1100 }).png().toBuffer();
  await sharp(hero).webp({ quality: 82 }).toFile(OUT + 'hero.webp');
  report(OUT + 'hero.webp', '1100 wide');
  await knockout(hero, OUT + 'hero-dark.webp', null);

  // --- team: same banner treatment, minus its baked-in caption ---
  const team = await sharp(SRC + 'header2.png')
    .extract({ left: 0, top: 0, width: 1122, height: 374 })
    .trim({ threshold: 12 }).resize({ width: 1122, withoutEnlargement: true }).png().toBuffer();
  await sharp(team).webp({ quality: 82 }).toFile(OUT + 'team.webp');
  report(OUT + 'team.webp', '1122 wide');
  await knockout(team, OUT + 'team-dark.webp', null);

  // --- logo: its strokes are dark, so the dark variant lifts them ---
  const logo = await sharp(SRC + 'header_1.png')
    .extract({ left: 150, top: 115, width: 880, height: 800 })
    .trim({ threshold: 12 }).resize({ width: 420 }).png().toBuffer();
  await sharp(logo).png({ compressionLevel: 9, palette: true }).toFile(OUT + 'logo.png');
  report(OUT + 'logo.png', '420 wide');
  await knockout(logo, OUT + 'logo-dark.png', { below: 190, to: 205 });

  // --- contact page: two separately drawn originals (contact_us.jfif on white,
  //     contact_us_dark.jfif on its own dark gradient), so no knockout — just re-encode.
  //     Both are 1100x976, the hero's proportions, and are used uncropped. ---
  for (const [src, out] of [['contact_us.jfif', 'contact.webp'], ['contact_us_dark.jfif', 'contact-dark.webp']]) {
    await sharp(SRC + src).resize({ width: 1100, withoutEnlargement: true }).webp({ quality: 82 }).toFile(OUT + out);
    report(OUT + out, '1100 wide');
  }

  // --- social card: the one place the original banner is used intact, text and all ---
  await sharp(SRC + 'header_1.png')
    .extract({ left: 0, top: 450, width: 6092, height: 3198 })
    .resize(1200, 630).png({ compressionLevel: 9, palette: true })
    .toFile(OUT + 'og.png');
  report(OUT + 'og.png', '1200x630');

  // --- apple touch icon: the bracket mark, flattened onto white because iOS renders
  //     transparency as black, with padding so rounded corners do not clip it ---
  const faviconSrc = SRC + 'favicon-src.png';
  if (fs.existsSync(faviconSrc)) {
    const trimmed = await sharp(faviconSrc).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
    const inset = 30; // drops the thin frame drawn around the original artwork
    const inner = await sharp(trimmed.data)
      .extract({ left: inset, top: inset, width: trimmed.info.width - inset * 2, height: trimmed.info.height - inset * 2 })
      .toBuffer();
    const mark = await sharp(inner).trim({ threshold: 12 }).resize({ width: 140 }).png().toBuffer();
    await sharp({ create: { width: 180, height: 180, channels: 3, background: '#ffffff' } })
      .composite([{ input: mark, gravity: 'centre' }])
      .png({ compressionLevel: 9, palette: true })
      .toFile(OUT + 'apple-touch-icon.png');
    report(OUT + 'apple-touch-icon.png', '180x180');
  } else {
    console.log('apple-touch-icon   skipped (no images/src/favicon-src.png; recover it with');
    console.log('                   `git show fd81f06:favicon.png > images/src/favicon-src.png`)');
  }

  // favicon.png is deliberately not regenerated here: it is already the shrunk 64x64 copy,
  // and reading and writing the same path in one pass would corrupt it. The 2048x2048
  // original lives in git history (`git show fd81f06:favicon.png`).
})().catch(e => { console.error(e.message); process.exit(1); });
