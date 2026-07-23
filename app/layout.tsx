import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

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
