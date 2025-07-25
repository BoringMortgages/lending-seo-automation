// Load environment variables from a .env file
import 'dotenv/config';
import FirecrawlApp from 'firecrawl';

// Initialize Firecrawl
const firecrawl = new FirecrawlApp({ 
  apiKey: process.env.FIRECRAWL_API_KEY 
});

// Check if API key is set
if (!process.env.FIRECRAWL_API_KEY) {
  console.error('Error: FIRECRAWL_API_KEY is not set in your environment variables.');
  process.exit(1);
}

// Quick preview of top competitors
const PREVIEW_COMPETITORS = [
  {
    name: "Your Site",
    url: "https://www.mortgagewithford.ca",
    focus: "Personal branding, community-focused"
  },
  {
    name: "Moore Mortgages", 
    url: "https://www.mooremortgages.ca/",
    focus: "Team-based approach, multiple brokers"
  },
  {
    name: "Dominion Lending Centres",
    url: "https://dominionlending.ca/",
    focus: "Large network, renewal focus"
  },
  {
    name: "Tango Financial",
    url: "https://tangofinancial.ca/",
    focus: "Broker recruitment, industry-focused"
  }
];

async function quickCompetitorPreview() {
  console.log('🔍 QUICK COMPETITOR PREVIEW');
  console.log('=' .repeat(50));
  
  for (const competitor of PREVIEW_COMPETITORS) {
    console.log(`\n📄 Analyzing: ${competitor.name}`);
    console.log(`🎯 Expected Focus: ${competitor.focus}`);
    console.log(`🔗 URL: ${competitor.url}`);
    
    try {
      const result = await firecrawl.scrapeUrl(competitor.url, {
        formats: ['markdown'],
        onlyMainContent: true,
        timeout: 15000
      });
      
      if (result.success) {
        const content = result.markdown || '';
        const contentLength = content.length;
        
        // Quick keyword analysis
        const keywords = [
          'mortgage', 'broker', 'rate', 'loan', 'refinance', 
          'renewal', 'first time', 'calculator', 'pre-approval'
        ];
        
        const foundKeywords = keywords.filter(keyword => 
          content.toLowerCase().includes(keyword)
        );
        
        // Extract title and description
        const title = result.metadata?.title || 'No title found';
        const description = result.metadata?.description || 'No description found';
        
        console.log(`✅ Successfully scraped`);
        console.log(`📊 Content: ${contentLength} characters`);
        console.log(`📝 Title: ${title.substring(0, 80)}...`);
        console.log(`📄 Description: ${description.substring(0, 100)}...`);
        console.log(`🔑 Keywords found: ${foundKeywords.join(', ')}`);
        console.log(`📈 Keyword count: ${foundKeywords.length}/9`);
        
        // Quick content insights
        const hasCalculator = /calculator|calculate/gi.test(content);
        const hasRates = /rate|rates/gi.test(content);
        const hasTeam = /team|staff|broker/gi.test(content);
        const hasBlog = /blog|article|news/gi.test(content);
        
        console.log(`🎯 Features detected:`);
        console.log(`   - Calculator: ${hasCalculator ? '✅' : '❌'}`);
        console.log(`   - Rates info: ${hasRates ? '✅' : '❌'}`);
        console.log(`   - Team info: ${hasTeam ? '✅' : '❌'}`);
        console.log(`   - Blog/News: ${hasBlog ? '✅' : '❌'}`);
        
      } else {
        console.log(`❌ Failed to scrape: ${result.error}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    // Small delay between requests
    if (PREVIEW_COMPETITORS.indexOf(competitor) < PREVIEW_COMPETITORS.length - 1) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🎯 QUICK INSIGHTS:');
  console.log('=' .repeat(50));
  console.log('Based on this preview, your updated competitor list includes:');
  console.log('• Moore Mortgages - Local team-based competitor');
  console.log('• Dominion Lending - Large franchise network');
  console.log('• Tango Financial - B2B broker services');
  console.log('• + 4 more specialized competitors');
  console.log('\nRun the full analysis with: node scripts/competitor-analysis.mjs');
}

// Run the preview
quickCompetitorPreview().catch(console.error); 