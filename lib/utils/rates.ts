import { type MortgageRate, getBestFor } from '@/lib/constants/cmhc';

// Centralized rate fetching utility
export async function fetchMortgageRates(): Promise<MortgageRate[]> {
  try {
    const response = await fetch('/api/mortgage-rates');
    const data = await response.json();
    
    if (data.rates && data.rates.length > 0) {
      return data.rates.flatMap((provider: any) => 
        provider.rates?.map((rate: any) => ({
          term: rate.term,
          rate: rate.rate,
          type: rate.type,
          bestFor: getBestFor(rate.term, rate.type),
          lender: rate.lender,
          payment: rate.payment,
          popular: rate.term === "5 Year" && rate.type === "Fixed"
        })) || []
      );
    }
  } catch (error) {
    console.error('Error fetching rates:', error);
  }
  
  // Return fallback rates if API fails
  return getFallbackRates();
}

// Server-side rate fetching for SSR
export async function fetchMortgageRatesSSR(): Promise<MortgageRate[]> {
  try {
    // Fix URL construction for server-side fetches
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      ? (process.env.NEXT_PUBLIC_SITE_URL.startsWith('http') 
          ? process.env.NEXT_PUBLIC_SITE_URL 
          : `https://${process.env.NEXT_PUBLIC_SITE_URL}`)
      : 'http://localhost:3006';
    
    const response = await fetch(`${baseUrl}/api/mortgage-rates`, {
      cache: 'force-cache',
      next: { revalidate: 14400 } // 4 hours
    });
    const data = await response.json();
    
    if (data.rates && data.rates.length > 0) {
      return data.rates.flatMap((provider: any) => 
        provider.rates?.map((rate: any) => ({
          term: rate.term,
          rate: rate.rate,
          type: rate.type,
          bestFor: getBestFor(rate.term, rate.type),
          lender: rate.lender,
          payment: rate.payment,
          popular: rate.term === "5 Year" && rate.type === "Fixed"
        })) || []
      );
    }
  } catch (error) {
    console.error('Error fetching rates server-side:', error);
  }
  
  // Return fallback rates if API fails
  return getFallbackRates();
}

// Fallback rates if API is unavailable
export function getFallbackRates(): MortgageRate[] {
  return [
    { term: "1 Year", rate: "4.69%", type: "Fixed", bestFor: "Rate speculation", lender: "Monoline", payment: "$3,970" },
    { term: "2 Year", rate: "4.24%", type: "Fixed", bestFor: "Short commitment", lender: "Credit Union", payment: "$3,880" },
    { term: "3 Year", rate: "3.94%", type: "Fixed", bestFor: "Medium-term security", lender: "Monoline", payment: "$3,810" },
    { term: "5 Year", rate: "3.94%", type: "Fixed", bestFor: "Most popular", popular: true, lender: "Monoline", payment: "$3,810" },
    { term: "5 Year Variable", rate: "3.95%", type: "Variable", bestFor: "Rate optimists", lender: "Major Bank", payment: "$3,815" },
    { term: "10 Year", rate: "4.89%", type: "Fixed", bestFor: "Long-term security", lender: "Major Bank", payment: "$4,060" }
  ];
}