#!/usr/bin/env node

const MortgageScheduler = require('./scheduler');

async function main() {
    console.log('🏠 Mortgage Scraping System');
    console.log('============================\n');

    const scheduler = new MortgageScheduler();
    
    try {
        const results = await scheduler.runFullPipeline();
        
        if (results.success) {
            console.log('\n✅ Pipeline completed successfully!');
            console.log(`   Duration: ${Math.round(results.duration / 60000)} minutes`);
            
            if (results.scraping) {
                console.log(`   Scraped: ${results.scraping.lenders.length} lenders, ${results.scraping.rates.length} rate pages`);
            }
            
            if (results.processing) {
                console.log(`   Processed: ${results.processing.comparisonMatrix.length} lenders`);
                console.log(`   Generated: ${results.processing.pairwiseComparisons.length} comparisons`);
            }
            
            if (results.contentGeneration) {
                console.log(`   Content: ${results.contentGeneration.summary.totalPages} pages created`);
            }
            
        } else {
            console.log('\n❌ Pipeline failed - check logs for details');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('\n💥 Pipeline error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = main;