import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boring Mortgages Ontario | Making Complex Mortgages Boringly Simple",
  description: "Canada's most comprehensive mortgage comparison site. Compare rates, calculate payments, and get expert guidance from licensed Ontario mortgage professionals. Free tools, current rates, and boring details that save you thousands.",
  keywords: "Ontario mortgage rates, mortgage calculator, mortgage comparison, Canadian mortgage broker, HELOC calculator, mortgage affordability, Toronto mortgage, Ottawa mortgage rates",
  authors: [{ name: "Boring Mortgages Ontario" }],
  openGraph: {
    title: "Boring Mortgages Ontario | Making Complex Mortgages Boringly Simple",
    description: "Canada's most comprehensive mortgage comparison site with free calculators and expert guidance.",
    url: "https://boringmortgages.ca",
    siteName: "Boring Mortgages Ontario",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boring Mortgages Ontario | Making Complex Mortgages Boringly Simple",
    description: "Canada's most comprehensive mortgage comparison site with free calculators and expert guidance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "4tV5jIE_IULITJE5DH5BqjJMc6Vfh0pECWNZ5o84J_M",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://boringmortgages.ca" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "Boring Mortgages Ontario",
              "description": "Comprehensive mortgage comparison and calculator tools for Ontario residents",
              "url": "https://boringmortgages.ca",
              "address": {
                "@type": "PostalAddress",
                "addressRegion": "ON",
                "addressCountry": "CA"
              },
              "serviceArea": {
                "@type": "State",
                "name": "Ontario"
              },
              "offers": {
                "@type": "Service",
                "name": "Mortgage Comparison and Calculation Tools"
              }
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
