import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Toronto 2025 | Compare 40+ Lenders | Save $12,000",
  description: "Get Toronto's lowest mortgage rates from 40+ lenders. Compare live rates, calculate payments with Toronto land transfer tax, and save thousands with our licensed Ontario mortgage brokers. Free pre-approval in 2 minutes.",
  keywords: "best mortgage rates Toronto, Toronto mortgage broker, mortgage calculator Toronto, Toronto home prices, land transfer tax Toronto, first time buyer Toronto, GTA mortgage rates, Toronto mortgage pre approval, cheap mortgage rates Toronto, Toronto real estate financing",
  authors: [{ name: "Boring Mortgages Ontario" }],
  openGraph: {
    title: "Best Mortgage Rates Toronto 2025 | Compare 40+ Lenders | Save $12,000",
    description: "Get Toronto's lowest mortgage rates from 40+ lenders. Compare live rates, calculate payments with Toronto land transfer tax, and save thousands.",
    url: "https://boringmortgages.ca/best-mortgage-rates-toronto",
    siteName: "Boring Mortgages Ontario",
    type: "website",
    images: [
      {
        url: "/logos/toronto-mortgages-gradient.png",
        width: 500,
        height: 120,
        alt: "Best Mortgage Rates Toronto"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Toronto 2025 | Compare 40+ Lenders",
    description: "Get Toronto's lowest mortgage rates from 40+ lenders. Compare live rates and save thousands with our licensed Ontario mortgage brokers.",
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
  alternates: {
    canonical: "https://boringmortgages.ca/best-mortgage-rates-toronto",
  },
  other: {
    "geo.region": "CA-ON",
    "geo.placename": "Toronto",
    "geo.position": "43.651070;-79.347015",
    "ICBM": "43.651070, -79.347015"
  }
};

export default function TorontoMortgageRatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["FinancialService", "LocalBusiness"],
            "name": "Best Mortgage Rates Toronto - Boring Mortgages",
            "description": "Compare Toronto's best mortgage rates from 40+ lenders. Licensed Ontario mortgage brokers helping Toronto homebuyers save thousands.",
            "url": "https://boringmortgages.ca/best-mortgage-rates-toronto",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Toronto",
              "addressRegion": "ON",
              "addressCountry": "CA"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "43.651070",
              "longitude": "-79.347015"
            },
            "areaServed": {
              "@type": "City",
              "name": "Toronto",
              "containedInPlace": {
                "@type": "State",
                "name": "Ontario"
              }
            },
            "serviceType": "Mortgage Brokerage",
            "offers": {
              "@type": "Offer",
              "name": "Toronto Mortgage Rate Comparison",
              "description": "Compare mortgage rates from 40+ lenders in Toronto",
              "category": "Financial Service"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Toronto Mortgage Rates",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "LoanOrCredit",
                    "name": "5-Year Fixed Mortgage",
                    "description": "Best 5-year fixed mortgage rates in Toronto"
                  }
                },
                {
                  "@type": "Offer", 
                  "itemOffered": {
                    "@type": "LoanOrCredit",
                    "name": "Variable Rate Mortgage",
                    "description": "Competitive variable mortgage rates in Toronto"
                  }
                }
              ]
            }
          }),
        }}
      />
      {children}
    </>
  );
}