import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Hamilton 2025 | Compare 30+ Lenders | No Municipal LTT",
  description: "Get Hamilton's lowest mortgage rates from 30+ lenders. Compare live rates for average home price $826K. Save on land transfer tax vs Toronto. Free pre-approval in 2 minutes from licensed Ontario brokers.",
  keywords: "best mortgage rates Hamilton, Hamilton mortgage broker, mortgage calculator Hamilton, Hamilton home prices, steel city mortgage rates, Hamilton mortgage pre approval, cheap mortgage rates Hamilton, Greater Hamilton Area mortgage, RAHB mortgage rates, Hamilton first time buyer",
  authors: [{ name: "Boring Mortgages Ontario" }],
  openGraph: {
    title: "Best Mortgage Rates Hamilton 2025 | Compare 30+ Lenders | No Municipal LTT",
    description: "Get Hamilton's lowest mortgage rates from 30+ lenders. Compare live rates for average home price $826K. Save on land transfer tax vs Toronto.",
    url: "https://boringmortgages.ca/best-mortgage-rates-hamilton",
    siteName: "Boring Mortgages Ontario",
    type: "website",
    images: [
      {
        url: "/logos/hamilton-mortgages-gradient.png",
        width: 500,
        height: 120,
        alt: "Best Mortgage Rates Hamilton"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Hamilton 2025 | Compare 30+ Lenders",
    description: "Get Hamilton's lowest mortgage rates from 30+ lenders. Compare live rates for average home price $826K. Save on land transfer tax.",
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
    canonical: "https://boringmortgages.ca/best-mortgage-rates-hamilton",
  },
  other: {
    "geo.region": "CA-ON",
    "geo.placename": "Hamilton",
    "geo.position": "43.255722;-79.871139",
    "ICBM": "43.255722, -79.871139"
  }
};

export default function HamiltonMortgageRatesLayout({
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
            "name": "Best Mortgage Rates Hamilton - Boring Mortgages",
            "description": "Compare Hamilton's best mortgage rates from 30+ lenders. Licensed Ontario mortgage brokers helping Hamilton homebuyers save thousands on affordable homes.",
            "url": "https://boringmortgages.ca/best-mortgage-rates-hamilton",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Hamilton",
              "addressRegion": "ON",
              "addressCountry": "CA"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "43.255722",
              "longitude": "-79.871139"
            },
            "areaServed": {
              "@type": "City",
              "name": "Hamilton",
              "containedInPlace": {
                "@type": "State",
                "name": "Ontario"
              }
            },
            "serviceType": "Mortgage Brokerage",
            "offers": {
              "@type": "Offer",
              "name": "Hamilton Mortgage Rate Comparison",
              "description": "Compare mortgage rates from 30+ lenders in Hamilton and Greater Hamilton Area",
              "category": "Financial Service"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Hamilton Mortgage Rates",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "LoanOrCredit",
                    "name": "5-Year Fixed Mortgage",
                    "description": "Best 5-year fixed mortgage rates in Hamilton"
                  }
                },
                {
                  "@type": "Offer", 
                  "itemOffered": {
                    "@type": "LoanOrCredit",
                    "name": "First-Time Buyer Mortgage",
                    "description": "Special mortgage programs for first-time homebuyers in Hamilton"
                  }
                }
              ]
            },
            "priceRange": "$$",
            "knowsAbout": ["Hamilton real estate market", "RAHB housing data", "Ontario land transfer tax", "CMHC insurance requirements"]
          }),
        }}
      />
      {children}
    </>
  );
}