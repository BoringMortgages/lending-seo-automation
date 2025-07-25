// Load environment variables from a .env file
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import FirecrawlApp from 'firecrawl';
import fs from 'fs/promises';
import path from 'path';

/**
 * COMPETITOR URLS FOR REFERENCE:
 * - Moore Mortgages: https://www.mooremortgages.ca/
 * - Dominion Lending Centres: https://dominionlending.ca/
 * - Tango Financial: https://tangofinancial.ca/
 * - Mortgage Architects: https://www.mortgagearchitects.ca/
 * - BRX Mortgage: https://www.brxmortgage.com/
 * - I Love Mortgage Brokering: https://www.ilovemortgagebrokering.com/
 * - The Mortgage Builder: https://themortgagebuilder.ca/
 * - Tara Borle (Mortgage Architects): https://taraborle.com/
 * - Emily Miszk (Port Credit Mortgages): https://www.portcreditmortgages.com/
 * - Snezhana Todorova (BRX Mortgage): https://www.snezhana.ca/
 * - Hummingbird Mortgages: https://www.hummingbirdmortgages.ca/
 * - Butler Mortgage: https://www.butlermortgage.ca/
 * - Pineapple Financial: https://gopineapple.com/
 */

// Initialize APIs
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const firecrawl = new FirecrawlApp({ 
  apiKey: process.env.FIRECRAWL_API_KEY 
});

// Check if API keys are set
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY is not set in your environment variables.');
  console.error('Please add ANTHROPIC_API_KEY=your_api_key_here to your .env file');
  process.exit(1);
}

if (!process.env.FIRECRAWL_API_KEY) {
  console.error('Error: FIRECRAWL_API_KEY is not set in your environment variables.');
  console.error('Please add FIRECRAWL_API_KEY=your_api_key_here to your .env file');
  process.exit(1);
}

// --- Main function to scrape and analyze a website ---
async function scrapeAndAnalyze(url, analysisType = 'seo') {
  console.log(`Starting to scrape and analyze: ${url}`);
  
  try {
    // Step 1: Scrape the website
    console.log('📄 Scraping website content...');
    const scrapeResult = await firecrawl.scrapeUrl(url, {
      formats: ['markdown', 'html'],
      onlyMainContent: true,
      includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a'],
      excludeTags: ['script', 'style', 'nav', 'footer']
    });
    
    if (!scrapeResult.success) {
      console.error(`Failed to scrape ${url}:`, scrapeResult.error);
      return null;
    }
    
    console.log('✅ Website scraped successfully');
    console.log(`📊 Content length: ${scrapeResult.markdown?.length || 0} characters`);
    
    // Step 2: Analyze with Claude
    console.log('🤖 Analyzing content with Claude AI...');
    
    const analysisPrompt = getAnalysisPrompt(analysisType, scrapeResult);
    
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: analysisPrompt
      }]
    });
    
    const analysis = message.content[0].text;
    
    // Step 3: Save results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const domain = new URL(url).hostname;
    const filename = `analysis-${domain}-${timestamp}.json`;
    
    const results = {
      url,
      timestamp: new Date().toISOString(),
      scrapeData: {
        title: scrapeResult.metadata?.title,
        description: scrapeResult.metadata?.description,
        keywords: scrapeResult.metadata?.keywords,
        language: scrapeResult.metadata?.language,
        contentLength: scrapeResult.markdown?.length || 0,
        linksFound: scrapeResult.links?.length || 0
      },
      analysis,
      rawContent: scrapeResult.markdown
    };
    
    await fs.writeFile(filename, JSON.stringify(results, null, 2));
    console.log(`📁 Results saved to: ${filename}`);
    
    // Step 4: Display analysis
    console.log('\n🎯 CLAUDE AI ANALYSIS:');
    console.log('=' .repeat(50));
    console.log(analysis);
    console.log('=' .repeat(50));
    
    return results;
    
  } catch (error) {
    console.error(`An error occurred:`, error.message);
    return null;
  }
}

// --- Analysis prompt generator ---
function getAnalysisPrompt(type, scrapeResult) {
  const baseInfo = `
Website URL: ${scrapeResult.url || 'N/A'}
Title: ${scrapeResult.metadata?.title || 'N/A'}
Description: ${scrapeResult.metadata?.description || 'N/A'}
Language: ${scrapeResult.metadata?.language || 'N/A'}
Content Length: ${scrapeResult.markdown?.length || 0} characters

WEBSITE CONTENT:
${scrapeResult.markdown}
`;

  switch (type) {
    case 'seo':
      return `${baseInfo}

Please provide a comprehensive SEO analysis of this mortgage/lending website. Focus on:

1. **Content Quality & Relevance**
   - Assess the content quality and relevance for mortgage/lending industry
   - Identify key topics and themes covered
   - Evaluate content depth and expertise demonstration

2. **Keyword Analysis**
   - Identify primary and secondary keywords being targeted
   - Suggest additional high-value mortgage/lending keywords to target
   - Assess keyword density and natural integration

3. **Technical SEO Elements**
   - Evaluate title tags, meta descriptions, and heading structure
   - Assess internal linking opportunities
   - Comment on content organization and user experience

4. **Competitive Positioning**
   - Identify unique value propositions and differentiators
   - Suggest content gaps that could be filled
   - Recommend content topics for blog/resources section

5. **Actionable Recommendations**
   - Provide 5-10 specific, actionable SEO improvement recommendations
   - Prioritize recommendations by impact and effort required
   - Suggest content creation opportunities

Please format your response with clear headings and bullet points for easy reading.`;

    case 'competitor':
      return `${baseInfo}

Please analyze this competitor website in the mortgage/lending space. Focus on:

1. **Business Model & Services**
   - What services do they offer?
   - What is their target market?
   - What is their unique value proposition?

2. **Content Strategy**
   - What type of content do they publish?
   - What topics do they cover?
   - How do they position themselves as experts?

3. **SEO Strategy**
   - What keywords are they likely targeting?
   - How is their content structured for SEO?
   - What content gaps can you identify?

4. **Competitive Intelligence**
   - What are their strengths?
   - What are potential weaknesses or opportunities?
   - What can we learn from their approach?

Provide insights that could inform a competitive content and SEO strategy.`;

    default:
      return `${baseInfo}

Please provide a general analysis of this website, focusing on content, user experience, and overall effectiveness.`;
  }
}

// --- Script execution ---
(async () => {
  const url = process.argv[2];
  const analysisType = process.argv[3] || 'seo';
  
  if (!url) {
    console.log('Usage: node scripts/analyze-with-claude.mjs <URL> [analysis_type]');
    console.log('Analysis types: seo, competitor, general');
    console.log('Example: node scripts/analyze-with-claude.mjs https://www.mortgagewithford.ca seo');
    process.exit(1);
  }
  
  await scrapeAndAnalyze(url, analysisType);
})(); 