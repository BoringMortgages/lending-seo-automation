const fs = require('fs-extra');
const path = require('path');
const { Parser } = require('json2csv');

class MortgageDataProcessor {
    constructor() {
        this.dataDir = path.join(__dirname, '../../data/mortgage');
        this.outputDir = path.join(__dirname, '../../data/mortgage/processed');
    }

    async ensureOutputDirectory() {
        await fs.ensureDir(this.outputDir);
    }

    async loadAllLenderData() {
        const lendersDir = path.join(this.dataDir, 'lenders');
        const files = await fs.readdir(lendersDir);
        const lenders = [];

        for (const file of files) {
            if (file.endsWith('.json')) {
                const data = await fs.readJson(path.join(lendersDir, file));
                lenders.push(data);
            }
        }

        return lenders;
    }

    async loadAllRatesData() {
        const ratesDir = path.join(this.dataDir, 'rates');
        const files = await fs.readdir(ratesDir);
        const rates = [];

        for (const file of files) {
            if (file.endsWith('.json')) {
                const data = await fs.readJson(path.join(ratesDir, file));
                rates.push(data);
            }
        }

        return rates;
    }

    async generateComparisonMatrix() {
        console.log('Generating lender comparison matrix...');
        
        const lenders = await this.loadAllLenderData();
        const rates = await this.loadAllRatesData();

        const matrix = lenders.map(lender => {
            const rateData = rates.find(r => r.lender === lender.name);
            
            return {
                name: lender.name,
                type: lender.type,
                url: lender.url,
                features: lender.features,
                mortgageTypes: lender.mortgageTypes,
                rates: rateData ? rateData.rates : {},
                featureCount: lender.features.length,
                mortgageTypeCount: lender.mortgageTypes.length,
                lastUpdated: lender.scrapedAt
            };
        });

        await fs.writeJson(
            path.join(this.outputDir, 'lender-comparison-matrix.json'),
            matrix,
            { spaces: 2 }
        );

        console.log('✓ Comparison matrix generated');
        return matrix;
    }

    async generateRateComparisons() {
        console.log('Generating rate comparison data...');
        
        const rates = await this.loadAllRatesData();
        const comparisons = {};

        const rateTypes = ['fixed_5_year', 'variable', 'fixed_1_year', 'fixed_3_year'];

        rateTypes.forEach(rateType => {
            comparisons[rateType] = rates
                .filter(r => r.rates[rateType])
                .map(r => ({
                    lender: r.lender,
                    rate: r.rates[rateType],
                    numericRate: parseFloat(r.rates[rateType]),
                    lastUpdated: r.scrapedAt
                }))
                .sort((a, b) => a.numericRate - b.numericRate);
        });

        await fs.writeJson(
            path.join(this.outputDir, 'rate-comparisons.json'),
            comparisons,
            { spaces: 2 }
        );

        console.log('✓ Rate comparisons generated');
        return comparisons;
    }

    async generateFeatureMatrix() {
        console.log('Generating feature comparison matrix...');
        
        const lenders = await this.loadAllLenderData();
        const allFeatures = [...new Set(lenders.flatMap(l => l.features))];

        const featureMatrix = lenders.map(lender => {
            const features = {};
            allFeatures.forEach(feature => {
                features[feature] = lender.features.includes(feature);
            });

            return {
                name: lender.name,
                type: lender.type,
                features
            };
        });

        await fs.writeJson(
            path.join(this.outputDir, 'feature-matrix.json'),
            { allFeatures, lenders: featureMatrix },
            { spaces: 2 }
        );

        console.log('✓ Feature matrix generated');
        return { allFeatures, lenders: featureMatrix };
    }

    async generateCSVExports() {
        console.log('Generating CSV exports...');
        
        const matrix = await fs.readJson(path.join(this.outputDir, 'lender-comparison-matrix.json'));
        
        const csvFields = [
            'name', 'type', 'featureCount', 'mortgageTypeCount',
            'rates.fixed_5_year', 'rates.variable', 'rates.fixed_1_year', 'rates.fixed_3_year'
        ];

        const parser = new Parser({ fields: csvFields });
        const csv = parser.parse(matrix);

        await fs.writeFile(path.join(this.outputDir, 'lender-comparison.csv'), csv);

        console.log('✓ CSV exports generated');
    }

