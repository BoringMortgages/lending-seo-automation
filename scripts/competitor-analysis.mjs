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
  console.error('Please add FIRECRAWL_API_KEY=your_api_key_here to your .env file');
  process.exit(1);
}

// Competitor websites to analyze
const COMPETITORS = [
  {
    name: "Mortgage with Ford (Your Site)",
    url: "https://www.mortgagewithford.ca",
    type: "own"
  },
  {
    name: "Moore Mortgages",
    url: "https://www.mooremortgages.ca/",
    type: "competitor"
  },
  {
    name: "Dominion Lending Centres",
    url: "https://dominionlending.ca/",
    type: "competitor"
  },
  {
    name: "Tango Financial",
    url: "https://tangofinancial.ca/",
    type: "competitor"
  },
  {
    name: "Mortgage Architects",
    url: "https://www.mortgagearchitects.ca/",
    type: "competitor"
  },
  {
    name: "BRX Mortgage",
    url: "https://www.brxmortgage.com/",
    type: "competitor"
  },
  {
    name: "I Love Mortgage Brokering",
    url: "https://www.ilovemortgagebrokering.com/",
    type: "competitor"
  },
  {
    name: "The Mortgage Builder",
    url: "https://themortgagebuilder.ca/",
    type: "competitor"
  },
  {
    name: "Tara Borle - Mortgage Architects",
    url: "https://taraborle.com/",
    type: "competitor"
  },
  {
    name: "Port Credit Mortgages - Emily Miszk",
    url: "https://www.portcreditmortgages.com/",
    type: "competitor"
  },
  {
    name: "Snezhana Todorova - BRX Mortgage",
    url: "https://www.snezhana.ca/",
    type: "competitor"
  },
  {
    name: "Hummingbird Mortgages",
    url: "https://www.hummingbirdmortgages.ca/",
    type: "competitor"
  },
  {
    name: "Butler Mortgage",
    url: "https://www.butlermortgage.ca/",
    type: "competitor"
  },
  {
    name: "Pineapple Financial",
    url: "https://gopineapple.com/",
    type: "competitor"
  }
];

// --- Function to scrape a single competitor ---
async function scrapeCompetitor(competitor) {
  console.log(`\n📄 Scraping: ${competitor.name}`);
  console.log(`🔗 URL: ${competitor.url}`);
  
  try {
    const result = await firecrawl.scrapeUrl(competitor.url, {
      formats: ['markdown', 'html'],
      onlyMainContent: true,
      includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a'],
      excludeTags: ['script', 'style', 'nav', 'footer'],
      timeout: 30000
    });
    
    if (!result.success) {
      console.error(`❌ Failed to scrape ${competitor.name}:`, result.error);
      return null;
    }
    
    console.log(`✅ Successfully scraped ${competitor.name}`);
    console.log(`📊 Content length: ${result.markdown?.length || 0} characters`);
    
    return {
      ...competitor,
      scrapeData: {
        title: result.metadata?.title,
        description: result.metadata?.description,
        keywords: result.metadata?.keywords,
        language: result.metadata?.language,
        ogTitle: result.metadata?.ogTitle,
        ogDescription: result.metadata?.ogDescription,
        contentLength: result.markdown?.length || 0,
        linksFound: result.links?.length || 0
      },
      content: result.markdown,
      links: result.links || [],
      scrapedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`❌ Error scraping ${competitor.name}:`, error.message);
    return null;
  }
}

