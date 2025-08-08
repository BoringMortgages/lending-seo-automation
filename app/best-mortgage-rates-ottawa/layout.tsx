import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Ottawa 2025 | Compare 35+ Lenders | No Municipal LTT",
  description: "Get Ottawa's lowest mortgage rates from 35+ lenders. Compare live rates, calculate payments, and save on land transfer tax. Federal employee mortgage programs available. Free pre-approval in 2 minutes.",
  keywords: "best mortgage rates Ottawa, Ottawa mortgage broker, mortgage calculator Ottawa, Ottawa home prices, federal employee mortgage, government worker mortgage Ottawa, capital region mortgage rates, Ottawa mortgage pre approval, cheap mortgage rates Ottawa, NCR mortgage financing",
  authors: [{ name: "Boring Mortgages Ontario" }],
  openGraph: {
    title: "Best Mortgage Rates Ottawa 2025 | Compare 35+ Lenders | No Municipal LTT",
    description: "Get Ottawa's lowest mortgage rates from 35+ lenders. Compare live rates, calculate payments, and save on land transfer tax. Federal employee programs available.",
    url: "https://boringmortgages.ca/best-mortgage-rates-ottawa",
    siteName: "Boring Mortgages Ontario",
    type: "website",
    images: [
      {
        url: "/logos/ottawa-mortgages-gradient.png",
        width: 500,
        height: 120,
        alt: "Best Mortgage Rates Ottawa"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Ottawa 2025 | Compare 35+ Lenders",
    description: "Get Ottawa's lowest mortgage rates from 35+ lenders. Federal employee mortgage programs available. Save on land transfer tax.",
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
    canonical: "https://boringmortgages.ca/best-mortgage-rates-ottawa",
  },
  other: {
    "geo.region": "CA-ON",
    "geo.placename": "Ottawa",
    "geo.position": "45.421530;-75.697193",
    "ICBM": "45.421530, -75.697193"
  }
};

export default function OttawaMortgageRatesLayout({
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
            "name": "Best Mortgage Rates Ottawa - Boring Mortgages",
            "description": "Compare Ottawa's best mortgage rates from 35+ lenders. Licensed Ontario mortgage brokers specializing in federal employee mortgages and NCR market.",
            "url": "https://boringmortgages.ca/best-mortgage-rates-ottawa",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Ottawa",
              "addressRegion": "ON",
              "addressCountry": "CA"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "45.421530",
              "longitude": "-75.697193"
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Ottawa",
                "containedInPlace": {
                  "@type": "State",
                  "name": "Ontario"
                }
              },
              {
                "@type": "City",
                "name": "Gatineau",
                "containedInPlace": {
                  "@type": "State",
                  "name": "Quebec"
                }
              }
            ],
            "serviceType": "Mortgage Brokerage",
            "offers": {
              "@type": "Offer",
              "name": "Ottawa Mortgage Rate Comparison",
              "description": "Compare mortgage rates from 35+ lenders in Ottawa and National Capital Region",
              "category": "Financial Service"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Ottawa Mortgage Rates",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "LoanOrCredit",
                    "name": "Federal Employee Mortgage",
                    "description": "Special mortgage programs for federal government employees in Ottawa"
                  }
                },
                {
                  "@type": "Offer", 
                  "itemOffered": {
                    "@type": "LoanOrCredit",
                    "name": "5-Year Fixed Mortgage",
                    "description": "Best 5-year fixed mortgage rates in Ottawa"
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