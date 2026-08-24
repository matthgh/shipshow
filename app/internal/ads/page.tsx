/**
 * TEMPORARY asset renderer, not part of the product.
 *
 * The image generator only emits 1024x1024 and garbles baked-in text, so the
 * ad creatives are composed here in real HTML/CSS with the project's Inter
 * webfont and captured with a headless browser at exact pixel sizes. Each
 * frame carries an id so it can be screenshotted individually.
 *
 * This file is deleted once the PNGs in /public/ads are generated.
 */

type Format = {
  id: string
  w: number
  h: number
}

type Variant = {
  key: string
  kicker: string
  headline: string
  sub: string
  art: string
  artAlt: string
}

const VARIANTS: Variant[] = [
  {
    key: 'v1-apks',
    kicker: 'The old way',
    headline: 'Stop sending APKs.',
    sub: 'Send one link instead.',
    art: '/ads/art/phone-tap.png',
    artAlt: 'A phone showing an app screen being tapped',
  },
  {
    key: 'v2-installs',
    kicker: 'The old way',
    headline: 'Nobody installs your build.',
    sub: 'One link. Opens in any browser.',
    art: '/ads/art/clutter-vs-link.png',
    artAlt: 'A pile of files and videos next to one glowing phone',
  },
  {
    key: 'v3-explain',
    kicker: 'The old way',
    headline: 'Don’t explain the update.',
    sub: 'Let them tap through it.',
    art: '/ads/art/phone-front.png',
    artAlt: 'A phone screen with interactive hotspots',
  },
]

const FORMATS: Format[] = [
  { id: '1x1', w: 1080, h: 1080 },
  { id: '9x16', w: 1080, h: 1920 },
  { id: '16x9', w: 1920, h: 1080 },
]

/** Small brand lockup: indigo tile + wordmark. */
function Lockup({ scale = 1 }: { scale?: number }) {
  return (
    <div className="flex items-center" style={{ gap: 14 * scale }}>
      <div
        className="flex items-center justify-center bg-[#4f46e5]"
        style={{ width: 44 * scale, height: 44 * scale, borderRadius: 12 * scale }}
      >
        <svg
          width={26 * scale}
          height={26 * scale}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
      <span
        className="font-semibold tracking-tight text-white"
        style={{ fontSize: 30 * scale }}
      >
        ShipShow
      </span>
    </div>
  )
}

/** Filled pill used as the in-image call to action. */
function Cta({ scale = 1 }: { scale?: number }) {
  return (
    <div
      className="inline-flex items-center bg-[#4f46e5] font-semibold text-white"
      style={{
        fontSize: 26 * scale,
        paddingInline: 40 * scale,
        paddingBlock: 20 * scale,
        borderRadius: 999,
      }}
    >
      Try it free
    </div>
  )
}

/**
 * One creative. `dir` drives the two arrangements: stacked (square / story)
 * and side-by-side (landscape).
 */
function Ad({ variant, format }: { variant: Variant; format: Format }) {
  const side = format.id === '16x9'
  // Story format is the tallest, so everything scales up a touch to stay legible
  // when the frame is viewed full-screen on a phone.
  const scale = format.id === '9x16' ? 1.15 : 1
  const pad = side ? 96 : 84

  return (
    <div
      id={`ad-${variant.key}-${format.id}`}
      className="relative flex overflow-hidden bg-[#030712]"
      style={{
        width: format.w,
        height: format.h,
        flexDirection: side ? 'row' : 'column',
        alignItems: 'center',
        padding: pad,
        gap: side ? 64 : 0,
      }}
    >
      {/* No extra glow layer here: the artwork already carries its own indigo
          bloom, and an overlay behind it lightened the frame background so the
          art's near-black square showed up as a visible box. */}

      {/* Copy block */}
      <div
        className="relative flex flex-col justify-center"
        style={{
          flex: side ? '1 1 0%' : 'none',
          width: side ? 'auto' : '100%',
          gap: 22 * scale,
        }}
      >
        <Lockup scale={scale} />
        <div
          className="font-semibold uppercase tracking-[0.18em] text-[#6b7280]"
          style={{ fontSize: 20 * scale, marginTop: 18 * scale }}
        >
          {variant.kicker}
        </div>
        <h2
          className="font-bold tracking-[-0.03em] text-white text-balance"
          style={{
            fontSize: (side ? 96 : 104) * scale,
            lineHeight: 1.03,
            margin: 0,
          }}
        >
          {variant.headline}
        </h2>
        <p
          className="text-[#9ca3af]"
          style={{ fontSize: 38 * scale, lineHeight: 1.35, margin: 0 }}
        >
          {variant.sub}
        </p>
        {format.id !== '1x1' && (
          <div style={{ marginTop: 20 * scale }}>
            <Cta scale={scale} />
          </div>
        )}
      </div>

      {/* Artwork */}
      <div
        className="relative flex items-center justify-center"
        style={{
          flex: side ? '1 1 0%' : '1 1 auto',
          width: side ? 'auto' : '100%',
          minHeight: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- exact-size
            capture, Next's optimizer would resample the artwork */}
        <img
          src={variant.art}
          alt={variant.artAlt}
          loading="eager"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
    </div>
  )
}

export default async function AdsRendererPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string; f?: string }>
}) {
  const { v, f } = await searchParams
  const one = VARIANTS.find((x) => x.key === v)
  const oneFormat = FORMATS.find((x) => x.id === f)

  // Isolated mode: render a single creative flush to the top-left corner with
  // no chrome, so a viewport screenshot at exactly w x h yields the final asset.
  // (Per-element screenshots came back blank for the large landscape frame.)
  if (one && oneFormat) {
    return (
      <div style={{ fontFamily: 'var(--font-inter)' }}>
        <Ad variant={one} format={oneFormat} />
      </div>
    )
  }

  return (
    <main className="bg-[#111] p-10 font-sans" style={{ fontFamily: 'var(--font-inter)' }}>
      <div className="flex flex-col gap-16">
        {VARIANTS.map((variant) =>
          FORMATS.map((format) => (
            <div key={`${variant.key}-${format.id}`} className="flex flex-col gap-3">
              <code className="text-sm text-white/60">
                {`?v=${variant.key}&f=${format.id}`} — {format.w}x{format.h}
              </code>
              <Ad variant={variant} format={format} />
            </div>
          )),
        )}
      </div>
    </main>
  )
}
