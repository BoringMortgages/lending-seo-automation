// Load environment variables from a .env file
import 'dotenv/config';
import FirecrawlApp from 'firecrawl';
import fs from 'fs/promises';

// Initialize Firecrawl
const firecrawl = new FirecrawlApp({ 
  apiKey: process.env.FIRECRAWL_API_KEY 
});

// Check if API key is set
if (!process.env.FIRECRAWL_API_KEY) {
  console.error('Error: FIRECRAWL_API_KEY is not set in your environment variables.');
  process.exit(1);
}

// Major Canadian mortgage lenders for comparison pages
const CANADIAN_LENDERS = [
  'TD Bank', 'RBC Royal Bank', 'Scotiabank', 'BMO Bank of Montreal', 
  'CIBC', 'National Bank', 'Tangerine', 'PC Financial', 'HSBC Canada',
  'First National', 'MCAP', 'Meridian Credit Union', 'Desjardins',
  'Paymi', 'Street Capital', 'CMLS Financial', 'Merix Financial'
];

// Mortgage product types for comparison
const MORTGAGE_TYPES = [
  'Fixed Rate Mortgage', 'Variable Rate Mortgage', 'Adjustable Rate Mortgage',
  'Conventional Mortgage', 'High Ratio Mortgage', 'HELOC', 'Second Mortgage',
  'Reverse Mortgage', 'Construction Mortgage', 'Investment Property Mortgage',
  'Self-Employed Mortgage', 'Non-Resident Mortgage', 'Jumbo Mortgage'
];

// Major Ontario cities for location-based pages
const ONTARIO_CITIES = [
  'Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London',
  'Markham', 'Vaughan', 'Kitchener', 'Windsor', 'Richmond Hill', 'Oakville',
  'Burlington', 'Oshawa', 'Barrie', 'St. Catharines', 'Cambridge', 'Waterloo',
  'Guelph', 'Sudbury', 'Kingston', 'Thunder Bay', 'Peterborough', 'Brantford'
];

// Calculator types for tool pages
const CALCULATOR_TYPES = [
  'Mortgage Payment', 'Affordability', 'Mortgage Qualification', 'HELOC Payment',
  'Refinancing', 'Prepayment', 'Amortization', 'Land Transfer Tax',
  'Closing Costs', 'Mortgage Insurance', 'Interest Rate Comparison',
  'Debt Service Ratio', 'Stress Test', 'Investment Property ROI'
];