    async generatePairwiseComparisons() {
        console.log('Generating pairwise comparisons...');
        
        const lenders = await this.loadAllLenderData();
        const comparisons = [];

        for (let i = 0; i < lenders.length; i++) {
            for (let j = i + 1; j < lenders.length; j++) {
                const lender1 = lenders[i];
                const lender2 = lenders[j];

                const comparison = {
                    lender1: lender1.name,
                    lender2: lender2.name,
                    type1: lender1.type,
                    type2: lender2.type,
                    commonFeatures: lender1.features.filter(f => lender2.features.includes(f)),
                    uniqueFeatures1: lender1.features.filter(f => !lender2.features.includes(f)),
                    uniqueFeatures2: lender2.features.filter(f => !lender1.features.includes(f)),
                    comparisonKey: `${lender1.name.toLowerCase().replace(/\s+/g, '-')}-vs-${lender2.name.toLowerCase().replace(/\s+/g, '-')}`,
                    slug: `${lender1.name.toLowerCase().replace(/\s+/g, '-')}-vs-${lender2.name.toLowerCase().replace(/\s+/g, '-')}-mortgage-comparison`
                };

                comparisons.push(comparison);
            }
        }

        await fs.writeJson(
            path.join(this.outputDir, 'pairwise-comparisons.json'),
            comparisons,
            { spaces: 2 }
        );

        console.log(`✓ Generated ${comparisons.length} pairwise comparisons`);
        return comparisons;
    }

    async generateKeywordData() {
        console.log('Generating keyword data...');
        
        const lenders = await this.loadAllLenderData();
        const keywords = [];

        lenders.forEach(lender => {
            const lenderName = lender.name.toLowerCase();
            
            keywords.push({
                keyword: `${lenderName} mortgage rates`,
                type: 'rates',
                lender: lender.name,
                volume: 'medium',
                difficulty: 'medium'
            });

            keywords.push({
                keyword: `${lenderName} mortgage review`,
                type: 'review',
                lender: lender.name,
                volume: 'low',
                difficulty: 'low'
            });

            keywords.push({
                keyword: `${lenderName} vs `,
                type: 'comparison',
                lender: lender.name,
                volume: 'high',
                difficulty: 'medium'
            });
        });

        await fs.writeJson(
            path.join(this.outputDir, 'keyword-data.json'),
            keywords,
            { spaces: 2 }
        );

        console.log(`✓ Generated ${keywords.length} keyword entries`);
        return keywords;
    }

    async processAll() {
        console.log('Starting data processing...');
        await this.ensureOutputDirectory();

        const results = {
            comparisonMatrix: await this.generateComparisonMatrix(),
            rateComparisons: await this.generateRateComparisons(),
            featureMatrix: await this.generateFeatureMatrix(),
            pairwiseComparisons: await this.generatePairwiseComparisons(),
            keywordData: await this.generateKeywordData(),
            processedAt: new Date().toISOString()
        };

        await this.generateCSVExports();

        const summaryPath = path.join(this.outputDir, 'processing-summary.json');
        await fs.writeJson(summaryPath, {
            processedAt: results.processedAt,
            lenderCount: results.comparisonMatrix.length,
            comparisonCount: results.pairwiseComparisons.length,
            keywordCount: results.keywordData.length,
            featureCount: results.featureMatrix.allFeatures.length
        }, { spaces: 2 });

        console.log('\n✓ Data processing completed!');
        console.log(`✓ Processed ${results.comparisonMatrix.length} lenders`);
        console.log(`✓ Generated ${results.pairwiseComparisons.length} comparisons`);
        console.log(`✓ Created ${results.keywordData.length} keywords`);
        console.log('✓ Summary saved to processing-summary.json');

        return results;
    }
}

if (require.main === module) {
    const processor = new MortgageDataProcessor();
    processor.processAll().catch(console.error);
}

module.exports = MortgageDataProcessor;