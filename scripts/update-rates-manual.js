#!/usr/bin/env node

/**
 * Manual Rate Update
 * Simple script to update rates when needed
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ManualRateUpdater {
    constructor() {
        this.dataDir = path.join(__dirname, '../data/rates');
    }

    async updateRates() {
        console.log('🔄 Updating mortgage rates manually...');
        
        // Current competitive rates from RateHub as of January 2025
        const newRates = {
            source: "RateHub - Best Mortgage Rates",
            url: "https://www.ratehub.ca/best-mortgage-rates",
            scrapedAt: new Date().toISOString(),
            rates: [
                {
                    term: "5 Year Variable",
                    rate: "3.75%",
                    type: "Variable",
                    lender: "Scotiabank",
                    lenderLogo: "https://www.ratehub.ca/assets/images/lenders/scotiabank.png"
                },
                {
                    term: "5 Year",
                    rate: "3.74%",
                    type: "Fixed",
                    lender: "RBC Royal Bank",
                    lenderLogo: "https://www.ratehub.ca/assets/images/lenders/rbc.png"
                },
                {
                    term: "3 Year",
                    rate: "3.84%",
                    type: "Fixed", 
                    lender: "TD Bank",
                    lenderLogo: "https://www.ratehub.ca/assets/images/lenders/td.png"
                },
                {
                    term: "2 Year", 
                    rate: "4.14%",
                    type: "Fixed",
                    lender: "MCAP",
                    lenderLogo: "https://www.ratehub.ca/assets/images/lenders/mcap.png"
                },
                {
                    term: "1 Year",
                    rate: "4.49%",
                    type: "Fixed",
                    lender: "First National",
                    lenderLogo: "https://www.ratehub.ca/assets/images/lenders/first-national.png"
                },
                {
                    term: "6 Month",
                    rate: "4.89%",
                    type: "Open",
                    lender: "HSBC Bank Canada",
                    lenderLogo: "https://www.ratehub.ca/assets/images/lenders/hsbc.png"
                }
            ],
            rawContent: "Updated manually with current Canadian mortgage rates"
        };

        // Save master rates
        const masterFile = path.join(this.dataDir, 'master-rates.json');
        await fs.writeJson(masterFile, newRates, { spaces: 2 });

        // Distribute to all cities
        const cities = ['toronto', 'ottawa', 'hamilton', 'mississauga'];
        
        for (const city of cities) {
            const cityFile = path.join(this.dataDir, `${city}-rates.json`);
            const cityData = {
                ...newRates,
                city: city.charAt(0).toUpperCase() + city.slice(1),
                distributedAt: new Date().toISOString()
            };
            
            await fs.writeJson(cityFile, cityData, { spaces: 2 });
            console.log(`✅ Updated ${city} rates`);
        }

        console.log('✅ All rates updated successfully!');
        console.log('🏆 Best 5-Year Fixed: 3.74%');
        console.log('📈 Best Variable: 3.75%');
    }
}

// Run the updater
const updater = new ManualRateUpdater();
updater.updateRates()
    .then(() => {
        console.log('🎉 Manual rate update completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Update failed:', error);
        process.exit(1);
    });