import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { SkipLink } from '@/components/accessibility/skip-link'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'EcoSync | Carbon Footprint Intelligence Platform',
  description:
    'Track, understand, and reduce your carbon footprint with personalized insights and actionable recommendations.',
  keywords: [
    'carbon footprint',
    'climate action',
    'sustainability',
    'eco tracker',
    'carbon calculator',
    'environmental impact',
  ],
  authors: [{ name: 'EcoSync Team' }],
  creator: 'EcoSync',
  publisher: 'EcoSync',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ecosync.vercel.app',
    siteName: 'EcoSync',
    title: 'EcoSync | Carbon Footprint Intelligence Platform',
    description:
      'Track, understand, and reduce your carbon footprint with personalized insights.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'EcoSync Carbon Footprint Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoSync | Carbon Footprint Intelligence Platform',
    description:
      'Track, understand, and reduce your carbon footprint with personalized insights.',
    images: ['/og-image.svg'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.svg',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'EcoSync',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10b981' },
    { media: '(prefers-color-scheme: dark)', color: '#065f46' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SkipLink />

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
