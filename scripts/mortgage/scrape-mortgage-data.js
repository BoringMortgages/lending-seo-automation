require('dotenv').config();
const FirecrawlApp = require('firecrawl').default;
const fs = require('fs-extra');
const path = require('path');

class MortgageScraper {
    constructor() {
        this.firecrawl = new FirecrawlApp({
            apiKey: process.env.FIRECRAWL_API_KEY
        });
        this.dataDir = path.join(__dirname, '../../data/mortgage');
        this.lenders = this.getMajorCanadianLenders();
    }

    getMajorCanadianLenders() {
        return [
            {
                name: 'TD Bank',
                url: 'https://www.td.com/ca/en/personal-banking/products/mortgages',
                ratesUrl: 'https://www.td.com/ca/en/personal-banking/products/mortgages/mortgage-rates',
                type: 'big-six'
            },
            {
                name: 'RBC',
                url: 'https://www.rbc.com/mortgages/',
                ratesUrl: 'https://www.rbc.com/mortgages/mortgage-rates.html',
                type: 'big-six'
            },
            {
                name: 'Scotia Bank',
                url: 'https://www.scotiabank.com/ca/en/personal/loans-lines-credit/mortgages.html',
                ratesUrl: 'https://www.scotiabank.com/ca/en/personal/loans-lines-credit/mortgages/mortgage-rates.html',
                type: 'big-six'
            },
            {
                name: 'BMO',
                url: 'https://www.bmo.com/main/personal/mortgages/',
                ratesUrl: 'https://www.bmo.com/main/personal/mortgages/mortgage-rates/',
                type: 'big-six'
            },
            {
                name: 'CIBC',
                url: 'https://www.cibc.com/en/personal-banking/mortgages.html',
                ratesUrl: 'https://www.cibc.com/en/personal-banking/mortgages/mortgage-rates.html',
                type: 'big-six'
            },
            {
                name: 'National Bank',
                url: 'https://www.nbc.ca/personal/loans/mortgages.html',
                ratesUrl: 'https://www.nbc.ca/personal/loans/mortgages/mortgage-rates.html',
                type: 'big-six'
            },
            {
                name: 'First National',
                url: 'https://www.firstnational.ca/mortgages',
                ratesUrl: 'https://www.firstnational.ca/mortgages/mortgage-rates',
                type: 'monoline'
            },
            {
                name: 'MCAP',
                url: 'https://www.mcap.com/mortgages/',
                ratesUrl: 'https://www.mcap.com/mortgages/current-rates/',
                type: 'monoline'
            }
        ];
    }

    async ensureDataDirectory() {
        await fs.ensureDir(this.dataDir);
        await fs.ensureDir(path.join(this.dataDir, 'lenders'));
        await fs.ensureDir(path.join(this.dataDir, 'rates'));
        await fs.ensureDir(path.join(this.dataDir, 'products'));
    }

    async scrapeLenderInfo(lender) {
        try {
            console.log(`Scraping ${lender.name} information...`);
            
            const scrapeResult = await this.firecrawl.scrapeUrl(lender.url, {
                formats: ['markdown', 'html'],
                onlyMainContent: true,
                includeTags: ['h1', 'h2', 'h3', 'p', 'ul', 'li', 'table', 'td', 'th'],
                excludeTags: ['nav', 'footer', 'header', 'aside', 'script', 'style']
            });

            if (!scrapeResult.success) {
                throw new Error(`Failed to scrape ${lender.name}: ${scrapeResult.error}`);
            }

            const lenderData = {
                name: lender.name,
                type: lender.type,
                url: lender.url,
                ratesUrl: lender.ratesUrl,
                scrapedAt: new Date().toISOString(),
                content: scrapeResult.data.markdown,
                html: scrapeResult.data.html,
                features: this.extractFeatures(scrapeResult.data.markdown),
                mortgageTypes: this.extractMortgageTypes(scrapeResult.data.markdown)
            };

            const fileName = `${lender.name.toLowerCase().replace(/\s+/g, '-')}.json`;
            const filePath = path.join(this.dataDir, 'lenders', fileName);
            await fs.writeJson(filePath, lenderData, { spaces: 2 });

            console.log(`✓ Saved ${lender.name} data to ${fileName}`);
            return lenderData;

        } catch (error) {
            console.error(`Error scraping ${lender.name}:`, error.message);
            return null;
        }
    }