// Generate programmatic keyword opportunities
async function generateKeywordOpportunities() {
  console.log('🔍 MORTGAGE PROGRAMMATIC SEO KEYWORD RESEARCH');
  console.log('=' .repeat(60));
  
  const keywordData = {
    lenderComparisons: [],
    productComparisons: [],
    locationPages: [],
    calculatorPages: [],
    guidePages: [],
    totalOpportunities: 0
  };

  // 1. Generate Lender Comparison Keywords
  console.log('\n📊 Generating Lender Comparison Keywords...');
  for (let i = 0; i < CANADIAN_LENDERS.length; i++) {
    for (let j = i + 1; j < CANADIAN_LENDERS.length; j++) {
      const lender1 = CANADIAN_LENDERS[i];
      const lender2 = CANADIAN_LENDERS[j];
      
      const comparison = {
        title: `${lender1} vs ${lender2} Mortgage Comparison 2025`,
        slug: `${lender1.toLowerCase().replace(/\s+/g, '-')}-vs-${lender2.toLowerCase().replace(/\s+/g, '-')}-mortgage`,
        primaryKeyword: `${lender1} vs ${lender2} mortgage`,
        secondaryKeywords: [
          `${lender1} vs ${lender2} rates`,
          `${lender1} vs ${lender2} mortgage rates`,
          `${lender1} or ${lender2} mortgage`,
          `compare ${lender1} ${lender2} mortgage`
        ],
        searchVolume: 'Low-Medium (50-200/month)',
        difficulty: 'Medium',
        intent: 'Commercial',
        pageType: 'lender-comparison'
      };
      
      keywordData.lenderComparisons.push(comparison);
    }
  }

  // 2. Generate Product Comparison Keywords
  console.log('📈 Generating Product Comparison Keywords...');
  for (let i = 0; i < MORTGAGE_TYPES.length; i++) {
    for (let j = i + 1; j < MORTGAGE_TYPES.length; j++) {
      const product1 = MORTGAGE_TYPES[i];
      const product2 = MORTGAGE_TYPES[j];
      
      const comparison = {
        title: `${product1} vs ${product2} - Which is Better in 2025?`,
        slug: `${product1.toLowerCase().replace(/\s+/g, '-')}-vs-${product2.toLowerCase().replace(/\s+/g, '-')}`,
        primaryKeyword: `${product1} vs ${product2}`,
        secondaryKeywords: [
          `${product1} or ${product2}`,
          `difference between ${product1} and ${product2}`,
          `${product1} vs ${product2} Canada`,
          `should I choose ${product1} or ${product2}`
        ],
        searchVolume: 'Medium (100-500/month)',
        difficulty: 'Medium-High',
        intent: 'Informational/Commercial',
        pageType: 'product-comparison'
      };
      
      keywordData.productComparisons.push(comparison);
    }
  }

  // 3. Generate Location-Based Keywords
  console.log('🏘️ Generating Location-Based Keywords...');
  ONTARIO_CITIES.forEach(city => {
    const locationPage = {
      title: `Best Mortgage Rates in ${city}, Ontario 2025`,
      slug: `best-mortgage-rates-${city.toLowerCase().replace(/\s+/g, '-')}-ontario`,
      primaryKeyword: `best mortgage rates ${city}`,
      secondaryKeywords: [
        `${city} mortgage broker`,
        `mortgage rates ${city} Ontario`,
        `${city} first time buyer mortgage`,
        `${city} mortgage lenders`,
        `${city} home loan rates`
      ],
      searchVolume: 'Medium-High (200-1000/month)',
      difficulty: 'High',
      intent: 'Commercial',
      pageType: 'location-based'
    };
    
    keywordData.locationPages.push(locationPage);
  });

  // 4. Generate Calculator Keywords
  console.log('🧮 Generating Calculator Keywords...');
  CALCULATOR_TYPES.forEach(calcType => {
    const calculatorPage = {
      title: `${calcType} Calculator - Free Mortgage Tool`,
      slug: `${calcType.toLowerCase().replace(/\s+/g, '-')}-calculator`,
      primaryKeyword: `${calcType} calculator`,
      secondaryKeywords: [
        `${calcType} calculator Canada`,
        `free ${calcType} calculator`,
        `${calcType} calculator Ontario`,
        `online ${calcType} calculator`
      ],
      searchVolume: 'High (500-2000/month)',
      difficulty: 'Medium',
      intent: 'Informational/Tool',
      pageType: 'calculator'
    };
    
    keywordData.calculatorPages.push(calculatorPage);
  });

  // 5. Generate Guide Keywords
  console.log('📚 Generating Guide Keywords...');
  const guideTopics = [
    'First Time Home Buyer', 'Mortgage Pre-Approval', 'Mortgage Refinancing',
    'Mortgage Renewal', 'Investment Property Financing', 'Self-Employed Mortgage',
    'Mortgage Stress Test', 'Down Payment Assistance', 'Mortgage Insurance',
    'HELOC vs Second Mortgage', 'Mortgage Broker vs Bank', 'Bad Credit Mortgage'
  ];

  guideTopics.forEach(topic => {
    const guidePage = {
      title: `Complete Guide to ${topic} in Canada 2025`,
      slug: `${topic.toLowerCase().replace(/\s+/g, '-')}-guide-canada`,
      primaryKeyword: `${topic} guide Canada`,
      secondaryKeywords: [
        `how to ${topic.toLowerCase()}`,
        `${topic} requirements Canada`,
        `${topic} process Ontario`,
        `${topic} tips Canada`
      ],
      searchVolume: 'Medium-High (300-1500/month)',
      difficulty: 'Medium-High',
      intent: 'Informational',
      pageType: 'guide'
    };
    
    keywordData.guidePages.push(guidePage);
  });

  // Calculate total opportunities
  keywordData.totalOpportunities = 
    keywordData.lenderComparisons.length +
    keywordData.productComparisons.length +
    keywordData.locationPages.length +
    keywordData.calculatorPages.length +
    keywordData.guidePages.length;

  // Display summary
  displayKeywordSummary(keywordData);

  // Save detailed keyword data
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `programmatic-keywords-${timestamp}.json`;
  
  await fs.writeFile(filename, JSON.stringify(keywordData, null, 2));
  console.log(`\n📁 Detailed keyword data saved to: ${filename}`);

  return keywordData;
}

