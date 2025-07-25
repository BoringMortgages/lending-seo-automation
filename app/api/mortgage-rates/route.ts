import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch from the Canadian mortgage rates service
    const response = await fetch('https://mortgage-rates-service.vercel.app/', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rates');
    }

    const data = await response.json();
    
    // Filter and format rates for Ontario/Toronto
    const ontarioRates = data.mortgages?.map((provider: any) => ({
      provider: provider.provider,
      rates: provider.rates?.map((rate: any) => ({
        term: rate.type,
        rate: `${rate.rate}%`,
        type: rate.type.includes('fixed') ? 'Fixed' : 'Variable',
        lender: provider.provider,
        comment: rate.comment || '',
        payment: calculatePayment(rate.rate, rate.type) // Helper function
      }))
    })) || [];

    return NextResponse.json({
      rates: ontarioRates,
      lastUpdated: new Date().toISOString(),
      source: 'Canadian Mortgage Rates Service'
    });

  } catch (error) {
    console.error('Error fetching mortgage rates:', error);
    
    // Fallback to current rates if API fails
    return NextResponse.json({
      rates: [
        {
          provider: "Monoline Lenders",
          rates: [
            { term: "5-years-fixed", rate: "3.94%", type: "Fixed", lender: "Monoline", payment: "$4,710" },
            { term: "3-years-fixed", rate: "3.94%", type: "Fixed", lender: "Monoline", payment: "$4,710" },
            { term: "1-year-fixed", rate: "4.69%", type: "Fixed", lender: "Monoline", payment: "$4,890" }
          ]
        },
        {
          provider: "Big Banks",
          rates: [
            { term: "5-years-fixed", rate: "4.89%", type: "Fixed", lender: "Big Bank", payment: "$5,020" },
            { term: "5-years-variable", rate: "3.95%", type: "Variable", lender: "Big Bank", payment: "$4,715" }
          ]
        }
      ],
      lastUpdated: new Date().toISOString(),
      source: 'Fallback Rates'
    });
  }
}

// Helper function to calculate estimated payment
function calculatePayment(rate: number, term: string): string {
  const principal = 1000000; // $1M mortgage
  const monthlyRate = rate / 100 / 12;
  const years = term.includes('5') ? 5 : term.includes('3') ? 3 : 1;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) return `$${Math.round(principal / numPayments).toLocaleString()}`;
  
  const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                 (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return `$${Math.round(payment).toLocaleString()}`;
} 