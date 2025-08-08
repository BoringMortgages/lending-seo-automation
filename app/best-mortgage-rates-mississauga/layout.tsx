import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Mortgage Rates Mississauga 2025 | Compare 35+ Lenders | Save $15K vs Toronto",
  description: "Get Mississauga's lowest mortgage rates from 35+ lenders. Compare live rates for average home price $925K. No municipal land transfer tax saves $15K vs Toronto. Free pre-approval in 2 minutes.",
  keywords: "best mortgage rates Mississauga, Mississauga mortgage broker, mortgage calculator Mississauga, Mississauga home prices, GTA West mortgage rates, Mississauga mortgage pre approval, cheap mortgage rates Mississauga, Peel Region mortgage, Mississauga first time buyer, TRREB mortgage rates",
  authors: [{ name: "Boring Mortgages Ontario" }],
  openGraph: {
    title: "Best Mortgage Rates Mississauga 2025 | Compare 35+ Lenders | Save $15K vs Toronto",
    description: "Get Mississauga's lowest mortgage rates from 35+ lenders. Compare live rates for average home price $925K. No municipal land transfer tax saves $15K vs Toronto.",
    url: "https://boringmortgages.ca/best-mortgage-rates-mississauga",
    siteName: "Boring Mortgages Ontario",
    type: "website",
    images: [
      {
        url: "/logos/mississauga-mortgages-gradient.png",
        width: 500,
        height: 120,
        alt: "Best Mortgage Rates Mississauga"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Mortgage Rates Mississauga 2025 | Compare 35+ Lenders",
    description: "Get Mississauga's lowest mortgage rates from 35+ lenders. Compare live rates for average home price $925K. Save $15K vs Toronto.",
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
    canonical: "https://boringmortgages.ca/best-mortgage-rates-mississauga",
  },
  other: {
    "geo.region": "CA-ON",
    "geo.placename": "Mississauga",
    "geo.position": "43.595310;-79.640579",
    "ICBM": "43.595310, -79.640579"
  }
};

export default function MississaugaMortgageRatesLayout({
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
            "name": "Best Mortgage Rates Mississauga - Boring Mortgages",
            "description": "Compare Mississauga's best mortgage rates from 35+ lenders. Licensed Ontario mortgage brokers helping GTA West homebuyers save thousands.",
            "url": "https://boringmortgages.ca/best-mortgage-rates-mississauga",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Mississauga",
              "addressRegion": "ON",
              "addressCountry": "CA"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "43.595310",
              "longitude": "-79.640579"
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Mississauga",
                "containedInPlace": {
                  "@type": "State",
                  "name": "Ontario"
                }
              },
              {
                "@type": "AdministrativeArea",
                "name": "Peel Region",
                "containedInPlace": {
                  "@type": "State",
                  "name": "Ontario"
                }
              }
            ],
            "serviceType": "Mortgage Brokerage",
            "offers": {
              "@type": "Offer",
              "name": "Mississauga Mortgage Rate Comparison",
              "description": "Compare mortgage rates from 35+ lenders in Mississauga and GTA West",
              "category": "Financial Service"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Mississauga Mortgage Rates",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "LoanOrCredit",
                    "name": "5-Year Fixed Mortgage",
                    "description": "Best 5-year fixed mortgage rates in Mississauga"
                  }
                },
                {
                  "@type": "Offer", 
                  "itemOffered": {
                    "@type": "LoanOrCredit",
                    "name": "GTA Alternative Mortgage",
                    "description": "Competitive mortgage alternatives to Toronto market in Mississauga"
                  }
                }
              ]
            },
            "priceRange": "$$",
            "knowsAbout": ["Mississauga real estate market", "TRREB housing data", "Peel Region programs", "GTA West market dynamics", "Land transfer tax savings"]
          }),
        }}
      />
      {children}
    </>
  );
}