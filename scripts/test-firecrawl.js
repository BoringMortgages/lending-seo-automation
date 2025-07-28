#!/usr/bin/env node

/**
 * Test Firecrawl API Integration
 * Quick test to verify Firecrawl API is working
 */

import dotenv from 'dotenv';
import FirecrawlApp from 'firecrawl';

dotenv.config();

async function testFirecrawl() {
    console.log('🔥 Testing Firecrawl API...');
    
    if (!process.env.FIRECRAWL_API_KEY) {
        console.error('❌ FIRECRAWL_API_KEY not found in environment variables');
        console.log('💡 Make sure to add FIRECRAWL_API_KEY to your .env file');
        process.exit(1);
    }

    const firecrawl = new FirecrawlApp({
        apiKey: process.env.FIRECRAWL_API_KEY
    });

    try {
        console.log('📊 Testing with RBC mortgage rates page...');
        
        const scrapeResult = await firecrawl.scrapeUrl('https://www.rbc.com/mortgages/mortgage-rates.html', {
            formats: ['markdown'],
            onlyMainContent: true,
            includeTags: ['table', 'td', 'th', 'p', 'h1', 'h2', 'h3'],
            excludeTags: ['nav', 'footer', 'header', 'aside', 'script', 'style']
        });

        console.log('📋 Full scrape result:', JSON.stringify(scrapeResult, null, 2));
        
        if (scrapeResult.success) {
            console.log('✅ Firecrawl API is working!');
            console.log('✅ Successfully scraped RBC rates page');
            
            const content = scrapeResult.data?.markdown || scrapeResult.markdown || scrapeResult.content || 'No content found';
            console.log(`✅ Content length: ${content.length} characters`);
            
            // Look for rate patterns
            const rateMatches = content.match && content.match(/\d+\.\d+%/g);
            if (rateMatches) {
                console.log(`✅ Found ${rateMatches.length} potential rates: ${rateMatches.slice(0, 5).join(', ')}${rateMatches.length > 5 ? '...' : ''}`);
            }
            
            console.log('\n📝 Sample content preview:');
            console.log(content.substring(0, 500) + '...');
            
        } else {
            console.error('❌ Firecrawl scraping failed:', scrapeResult.error);
        }

    } catch (error) {
        console.error('❌ Firecrawl test failed:', error.message);
        console.log('\n🔍 Troubleshooting tips:');
        console.log('- Verify your FIRECRAWL_API_KEY is correct');
        console.log('- Check your Firecrawl account has sufficient credits');
        console.log('- Ensure you have an active Firecrawl subscription');
        process.exit(1);
    }
}

// Run the test
testFirecrawl()
    .then(() => {
        console.log('\n🎉 Firecrawl test completed successfully!');
        console.log('🚀 Ready to scrape live mortgage rates');
    })
    .catch(console.error);

export default testFirecrawl;