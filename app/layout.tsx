import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from 'sonner'
import './globals.css'

// Whop analytics loader. Kept as a single-line string so the inline snippet is
// byte-identical to the one Whop provides. The snippet itself appends s.js
// asynchronously, so it never blocks rendering.
const WHOP_ANALYTICS = `!function(w,d,s,u,n,a,b){if(w[n])return;a=w[n]={q:[],t:+new Date,s:[],o:u,track:function(){a.q.push([+new Date].concat([].slice.call(arguments)))},setScope:function(){a.s=[].slice.call(arguments).filter(function(x){return typeof x==="string"});a.q.push([+new Date,"setScope"].concat(a.s))},scope:function(){var c=[].slice.call(arguments);return{track:function(){a.q.push([+new Date].concat([].slice.call(arguments)).concat([{__scope:c}]))}}}};b=d.createElement(s);b.async=1;b.src=u+"/s.js";d.getElementsByTagName(s)[0].parentNode.insertBefore(b,d.getElementsByTagName(s)[0])}(window,document,"script","https://t.whop.tw","whop");whop.setScope("biz_pBWtxQW1Ji6wPz");whop.track("page");`

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ShipShow — Show every update of your app with a simple link',
  description:
    'ShipShow turns your app changes into interactive, shareable demos. No APKs. No videos. Just a link.',
  generator: 'v0.app',

}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isMaintenance = process.env.MAINTENANCE === 'true'

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <head>
        {/* Warm up the analytics origin so s.js resolves faster */}
        <link rel="preconnect" href="https://t.whop.tw" crossOrigin="anonymous" />
        {/* beforeInteractive puts this in <head> on every route, so the
            pageview fires as early as possible on first load */}
        <Script
          id="whop-analytics"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: WHOP_ANALYTICS }}
        />
      </head>
      <body className="font-sans antialiased">
        {isMaintenance && (
          <div className="w-full bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2 flex items-center justify-center gap-2">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-yellow-500" />
            </span>
            <p className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">
              ShipShow is currently in maintenance mode. Some features may be unavailable.
            </p>
          </div>
        )}
        {children}
        <Toaster richColors position="bottom-right" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
