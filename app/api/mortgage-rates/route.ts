import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Read from single source rate data
    const dataDir = path.join(process.cwd(), 'data', 'rates');
    const masterRatesPath = path.join(dataDir, 'master-rates.json');
    
    let rateData;
    try {
      const rateContent = await fs.readFile(masterRatesPath, 'utf-8');
      rateData = JSON.parse(rateContent);
    } catch (error) {
      console.log('No rate data found');
      throw new Error('Rate data not available');
    }

    // Check if data is fresh (less than 4 days old)
    const dataAge = Date.now() - new Date(rateData.scrapedAt).getTime();
    const fourDays = 4 * 24 * 60 * 60 * 1000;
    
    if (dataAge > fourDays) {
      console.log('Rate data is stale, needs refresh');
    }

    // Format rates for the frontend
    const formattedRates = [{
      provider: rateData.source,
      rates: rateData.rates.map((rate: any) => ({
        term: rate.term,
        rate: rate.rate,
        type: rate.type,
        lender: rate.lender,
        payment: rate.payment,
        popular: rate.term === '5 Year' && rate.type === 'Fixed'
      }))
    }];

    return NextResponse.json({
      rates: formattedRates,
      lastUpdated: rateData.scrapedAt,
      source: rateData.source,
      dataAge: Math.round(dataAge / (1000 * 60 * 60)) + ' hours'
    });

  } catch (error) {
    console.error('Error fetching mortgage rates:', error);
    
    // Fallback to default rates if master rates are unavailable
    const fallbackRates = [{
      provider: "Ontario Lenders",
      rates: [
        { term: "1 Year", rate: "4.69%", type: "Fixed", lender: "Monoline", payment: "$3,970" },
        { term: "2 Year", rate: "4.24%", type: "Fixed", lender: "Credit Union", payment: "$3,880" },
        { term: "3 Year", rate: "3.94%", type: "Fixed", lender: "Monoline", payment: "$3,810" },
        { term: "5 Year", rate: "3.94%", type: "Fixed", lender: "Monoline", payment: "$3,810", popular: true },
        { term: "5 Year Variable", rate: "3.95%", type: "Variable", lender: "Major Bank", payment: "$3,815" },
        { term: "10 Year", rate: "4.89%", type: "Fixed", lender: "Major Bank", payment: "$4,060" }
      ]
    }];

    return NextResponse.json({
      rates: fallbackRates,
      lastUpdated: new Date().toISOString(),
      source: "Fallback Rates",
      dataAge: "0 hours"
    });
  }
}

// Remove the old format function as we're using direct data

 