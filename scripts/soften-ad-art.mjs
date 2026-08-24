/**
 * Feathers the edges of the generated ad artwork into transparency.
 *
 * The raw renders sit on their own near-black square (~#060910) which never
 * exactly matches the ad background, leaving a faintly visible rectangle when
 * composited. Fading the outer band to alpha 0 removes the seam entirely and
 * makes the artwork independent of whatever background the ad uses.
 *
 * Run: node scripts/soften-ad-art.mjs
 */
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const ART_DIR = join(process.cwd(), 'public', 'ads', 'art')
const FEATHER = 150 // px band that ramps from transparent to opaque
const SUFFIX = '-soft.png'

/** Smoothstep, so the ramp has no visible banding at either end. */
function smooth(t) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

async function soften(file) {
  const src = join(ART_DIR, file)
  const { width, height } = await sharp(src).metadata()

  const mask = Buffer.alloc(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const edge = Math.min(x, y, width - 1 - x, height - 1 - y)
      mask[y * width + x] = Math.round(255 * smooth(edge / FEATHER))
    }
  }

  const out = src.replace(/\.png$/, SUFFIX)
  await sharp(src)
    .ensureAlpha()
    .joinChannel(mask, { raw: { width, height, channels: 1 } })
    .png()
    .toFile(out)

  return out
}

const files = (await readdir(ART_DIR)).filter(
  (f) => f.endsWith('.png') && !f.endsWith(SUFFIX),
)

for (const f of files) {
  console.log('softened ->', await soften(f))
}
