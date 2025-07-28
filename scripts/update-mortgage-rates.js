#!/usr/bin/env node

/**
 * Automated Mortgage Rate Update Script
 * Uses Firecrawl API to scrape fresh mortgage rates weekly
 * Run this script via cron job or GitHub Actions weekly
 */

require('dotenv').config();
const MortgageScraper = require('./mortgage/scrape-mortgage-data.js');
const fs = require('fs-extra');
const path = require('path');

class RateUpdateService {
    constructor() {
        this.scraper = new MortgageScraper();
        this.dataDir = path.join(__dirname, '../data/mortgage');
    }

    async checkIfUpdateNeeded() {
        try {
            const summaryPath = path.join(this.dataDir, 'scraping-summary.json');
            const summaryContent = await fs.readFile(summaryPath, 'utf-8');
            const data = JSON.parse(summaryContent);
            
            const lastUpdate = new Date(data.timestamp);
            const now = new Date();
            const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
            
            console.log(`Last update: ${lastUpdate.toISOString()}`);
            console.log(`Days since update: ${daysSinceUpdate.toFixed(1)}`);
            
            return daysSinceUpdate >= 7; // Update if older than 7 days
        } catch (error) {
            console.log('No existing data found, update needed');
            return true;
        }
    }

    async updateRates() {
        console.log('🔄 Starting automated mortgage rate update...');
        
        try {
            const updateNeeded = await this.checkIfUpdateNeeded();
            
            if (!updateNeeded) {
                console.log('✅ Rates are current, no update needed');
                return;
            }

            console.log('📊 Scraping fresh mortgage rates...');
            const results = await this.scraper.scrapeAll();
            
            // Validate we got good data
            if (!results || !results.rates || results.rates.length === 0) {
                throw new Error('No valid rate data scraped');
            }

            // Create backup of previous data
            const backupPath = path.join(this.dataDir, `backup-${Date.now()}.json`);
            try {
                const currentPath = path.join(this.dataDir, 'scraping-summary.json');
                if (await fs.pathExists(currentPath)) {
                    await fs.copy(currentPath, backupPath);
                    console.log('✅ Created backup of previous data');
                }
            } catch (backupError) {
                console.warn('⚠️ Could not create backup:', backupError.message);
            }

            // Generate rate summary for quick access
            const rateSummary = this.generateRateSummary(results);
            const summaryPath = path.join(this.dataDir, 'rate-summary.json');
            await fs.writeJson(summaryPath, rateSummary, { spaces: 2 });

            console.log('✅ Mortgage rates updated successfully!');
            console.log(`✅ Scraped ${results.lenders.length} lenders`);
            console.log(`✅ Scraped ${results.rates.length} rate pages`);
            console.log(`✅ Best 5-year fixed: ${rateSummary.bestRates.fixed5Year || 'N/A'}`);
            
            return results;

        } catch (error) {
            console.error('❌ Error updating mortgage rates:', error);
            
            // Send alert (could integrate with email/Slack)
            console.error('🚨 ALERT: Mortgage rate update failed!');
            console.error('🚨 Manual intervention may be required');
            
            throw error;
        }
    }

    generateRateSummary(results) {
        const summary = {
            lastUpdated: results.timestamp,
            totalLenders: results.lenders.length,
            bestRates: {},
            allRates: []
        };

        // Extract best rates
        let bestFixed5Year = null;
        let bestVariable = null;

        results.rates.forEach(lenderRates => {
            if (lenderRates.rates.fixed_5_year) {
                const rate = parseFloat(lenderRates.rates.fixed_5_year.replace('%', ''));
                if (!bestFixed5Year || rate < bestFixed5Year.rate) {
                    bestFixed5Year = {
                        rate: rate,
                        display: lenderRates.rates.fixed_5_year,
                        lender: lenderRates.lender
                    };
                }
            }

            if (lenderRates.rates.variable) {
                const rate = parseFloat(lenderRates.rates.variable.replace('%', ''));
                if (!bestVariable || rate < bestVariable.rate) {
                    bestVariable = {
                        rate: rate,
                        display: lenderRates.rates.variable,
                        lender: lenderRates.lender
                    };
                }
            }

            // Add to all rates
            Object.entries(lenderRates.rates).forEach(([term, rate]) => {
                summary.allRates.push({
                    lender: lenderRates.lender,
                    term: term,
                    rate: rate,
                    type: term.includes('variable') ? 'Variable' : 'Fixed'
                });
            });
        });

        summary.bestRates = {
            fixed5Year: bestFixed5Year?.display,
            fixed5YearLender: bestFixed5Year?.lender,
            variable: bestVariable?.display,
            variableLender: bestVariable?.lender
        };

        return summary;
    }

    async cleanup() {
        // Clean up old backups (keep last 5)
        try {
            const files = await fs.readdir(this.dataDir);
            const backupFiles = files
                .filter(f => f.startsWith('backup-'))
                .sort()
                .reverse();

            if (backupFiles.length > 5) {
                const filesToDelete = backupFiles.slice(5);
                for (const file of filesToDelete) {
                    await fs.unlink(path.join(this.dataDir, file));
                    console.log(`🗑️ Cleaned up old backup: ${file}`);
                }
            }
        } catch (error) {
            console.warn('⚠️ Cleanup warning:', error.message);
        }
    }
}

// Run if called directly
if (require.main === module) {
    const service = new RateUpdateService();
    
    service.updateRates()
        .then(() => service.cleanup())
        .then(() => {
            console.log('🎉 Rate update process completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Rate update process failed:', error);
            process.exit(1);
        });
}

module.exports = RateUpdateService;