    async scrapeMortgageRates(lender) {
        try {
            console.log(`Scraping ${lender.name} rates...`);
            
            const scrapeResult = await this.firecrawl.scrapeUrl(lender.ratesUrl, {
                formats: ['markdown'],
                onlyMainContent: true,
                includeTags: ['table', 'td', 'th', 'p', 'h1', 'h2', 'h3'],
                excludeTags: ['nav', 'footer', 'header', 'aside', 'script', 'style']
            });

            if (!scrapeResult.success) {
                throw new Error(`Failed to scrape ${lender.name} rates: ${scrapeResult.error}`);
            }

            const ratesData = {
                lender: lender.name,
                scrapedAt: new Date().toISOString(),
                url: lender.ratesUrl,
                content: scrapeResult.data.markdown,
                rates: this.extractRates(scrapeResult.data.markdown)
            };

            const fileName = `${lender.name.toLowerCase().replace(/\s+/g, '-')}-rates.json`;
            const filePath = path.join(this.dataDir, 'rates', fileName);
            await fs.writeJson(filePath, ratesData, { spaces: 2 });

            console.log(`✓ Saved ${lender.name} rates to ${fileName}`);
            return ratesData;

        } catch (error) {
            console.error(`Error scraping ${lender.name} rates:`, error.message);
            return null;
        }
    }

    extractFeatures(markdown) {
        const features = [];
        const featureKeywords = [
            'no prepayment penalty',
            'portable',
            'assumable',
            'convertible',
            'cashback',
            'cash back',
            'skip payment',
            'payment vacation',
            'accelerated payment',
            'bi-weekly',
            'weekly payments',
            'lump sum payment',
            'increase payment',
            'flexible payment'
        ];

        featureKeywords.forEach(keyword => {
            if (markdown.toLowerCase().includes(keyword)) {
                features.push(keyword);
            }
        });

        return features;
    }

    extractMortgageTypes(markdown) {
        const types = [];
        const typeKeywords = [
            'fixed rate',
            'variable rate',
            'adjustable rate',
            'open mortgage',
            'closed mortgage',
            'conventional mortgage',
            'high ratio mortgage',
            'insured mortgage',
            'uninsured mortgage',
            'heloc',
            'home equity line of credit',
            'refinance',
            'renewal',
            'first time buyer',
            'investment property',
            'self employed'
        ];

        typeKeywords.forEach(keyword => {
            if (markdown.toLowerCase().includes(keyword)) {
                types.push(keyword);
            }
        });

        return [...new Set(types)];
    }

    extractRates(markdown) {
        const rates = {};
        const lines = markdown.split('\n');
        
        lines.forEach(line => {
            const rateMatch = line.match(/(\d+\.?\d*%)/g);
            if (rateMatch) {
                if (line.toLowerCase().includes('fixed') && line.toLowerCase().includes('5')) {
                    rates.fixed_5_year = rateMatch[0];
                }
                if (line.toLowerCase().includes('variable')) {
                    rates.variable = rateMatch[0];
                }
                if (line.toLowerCase().includes('fixed') && line.toLowerCase().includes('1')) {
                    rates.fixed_1_year = rateMatch[0];
                }
                if (line.toLowerCase().includes('fixed') && line.toLowerCase().includes('3')) {
                    rates.fixed_3_year = rateMatch[0];
                }
            }
        });

        return rates;
    }

    async scrapeAll() {
        console.log('Starting mortgage data scraping...');
        await this.ensureDataDirectory();

        const results = {
            lenders: [],
            rates: [],
            timestamp: new Date().toISOString()
        };

        for (const lender of this.lenders) {
            console.log(`\nProcessing ${lender.name}...`);
            
            const lenderInfo = await this.scrapeLenderInfo(lender);
            if (lenderInfo) {
                results.lenders.push(lenderInfo);
            }

            await new Promise(resolve => setTimeout(resolve, 2000));

            const ratesInfo = await this.scrapeMortgageRates(lender);
            if (ratesInfo) {
                results.rates.push(ratesInfo);
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const summaryPath = path.join(this.dataDir, 'scraping-summary.json');
        await fs.writeJson(summaryPath, results, { spaces: 2 });

        console.log('\n✓ Scraping completed!');
        console.log(`✓ Scraped ${results.lenders.length} lenders`);
        console.log(`✓ Scraped ${results.rates.length} rate pages`);
        console.log(`✓ Summary saved to scraping-summary.json`);

        return results;
    }
}

if (require.main === module) {
    const scraper = new MortgageScraper();
    scraper.scrapeAll().catch(console.error);
}

module.exports = MortgageScraper;