// --- Function to analyze scraped data ---
function analyzeCompetitorData(competitorData) {
  const analysis = {
    overview: {
      totalCompetitors: competitorData.length,
      successfulScrapes: competitorData.filter(c => c !== null).length,
      averageContentLength: 0,
      totalLinks: 0
    },
    competitors: [],
    insights: {
      commonKeywords: [],
      contentGaps: [],
      technicalFindings: [],
      recommendations: []
    }
  };
  
  const validData = competitorData.filter(c => c !== null);
  
  // Calculate overview stats
  if (validData.length > 0) {
    analysis.overview.averageContentLength = Math.round(
      validData.reduce((sum, c) => sum + (c.scrapeData.contentLength || 0), 0) / validData.length
    );
    analysis.overview.totalLinks = validData.reduce((sum, c) => sum + (c.scrapeData.linksFound || 0), 0);
  }
  
  // Analyze each competitor
  validData.forEach(competitor => {
    const competitorAnalysis = {
      name: competitor.name,
      url: competitor.url,
      type: competitor.type,
      metrics: {
        contentLength: competitor.scrapeData.contentLength,
        linksFound: competitor.scrapeData.linksFound,
        hasTitle: !!competitor.scrapeData.title,
        hasDescription: !!competitor.scrapeData.description,
        hasKeywords: !!competitor.scrapeData.keywords,
        language: competitor.scrapeData.language
      },
      seo: {
        title: competitor.scrapeData.title,
        titleLength: competitor.scrapeData.title?.length || 0,
        description: competitor.scrapeData.description,
        descriptionLength: competitor.scrapeData.description?.length || 0,
        ogTitle: competitor.scrapeData.ogTitle,
        ogDescription: competitor.scrapeData.ogDescription
      },
      contentAnalysis: analyzeContent(competitor.content || ''),
      strengths: [],
      weaknesses: [],
      opportunities: []
    };
    
    // Identify strengths and weaknesses
    if (competitorAnalysis.metrics.contentLength > 2000) {
      competitorAnalysis.strengths.push("Rich content with good depth");
    } else {
      competitorAnalysis.weaknesses.push("Limited content depth");
    }
    
    if (competitorAnalysis.seo.titleLength > 30 && competitorAnalysis.seo.titleLength < 60) {
      competitorAnalysis.strengths.push("Well-optimized title length");
    } else {
      competitorAnalysis.weaknesses.push("Title length not optimized for SEO");
    }
    
    if (competitorAnalysis.seo.descriptionLength > 120 && competitorAnalysis.seo.descriptionLength < 160) {
      competitorAnalysis.strengths.push("Well-optimized meta description");
    } else {
      competitorAnalysis.weaknesses.push("Meta description needs optimization");
    }
    
    analysis.competitors.push(competitorAnalysis);
  });
  
  // Generate insights
  generateInsights(analysis, validData);
  
  return analysis;
}

