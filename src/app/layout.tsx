import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div id="main-content" className="relative flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
