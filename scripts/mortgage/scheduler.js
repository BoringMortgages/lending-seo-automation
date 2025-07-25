const fs = require('fs-extra');
const path = require('path');
const MortgageScraper = require('./scrape-mortgage-data');
const MortgageDataProcessor = require('./data-processor');
const MortgageContentGenerator = require('./content-generator');

class MortgageScheduler {
    constructor() {
        this.logDir = path.join(__dirname, '../../data/mortgage/logs');
        this.configPath = path.join(__dirname, '../../data/mortgage/scheduler-config.json');
        this.defaultConfig = {
            scraping: {
                enabled: true,
                intervalHours: 24,
                retryAttempts: 3,
                retryDelayMinutes: 30
            },
            processing: {
                enabled: true,
                runAfterScraping: true
            },
            contentGeneration: {
                enabled: true,
                runAfterProcessing: true
            },
            monitoring: {
                enabled: true,
                logLevel: 'info',
                alertOnFailure: true
            }
        };
    }

    async ensureDirectories() {
        await fs.ensureDir(this.logDir);
        
        if (!await fs.pathExists(this.configPath)) {
            await fs.writeJson(this.configPath, this.defaultConfig, { spaces: 2 });
        }
    }

    async loadConfig() {
        return await fs.readJson(this.configPath);
    }

