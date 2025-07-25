// Load environment variables from a .env file
import 'dotenv/config';
import FirecrawlApp from 'firecrawl';

// Get the API key from environment variables
const apiKey = process.env.FIRECRAWL_API_KEY;

// Check if the API key is set
if (!apiKey) {
  console.error('Error: FIRECRAWL_API_KEY is not set in your environment variables.');
  console.error('Please create a .env file in the root of your project and add the following line:');
  console.error('FIRECRAWL_API_KEY=your_api_key_here');
  process.exit(1);
}

// Initialize Firecrawl with the API key
const firecrawl = new FirecrawlApp({ apiKey });

// --- Main function to scrape a competitor ---
async function scrapeCompetitor(url) {
  console.log(`Starting to scrape: ${url}`);
  
  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: ['markdown', 'html'],
      onlyMainContent: true,
      includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a'],
      excludeTags: ['script', 'style', 'nav', 'footer']
    });
    
    if (!result.success) {
      console.error(`Failed to scrape ${url}:`, result.error);
      return null;
    }
    
    // Log the cleaned-up Markdown content
    console.log('--- Scrape Result ---');
    console.log('URL:', result.url);
    console.log('Title:', result.metadata?.title);
    console.log('Description:', result.metadata?.description);
    console.log('\n--- Content (Markdown) ---');
    console.log(result.markdown);
    console.log('--------------------');
    
    // Also log metadata if available
    if (result.metadata) {
      console.log('--- Metadata ---');
      console.log('Keywords:', result.metadata.keywords);
      console.log('Language:', result.metadata.language);
      console.log('OG Title:', result.metadata.ogTitle);
      console.log('OG Description:', result.metadata.ogDescription);
      console.log('----------------');
    }
    
    return result;
    
  } catch (error) {
    console.error(`An error occurred while scraping ${url}:`, error.message);
    return null;
  }
}

// --- Script execution ---
(async () => {
  // Get the URL from the command-line arguments
  const urlToCrawl = process.argv[2];
  
  if (!urlToCrawl) {
    console.log('No URL provided. Scraping the default example: https://firecrawl.dev');
    await scrapeCompetitor('https://firecrawl.dev');
  } else {
    await scrapeCompetitor(urlToCrawl);
  }
})();
