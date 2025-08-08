import ClientHomepage from "../components/ClientHomepage";

// Rate interface
interface MortgageRate {
  term: string;
  rate: string;
  type: string;
  bestFor?: string;
  lender: string;
  payment?: string;
  popular?: boolean;
}

// Helper function to determine best for description
function getBestFor(term: string, type: string) {
  if (term === "5-years-fixed") return "Most popular";
  if (term === "3-years-fixed") return "Medium-term security";
  if (term === "1-year-fixed") return "Rate speculation";
  if (type === "Variable") return "Rate optimists";
  if (term === "2-years-fixed") return "Short commitment";
  if (term === "10-years-fixed") return "Long-term security";
  return "Flexible option";
}

// Server component to fetch initial rates
async function getRates(): Promise<MortgageRate[]> {
  try {
    // Fetch from internal API with absolute URL for server-side
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3006'}/api/mortgage-rates`, {
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
          popular: rate.term === "5-years-fixed" && rate.type === "Fixed"
        })) || []
      );
    }
  } catch (error) {
    console.error('Error fetching rates server-side:', error);
  }
  return [];
}

export default async function Home() {
  // Fetch rates server-side for better performance
  const initialRates = await getRates();

  return <ClientHomepage initialRates={initialRates} />;
}