    async log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data
        };

        console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
        
        const logFile = path.join(this.logDir, `${new Date().toISOString().split('T')[0]}.log`);
        await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
    }

    async runScraping(config) {
        if (!config.scraping.enabled) {
            await this.log('info', 'Scraping is disabled in configuration');
            return null;
        }

        await this.log('info', 'Starting mortgage data scraping...');
        
        let attempts = 0;
        const maxAttempts = config.scraping.retryAttempts;

        while (attempts < maxAttempts) {
            try {
                const scraper = new MortgageScraper();
                const results = await scraper.scrapeAll();
                
                await this.log('info', 'Scraping completed successfully', {
                    lendersScraped: results.lenders.length,
                    ratesScraped: results.rates.length
                });

                return results;

            } catch (error) {
                attempts++;
                await this.log('error', `Scraping attempt ${attempts} failed: ${error.message}`, {
                    error: error.stack,
                    attempt: attempts
                });

                if (attempts < maxAttempts) {
                    const delayMs = config.scraping.retryDelayMinutes * 60 * 1000;
                    await this.log('info', `Retrying in ${config.scraping.retryDelayMinutes} minutes...`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }
            }
        }

        await this.log('error', `Scraping failed after ${maxAttempts} attempts`);
        return null;
    }

    async runProcessing(config) {
        if (!config.processing.enabled) {
            await this.log('info', 'Data processing is disabled in configuration');
            return null;
        }

        try {
            await this.log('info', 'Starting data processing...');
            
            const processor = new MortgageDataProcessor();
            const results = await processor.processAll();
            
            await this.log('info', 'Data processing completed successfully', {
                lendersProcessed: results.comparisonMatrix.length,
                comparisonsGenerated: results.pairwiseComparisons.length
            });

            return results;

        } catch (error) {
            await this.log('error', `Data processing failed: ${error.message}`, {
                error: error.stack
            });
            return null;
        }
    }

    async runContentGeneration(config) {
        if (!config.contentGeneration.enabled) {
            await this.log('info', 'Content generation is disabled in configuration');
            return null;
        }

        try {
            await this.log('info', 'Starting content generation...');
            
            const generator = new MortgageContentGenerator();
            const results = await generator.generateAll();
            
            await this.log('info', 'Content generation completed successfully', {
                comparisonPages: results.comparisonPages.length,
                reviewPages: results.lenderReviews.length,
                totalPages: results.summary.totalPages
            });

            return results;

        } catch (error) {
            await this.log('error', `Content generation failed: ${error.message}`, {
                error: error.stack
            });
            return null;
        }
    }

    async runFullPipeline() {
        await this.ensureDirectories();
        
        const config = await this.loadConfig();
        await this.log('info', 'Starting full mortgage scraping pipeline...');

        const pipelineStart = Date.now();
        const results = {
            scraping: null,
            processing: null,
            contentGeneration: null,
            success: false,
            duration: 0
        };

        try {
            results.scraping = await this.runScraping(config);
            
            if (results.scraping && config.processing.runAfterScraping) {
                results.processing = await this.runProcessing(config);
            }
            
            if (results.processing && config.contentGeneration.runAfterProcessing) {
                results.contentGeneration = await this.runContentGeneration(config);
            }

            results.success = !!(results.scraping && results.processing && results.contentGeneration);
            results.duration = Date.now() - pipelineStart;

            await this.log('info', 'Pipeline completed', {
                success: results.success,
                durationMs: results.duration,
                durationMinutes: Math.round(results.duration / 60000)
            });

            await this.savePipelineResults(results);

        } catch (error) {
            results.duration = Date.now() - pipelineStart;
            await this.log('error', `Pipeline failed: ${error.message}`, {
                error: error.stack,
                durationMs: results.duration
            });
        }

        return results;
    }

    async savePipelineResults(results) {
        const resultsPath = path.join(this.logDir, `pipeline-results-${Date.now()}.json`);
        await fs.writeJson(resultsPath, {
            ...results,
            timestamp: new Date().toISOString()
        }, { spaces: 2 });
    }

    async getLastRunStatus() {
        const logFiles = await fs.readdir(this.logDir);
        const resultFiles = logFiles.filter(f => f.startsWith('pipeline-results-'));
        
        if (resultFiles.length === 0) {
            return null;
        }

        const latestFile = resultFiles.sort().reverse()[0];
        const results = await fs.readJson(path.join(this.logDir, latestFile));
        
        return results;
    }

    async scheduleRecurring() {
        const config = await this.loadConfig();
        
        if (!config.scraping.enabled) {
            await this.log('info', 'Recurring scheduling disabled - scraping is turned off');
            return;
        }

        const intervalMs = config.scraping.intervalHours * 60 * 60 * 1000;
        
        await this.log('info', `Scheduling recurring runs every ${config.scraping.intervalHours} hours`);
        
        const runPipeline = async () => {
            await this.runFullPipeline();
            setTimeout(runPipeline, intervalMs);
        };

        setTimeout(runPipeline, intervalMs);
    }

    async healthCheck() {
        const lastRun = await this.getLastRunStatus();
        const config = await this.loadConfig();
        
        const health = {
            status: 'healthy',
            lastRun: lastRun ? lastRun.timestamp : null,
            lastRunSuccess: lastRun ? lastRun.success : null,
            configValid: !!config,
            issues: []
        };

        if (!lastRun) {
            health.issues.push('No previous runs found');
        } else if (!lastRun.success) {
            health.issues.push('Last run failed');
            health.status = 'warning';
        }

        if (lastRun) {
            const hoursSinceLastRun = (Date.now() - new Date(lastRun.timestamp)) / (1000 * 60 * 60);
            const expectedInterval = config.scraping.intervalHours || 24;
            
            if (hoursSinceLastRun > expectedInterval * 1.5) {
                health.issues.push(`Last run was ${Math.round(hoursSinceLastRun)} hours ago (expected every ${expectedInterval} hours)`);
                health.status = 'warning';
            }
        }

        if (!process.env.FIRECRAWL_API_KEY) {
            health.issues.push('FIRECRAWL_API_KEY not found in environment');
            health.status = 'error';
        }

        return health;
    }
}

if (require.main === module) {
    const scheduler = new MortgageScheduler();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'run':
            scheduler.runFullPipeline().catch(console.error);
            break;
        case 'schedule':
            scheduler.scheduleRecurring().catch(console.error);
            break;
        case 'health':
            scheduler.healthCheck().then(health => {
                console.log(JSON.stringify(health, null, 2));
                process.exit(health.status === 'error' ? 1 : 0);
            }).catch(console.error);
            break;
        case 'status':
            scheduler.getLastRunStatus().then(status => {
                console.log(JSON.stringify(status, null, 2));
            }).catch(console.error);
            break;
        default:
            console.log('Usage: node scheduler.js [run|schedule|health|status]');
            console.log('  run      - Run the full pipeline once');
            console.log('  schedule - Start recurring scheduled runs');
            console.log('  health   - Check system health');
            console.log('  status   - Show last run status');
    }
}

module.exports = MortgageScheduler;