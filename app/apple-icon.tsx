import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Same mark as app/icon.svg and the navbar logo (Zap glyph on a primary-blue
// rounded square), rasterized at touch-icon resolution for a pixel-consistent
// brand mark across favicon, iOS home screen, and the in-app logo.
const mark = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#3d54ee"/>
  <path
    transform="translate(7,7) scale(0.75)"
    fill="#ffffff"
    d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
  />
</svg>
`.trim()

export default function AppleIcon() {
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`data:image/svg+xml;base64,${Buffer.from(mark).toString('base64')}`}
      width={size.width}
      height={size.height}
      alt="ShipShow"
    />,
    { ...size }
  )
}
