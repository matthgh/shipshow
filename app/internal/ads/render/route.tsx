import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

/**
 * Internal ad-creative renderer.
 *
 * Renders campaign images at exact pixel sizes with real vector text, so the
 * headlines stay sharp and correctly spelled (image models garble lettering).
 * The phone/clutter artwork is generated separately and composited here.
 *
 * GET /internal/ads/render?v=<variant>&f=<format>
 *
 * Layout notes: every box gets an explicit pixel width and copy is split into
 * explicit lines. Relying on satori's text wrapping / percentage widths pushed
 * the column layouts off-canvas, so nothing here is left to inference.
 */

const INDIGO = '#4f46e5'
const BG = '#030712'
const WHITE = '#ffffff'
const GREY = '#9ca3af'

// Problem -> solution angle. Short lines read better at feed size and leave the
// artwork room to breathe.
const VARIANTS = {
  'v1-apks': {
    headline: ['STOP SENDING', 'APKs'],
    sub: ['Send one link instead.', 'Clients just tap it.'],
    art: 'clutter-vs-link-soft.png',
  },
  'v2-installs': {
    headline: ['NOBODY INSTALLS', 'YOUR BUILD'],
    sub: ['No APKs. No TestFlight.', 'Just a link.'],
    art: 'phone-tap-soft.png',
  },
  'v3-explain': {
    headline: ['STOP EXPLAINING', 'UPDATES'],
    sub: ['Let clients tap through', 'the new flow themselves.'],
    art: 'phone-front-soft.png',
  },
} as const

/**
 * Per-format geometry. Both blocks are absolutely positioned: satori laid the
 * copy and the artwork side by side at the root even in a column container, so
 * exact coordinates are used instead of relying on flex flow. `col` is the copy
 * block width; `copy`/`artPos` are top-left offsets in canvas pixels.
 */
const FORMATS = {
  '1x1': {
    w: 1080,
    h: 1080,
    col: 920,
    eyebrow: 26,
    headline: 82,
    sub: 33,
    art: 470,
    copy: { left: 80, top: 90 },
    artPos: { left: 305, top: 580 },
  },
  '9x16': {
    w: 1080,
    h: 1920,
    col: 904,
    eyebrow: 30,
    headline: 92,
    sub: 38,
    art: 880,
    copy: { left: 88, top: 220 },
    artPos: { left: 100, top: 800 },
  },
  '16x9': {
    w: 1920,
    h: 1080,
    col: 830,
    eyebrow: 26,
    headline: 88,
    sub: 34,
    art: 830,
    copy: { left: 100, top: 300 },
    artPos: { left: 990, top: 125 },
  },
} as const

const FONT_BASE = 'https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files'

async function font(weight: 400 | 700 | 900) {
  const res = await fetch(`${FONT_BASE}/inter-latin-${weight}-normal.woff`)
  if (!res.ok) throw new Error(`font ${weight} failed: ${res.status}`)
  return res.arrayBuffer()
}

export async function GET(req: NextRequest) {
  const v = req.nextUrl.searchParams.get('v') ?? ''
  const f = req.nextUrl.searchParams.get('f') ?? ''

  const variant = VARIANTS[v as keyof typeof VARIANTS]
  const format = FORMATS[f as keyof typeof FORMATS]

  if (!variant || !format) {
    return new Response(
      `Unknown v/f. v=${Object.keys(VARIANTS).join('|')} f=${Object.keys(FORMATS).join('|')}`,
      { status: 400 },
    )
  }

  const [w400, w700, w900, artBytes] = await Promise.all([
    font(400),
    font(700),
    font(900),
    readFile(join(process.cwd(), 'public', 'ads', 'art', variant.art)),
  ])

  // The artwork already sits on the same near-black as the ad background, so a
  // plain data URI composites seamlessly with no visible square edge.
  const artSrc = `data:image/png;base64,${artBytes.toString('base64')}`

  const line = (text: string, style: React.CSSProperties) => (
    <div key={text} style={{ display: 'flex', width: format.col, ...style }}>
      {text}
    </div>
  )

  const copy = (
    <div
      style={{
        position: 'absolute',
        left: format.copy.left,
        top: format.copy.top,
        display: 'flex',
        flexDirection: 'column',
        width: format.col,
      }}
    >
      {line('SHIPSHOW', {
        fontSize: format.eyebrow,
        fontWeight: 700,
        letterSpacing: 6,
        color: INDIGO,
      })}

      <div style={{ display: 'flex', flexDirection: 'column', width: format.col, marginTop: 24 }}>
        {variant.headline.map((l) =>
          line(l, {
            fontSize: format.headline,
            fontWeight: 900,
            lineHeight: 1.06,
            letterSpacing: -2,
            color: WHITE,
          }),
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: format.col, marginTop: 28 }}>
        {variant.sub.map((l) =>
          line(l, {
            fontSize: format.sub,
            fontWeight: 400,
            lineHeight: 1.4,
            color: GREY,
          }),
        )}
      </div>

      <div style={{ display: 'flex', width: format.col, marginTop: 40 }}>
        <div
          style={{
            display: 'flex',
            paddingTop: 18,
            paddingBottom: 18,
            paddingLeft: 38,
            paddingRight: 38,
            borderRadius: 999,
            backgroundColor: INDIGO,
            color: WHITE,
            fontSize: format.sub,
            fontWeight: 700,
          }}
        >
          shipshow.app
        </div>
      </div>
    </div>
  )

  const art = (
    <div
      style={{
        position: 'absolute',
        left: format.artPos.left,
        top: format.artPos.top,
        display: 'flex',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={artSrc} width={format.art} height={format.art} alt="" />
    </div>
  )

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: format.w,
          height: format.h,
          display: 'flex',
          backgroundColor: BG,
          fontFamily: 'Inter',
        }}
      >
        {art}
        {copy}
      </div>
    ),
    {
      width: format.w,
      height: format.h,
      fonts: [
        { name: 'Inter', data: w400, weight: 400, style: 'normal' },
        { name: 'Inter', data: w700, weight: 700, style: 'normal' },
        { name: 'Inter', data: w900, weight: 900, style: 'normal' },
      ],
    },
  )
}