// --- Function to analyze content for keywords and topics ---
function analyzeContent(content) {
  if (!content) return { keywords: [], topics: [], headings: [] };
  
  const lowerContent = content.toLowerCase();
  
  // Common mortgage/lending keywords to look for
  const mortgageKeywords = [
    'mortgage', 'loan', 'lending', 'broker', 'rate', 'interest', 'refinance',
    'home loan', 'first time buyer', 'pre-approval', 'credit score', 'down payment',
    'amortization', 'fixed rate', 'variable rate', 'mortgage calculator',
    'home equity', 'refinancing', 'mortgage renewal', 'debt consolidation'
  ];
  
  const foundKeywords = mortgageKeywords.filter(keyword => 
    lowerContent.includes(keyword)
  );
  
  // Extract headings (basic regex)
  const headingMatches = content.match(/^#{1,6}\s+(.+)$/gm) || [];
  const headings = headingMatches.map(h => h.replace(/^#+\s+/, ''));
  
  return {
    keywords: foundKeywords,
    keywordCount: foundKeywords.length,
    topics: extractTopics(content),
    headings: headings.slice(0, 10) // Limit to first 10 headings
  };
}

// --- Function to extract main topics ---
function extractTopics(content) {
  const topics = [];
  const lowerContent = content.toLowerCase();
  
  const topicPatterns = {
    'Mortgage Rates': /mortgage rate|interest rate|rate comparison/gi,
    'First Time Buyers': /first time buyer|first-time buyer|new buyer/gi,
    'Refinancing': /refinanc|remortgage|renewal/gi,
    'Pre-approval': /pre-approval|pre approval|preapproval/gi,
    'Mortgage Calculator': /calculator|calculate|payment/gi,
    'Credit & Qualification': /credit score|qualification|eligibility/gi,
    'Home Equity': /home equity|equity loan|heloc/gi,
    'Investment Properties': /investment property|rental property|investor/gi
  };
  
  Object.entries(topicPatterns).forEach(([topic, pattern]) => {
    if (pattern.test(content)) {
      topics.push(topic);
    }
  });
  
  return topics;
}

// --- Function to generate insights ---
function generateInsights(analysis, validData) {
  // Find common keywords across competitors
  const allKeywords = validData.flatMap(c => 
    analyzeContent(c.content || '').keywords
  );
  
  const keywordCounts = {};
  allKeywords.forEach(keyword => {
    keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
  });
  
  analysis.insights.commonKeywords = Object.entries(keywordCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([keyword, count]) => ({ keyword, count }));
  
  // Generate recommendations
  const yourSite = validData.find(c => c.type === 'own');
  const competitors = validData.filter(c => c.type === 'competitor');
  
  if (yourSite && competitors.length > 0) {
    const avgCompetitorLength = competitors.reduce((sum, c) => 
      sum + (c.scrapeData.contentLength || 0), 0) / competitors.length;
    
    if (yourSite.scrapeData.contentLength < avgCompetitorLength * 0.8) {
      analysis.insights.recommendations.push(
        "Consider expanding content depth - competitors average " + 
        Math.round(avgCompetitorLength) + " characters vs your " + 
        yourSite.scrapeData.contentLength
      );
    }
    
    // Find topics competitors cover that you don't
    const yourTopics = analyzeContent(yourSite.content || '').topics;
    const competitorTopics = competitors.flatMap(c => 
      analyzeContent(c.content || '').topics
    );
    
    const uniqueCompetitorTopics = [...new Set(competitorTopics)]
      .filter(topic => !yourTopics.includes(topic));
    
    if (uniqueCompetitorTopics.length > 0) {
      analysis.insights.contentGaps = uniqueCompetitorTopics.slice(0, 5);
    }
  }
}

// --- Main execution function ---
async function runCompetitorAnalysis() {
  console.log('🚀 Starting Comprehensive Competitor Analysis');
  console.log('=' .repeat(60));
  
  const results = [];
  
  // Scrape all competitors with delay to be respectful
  for (let i = 0; i < COMPETITORS.length; i++) {
    const competitor = COMPETITORS[i];
    const result = await scrapeCompetitor(competitor);
    results.push(result);
    
    // Add delay between requests (be respectful to servers)
    if (i < COMPETITORS.length - 1) {
      console.log('⏳ Waiting 3 seconds before next scrape...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n🔍 Analyzing scraped data...');
  const analysis = analyzeCompetitorData(results);
  
  // Save detailed results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `competitor-analysis-${timestamp}.json`;
  
  const fullReport = {
    generatedAt: new Date().toISOString(),
    analysis,
    rawData: results.filter(r => r !== null)
  };
  
  await fs.writeFile(filename, JSON.stringify(fullReport, null, 2));
  console.log(`\n📁 Full analysis saved to: ${filename}`);
  
  // Display summary
  displayAnalysisSummary(analysis);
  
  return fullReport;
}

// --- Function to display analysis summary ---
function displayAnalysisSummary(analysis) {
  console.log('\n📊 COMPETITOR ANALYSIS SUMMARY');
  console.log('=' .repeat(60));
  
  console.log(`\n📈 Overview:`);
  console.log(`• Total competitors analyzed: ${analysis.overview.totalCompetitors}`);
  console.log(`• Successful scrapes: ${analysis.overview.successfulScrapes}`);
  console.log(`• Average content length: ${analysis.overview.averageContentLength} characters`);
  console.log(`• Total links found: ${analysis.overview.totalLinks}`);
  
  console.log(`\n🏆 Top Common Keywords:`);
  analysis.insights.commonKeywords.slice(0, 5).forEach((item, index) => {
    console.log(`${index + 1}. "${item.keyword}" (found in ${item.count} sites)`);
  });
  
  if (analysis.insights.contentGaps.length > 0) {
    console.log(`\n🎯 Content Gap Opportunities:`);
    analysis.insights.contentGaps.forEach((gap, index) => {
      console.log(`${index + 1}. ${gap}`);
    });
  }
  
  if (analysis.insights.recommendations.length > 0) {
    console.log(`\n💡 Key Recommendations:`);
    analysis.insights.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  console.log(`\n🔍 Individual Competitor Insights:`);
  analysis.competitors.forEach(comp => {
    console.log(`\n• ${comp.name}:`);
    console.log(`  - Content: ${comp.metrics.contentLength} chars`);
    console.log(`  - Title: "${comp.seo.title?.substring(0, 60)}..."`);
    console.log(`  - Topics: ${comp.contentAnalysis.topics.join(', ') || 'None identified'}`);
    console.log(`  - Keywords found: ${comp.contentAnalysis.keywordCount}`);
  });
  
  console.log('\n' + '=' .repeat(60));
}

// --- Script execution ---
(async () => {
  try {
    await runCompetitorAnalysis();
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
})(); 