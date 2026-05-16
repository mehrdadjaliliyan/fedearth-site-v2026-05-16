import type { Metadata } from 'next';
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import SmoothScroll from '@/components/motion/SmoothScroll';
import PageTransition from '@/components/motion/PageTransition';
import ScrollProgress from '@/components/motion/ScrollProgress';
import CursorGlow from '@/components/motion/CursorGlow';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'Federation of Earth — Building the Infrastructure of Direct Democracy',
    template: '%s · Federation of Earth',
  },
  description:
    'Federation of Earth is a Swiss non-profit NGO developing open-source technology to advance direct democracy worldwide. Non-partisan, non-denominational, founded in Zug on 7 November 2025.',
  keywords: [
    'Federation of Earth',
    'fedearth',
    'direct democracy NGO',
    'Swiss non-profit',
    'Swiss Verein',
    'governance technology',
    'onchain voting',
    'popular initiatives',
    'referendums',
    'civic tech',
  ],
  authors: [{ name: 'Federation of Earth' }],
  openGraph: {
    title: 'Federation of Earth — Direct Democracy NGO',
    description:
      'A Swiss non-profit association building the infrastructure of direct democracy worldwide.',
    siteName: 'Federation of Earth',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Federation of Earth',
    description: 'Direct democracy, built for everyone. A Swiss NGO founded in Zug.',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Federation of Earth',
  alternateName: 'fedearth',
  url: 'https://fedearth.org',
  logo: 'https://fedearth.org/logo.svg',
  description:
    'A Swiss non-profit association developing open-source technology and concepts to foster direct democracy worldwide.',
  foundingDate: '2025-11-07',
  foundingLocation: {
    '@type': 'Place',
    name: 'Zug, Switzerland',
  },
  legalName: 'Federation of earth (fedearth)',
  nonprofitStatus: 'Nonprofit501c3',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Gublerstrasse 24',
    postalCode: '6300',
    addressLocality: 'Zug',
    addressCountry: 'CH',
  },
  founders: [
    { '@type': 'Person', name: 'Ali Mizani Oskui', jobTitle: 'Chairman' },
    { '@type': 'Person', name: 'Martin Liebi', jobTitle: 'Board Member' },
  ],
  areaServed: { '@type': 'Place', name: 'Worldwide' },
  knowsAbout: [
    'Direct democracy',
    'Participatory governance',
    'Civic technology',
    'Onchain voting',
    'Popular initiatives',
    'Referendums',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="min-h-screen font-sans">
        <SmoothScroll>
          <ScrollProgress />
          <CursorGlow />
          <AuthProvider>
            <PageTransition>{children}</PageTransition>
          </AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