// Display keyword research summary
function displayKeywordSummary(data) {
  console.log('\n📊 PROGRAMMATIC SEO KEYWORD OPPORTUNITIES');
  console.log('=' .repeat(60));
  
  console.log(`\n🎯 Total Page Opportunities: ${data.totalOpportunities}`);
  
  console.log(`\n📈 Breakdown by Page Type:`);
  console.log(`• Lender Comparisons: ${data.lenderComparisons.length} pages`);
  console.log(`• Product Comparisons: ${data.productComparisons.length} pages`);
  console.log(`• Location Pages: ${data.locationPages.length} pages`);
  console.log(`• Calculator Pages: ${data.calculatorPages.length} pages`);
  console.log(`• Guide Pages: ${data.guidePages.length} pages`);

  console.log(`\n🏆 Top Opportunities by Category:`);
  
  // Show top lender comparisons
  console.log(`\n1. Lender Comparisons (Sample):`);
  data.lenderComparisons.slice(0, 5).forEach((comp, index) => {
    console.log(`   ${index + 1}. ${comp.title}`);
    console.log(`      • Primary: "${comp.primaryKeyword}"`);
    console.log(`      • Volume: ${comp.searchVolume}`);
  });

  // Show top product comparisons
  console.log(`\n2. Product Comparisons (Sample):`);
  data.productComparisons.slice(0, 5).forEach((comp, index) => {
    console.log(`   ${index + 1}. ${comp.title}`);
    console.log(`      • Primary: "${comp.primaryKeyword}"`);
    console.log(`      • Volume: ${comp.searchVolume}`);
  });

  // Show top location pages
  console.log(`\n3. Location Pages (Sample):`);
  data.locationPages.slice(0, 5).forEach((comp, index) => {
    console.log(`   ${index + 1}. ${comp.title}`);
    console.log(`      • Primary: "${comp.primaryKeyword}"`);
    console.log(`      • Volume: ${comp.searchVolume}`);
  });

  // Show calculator opportunities
  console.log(`\n4. Calculator Pages (Sample):`);
  data.calculatorPages.slice(0, 5).forEach((comp, index) => {
    console.log(`   ${index + 1}. ${comp.title}`);
    console.log(`      • Primary: "${comp.primaryKeyword}"`);
    console.log(`      • Volume: ${comp.searchVolume}`);
  });

  console.log(`\n💡 Traffic Potential:`);
  console.log(`• Conservative estimate: 20 visitors/page/month`);
  console.log(`• Total monthly traffic potential: ${(data.totalOpportunities * 20).toLocaleString()} visitors`);
  console.log(`• At 5% conversion rate: ${Math.round(data.totalOpportunities * 20 * 0.05)} leads/month`);

  console.log(`\n🚀 Implementation Priority:`);
  console.log(`1. Calculator pages (highest volume, tool-based)`);
  console.log(`2. Location pages (local SEO advantage)`);
  console.log(`3. Product comparisons (educational, high intent)`);
  console.log(`4. Lender comparisons (commercial intent)`);
  console.log(`5. Guide pages (authority building)`);

  console.log(`\n📋 Next Steps:`);
  console.log(`• Start with 50 highest-priority pages`);
  console.log(`• Focus on calculator and location pages first`);
  console.log(`• Build templates for each page type`);
  console.log(`• Set up automated content generation`);
}

// Generate keyword opportunities for specific competitors
async function analyzeCompetitorKeywords() {
  console.log('\n🔍 ANALYZING COMPETITOR KEYWORD STRATEGIES');
  console.log('=' .repeat(50));

  const competitorUrls = [
    'https://www.ratehub.ca',
    'https://www.ratesdotca.ca',
    'https://www.mortgagealliance.com'
  ];

  for (const url of competitorUrls) {
    console.log(`\n📄 Analyzing: ${url}`);
    
    try {
      const result = await firecrawl.scrapeUrl(url, {
        formats: ['markdown'],
        onlyMainContent: true,
        timeout: 15000
      });
      
      if (result.success) {
        const content = result.markdown || '';
        
        // Extract potential keywords from content
        const mortgageTerms = [
          'mortgage calculator', 'mortgage rates', 'mortgage comparison',
          'home loan', 'refinancing', 'mortgage renewal', 'first time buyer'
        ];
        
        const foundTerms = mortgageTerms.filter(term => 
          content.toLowerCase().includes(term)
        );
        
        console.log(`✅ Found ${foundTerms.length} relevant terms`);
        console.log(`📊 Content length: ${content.length} characters`);
        console.log(`🔑 Key terms: ${foundTerms.slice(0, 5).join(', ')}`);
        
        // Look for page structure patterns
        const hasComparisons = /vs|versus|compare/gi.test(content);
        const hasCalculators = /calculator|calculate/gi.test(content);
        const hasRates = /rate|rates/gi.test(content);
        
        console.log(`🎯 Page features:`);
        console.log(`   • Comparisons: ${hasComparisons ? '✅' : '❌'}`);
        console.log(`   • Calculators: ${hasCalculators ? '✅' : '❌'}`);
        console.log(`   • Rate info: ${hasRates ? '✅' : '❌'}`);
        
      } else {
        console.log(`❌ Failed to scrape: ${result.error}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    // Delay between requests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

// Main execution
async function main() {
  try {
    // Generate keyword opportunities
    const keywordData = await generateKeywordOpportunities();
    
    // Analyze competitor strategies
    await analyzeCompetitorKeywords();
    
    console.log('\n🎉 Keyword research complete!');
    console.log('Next step: Use this data to build programmatic SEO pages');
    
  } catch (error) {
    console.error('❌ Research failed:', error.message);
    process.exit(1);
  }
}

// Run the analysis
main(); 