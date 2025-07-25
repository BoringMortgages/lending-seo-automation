const fs = require('fs-extra');
const path = require('path');

class MortgageContentGenerator {
    constructor() {
        this.dataDir = path.join(__dirname, '../../data/mortgage/processed');
        this.outputDir = path.join(__dirname, '../../data/mortgage/content');
        this.templatesDir = path.join(__dirname, '../../data/mortgage/templates');
    }

    async ensureDirectories() {
        await fs.ensureDir(this.outputDir);
        await fs.ensureDir(this.templatesDir);
    }

    async loadProcessedData() {
        const comparisonMatrix = await fs.readJson(path.join(this.dataDir, 'lender-comparison-matrix.json'));
        const rateComparisons = await fs.readJson(path.join(this.dataDir, 'rate-comparisons.json'));
        const pairwiseComparisons = await fs.readJson(path.join(this.dataDir, 'pairwise-comparisons.json'));
        const featureMatrix = await fs.readJson(path.join(this.dataDir, 'feature-matrix.json'));

        return {
            comparisonMatrix,
            rateComparisons,
            pairwiseComparisons,
            featureMatrix
        };
    }

    generateComparisonPageContent(comparison, rateData) {
        const lender1Name = comparison.lender1;
        const lender2Name = comparison.lender2;
        
        const lender1Rate = rateData.fixed_5_year?.find(r => r.lender === lender1Name);
        const lender2Rate = rateData.fixed_5_year?.find(r => r.lender === lender2Name);

        const content = {
            title: `${lender1Name} vs ${lender2Name} Mortgage Comparison 2025`,
            slug: comparison.slug,
            metaDescription: `Compare ${lender1Name} and ${lender2Name} mortgage rates, features, and terms. Find the best mortgage option for your needs in Canada.`,
            h1: `${lender1Name} vs ${lender2Name}: Which Mortgage is Better?`,
            
            hero: {
                headline: `${lender1Name} vs ${lender2Name} Mortgage Comparison`,
                subheadline: `Compare rates, features, and find the best mortgage for your situation`,
                currentRates: {
                    lender1: lender1Rate?.rate || 'Contact for rates',
                    lender2: lender2Rate?.rate || 'Contact for rates'
                }
            },

            quickComparison: {
                lender1: {
                    name: lender1Name,
                    type: comparison.type1,
                    currentRate: lender1Rate?.rate || 'N/A',
                    uniqueFeatures: comparison.uniqueFeatures1,
                    pros: this.generatePros(lender1Name, comparison.type1, comparison.uniqueFeatures1),
                    cons: this.generateCons(lender1Name, comparison.type1)
                },
                lender2: {
                    name: lender2Name,
                    type: comparison.type2,
                    currentRate: lender2Rate?.rate || 'N/A',
                    uniqueFeatures: comparison.uniqueFeatures2,
                    pros: this.generatePros(lender2Name, comparison.type2, comparison.uniqueFeatures2),
                    cons: this.generateCons(lender2Name, comparison.type2)
                }
            },

            detailedComparison: {
                rates: this.generateRateComparison(lender1Name, lender2Name, rateData),
                features: this.generateFeatureComparison(comparison),
                bestFor: this.generateBestForScenarios(lender1Name, lender2Name, comparison)
            },

            faq: this.generateFAQ(lender1Name, lender2Name),
            
            cta: {
                primary: `Get personalized mortgage advice from Andreina Ford`,
                secondary: `Compare more lenders`,
                consultation: `Book a free 15-minute consultation`
            },

            schema: this.generateSchema(lender1Name, lender2Name, comparison),
            
            generatedAt: new Date().toISOString()
        };

        return content;
    }

    generatePros(lenderName, type, uniqueFeatures) {
        const pros = [];
        
        if (type === 'big-six') {
            pros.push('Established reputation and stability');
            pros.push('Extensive branch network across Canada');
            pros.push('Comprehensive banking services');
        } else {
            pros.push('Competitive rates and specialized focus');
            pros.push('Flexible underwriting guidelines');
            pros.push('Personalized service approach');
        }

        uniqueFeatures.forEach(feature => {
            if (feature.includes('cashback') || feature.includes('cash back')) {
                pros.push('Cash back incentives available');
            }
            if (feature.includes('skip payment') || feature.includes('payment vacation')) {
                pros.push('Payment flexibility options');
            }
            if (feature.includes('portable')) {
                pros.push('Portable mortgage options');
            }
        });

        return pros;
    }

    generateCons(lenderName, type) {
        const cons = [];
        
        if (type === 'big-six') {
            cons.push('May have higher rates than monoline lenders');
            cons.push('Stricter qualification requirements');
            cons.push('Less flexibility in underwriting');
        } else {
            cons.push('Limited branch locations');
            cons.push('Fewer additional banking services');
            cons.push('May require mortgage broker for application');
        }

        return cons;
    }

    generateRateComparison(lender1, lender2, rateData) {
        const comparison = {};
        
        ['fixed_5_year', 'variable', 'fixed_1_year', 'fixed_3_year'].forEach(rateType => {
            if (rateData[rateType]) {
                const lender1Rate = rateData[rateType].find(r => r.lender === lender1);
                const lender2Rate = rateData[rateType].find(r => r.lender === lender2);
                
                comparison[rateType] = {
                    lender1: lender1Rate?.rate || 'N/A',
                    lender2: lender2Rate?.rate || 'N/A',
                    winner: this.determineRateWinner(lender1Rate, lender2Rate)
                };
            }
        });

        return comparison;
    }

    determineRateWinner(rate1, rate2) {
        if (!rate1 && !rate2) return 'tie';
        if (!rate1) return 'lender2';
        if (!rate2) return 'lender1';
        
        return rate1.numericRate < rate2.numericRate ? 'lender1' : 'lender2';
    }

    generateFeatureComparison(comparison) {
        return {
            common: comparison.commonFeatures,
            lender1Unique: comparison.uniqueFeatures1,
            lender2Unique: comparison.uniqueFeatures2,
            analysis: `${comparison.lender1} offers ${comparison.uniqueFeatures1.length} unique features while ${comparison.lender2} provides ${comparison.uniqueFeatures2.length} unique features.`
        };
    }

    generateBestForScenarios(lender1, lender2, comparison) {
        const scenarios = [];

        if (comparison.type1 === 'big-six') {
            scenarios.push({
                scenario: 'First-time homebuyers who want full-service banking',
                recommendation: lender1,
                reason: 'Comprehensive services and established reputation'
            });
        }

        if (comparison.type2 === 'monoline') {
            scenarios.push({
                scenario: 'Rate-focused borrowers seeking competitive pricing',
                recommendation: lender2,
                reason: 'Specialized focus often leads to better rates'
            });
        }

        scenarios.push({
            scenario: 'Self-employed borrowers',
            recommendation: comparison.type2 === 'monoline' ? lender2 : lender1,
            reason: 'More flexible underwriting guidelines'
        });

        return scenarios;
    }

    generateFAQ(lender1, lender2) {
        return [
            {
                question: `Which is better: ${lender1} or ${lender2}?`,
                answer: `The choice between ${lender1} and ${lender2} depends on your specific needs. ${lender1} may be better for those seeking comprehensive banking services, while ${lender2} might offer more competitive rates or specialized features.`
            },
            {
                question: `Can I switch from ${lender1} to ${lender2}?`,
                answer: `Yes, you can switch lenders during renewal or through refinancing. Consider the costs involved and potential savings before making the switch.`
            },
            {
                question: `Which lender has better customer service?`,
                answer: `Both lenders have their strengths. ${lender1} may offer more branch locations, while ${lender2} might provide more personalized service. Consider your preferences for in-person vs. digital services.`
            }
        ];
    }

    generateSchema(lender1, lender2, comparison) {
        return {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${lender1} vs ${lender2} Mortgage Comparison`,
            "description": `Compare ${lender1} and ${lender2} mortgage rates, features, and terms in Canada.`,
            "mainEntity": {
                "@type": "FAQPage",
                "mainEntity": this.generateFAQ(lender1, lender2).map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }
        };
    }

    async generateAllComparisonPages() {
        console.log('Generating comparison page content...');
        
        const data = await this.loadProcessedData();
        const pages = [];

        for (const comparison of data.pairwiseComparisons) {
            const content = this.generateComparisonPageContent(comparison, data.rateComparisons);
            pages.push(content);

            const fileName = `${comparison.comparisonKey}.json`;
            const filePath = path.join(this.outputDir, 'comparisons', fileName);
            await fs.ensureDir(path.dirname(filePath));
            await fs.writeJson(filePath, content, { spaces: 2 });
        }

        console.log(`✓ Generated ${pages.length} comparison pages`);
        return pages;
    }

    async generateLenderReviews() {
        console.log('Generating lender review content...');
        
        const data = await this.loadProcessedData();
        const reviews = [];

        for (const lender of data.comparisonMatrix) {
            const review = {
                title: `${lender.name} Mortgage Review 2025 - Rates, Features & Expert Analysis`,
                slug: `${lender.name.toLowerCase().replace(/\s+/g, '-')}-mortgage-review`,
                metaDescription: `${lender.name} mortgage review: current rates, features, pros & cons. Expert analysis from mortgage broker Andreina Ford.`,
                
                lender: {
                    name: lender.name,
                    type: lender.type,
                    features: lender.features,
                    mortgageTypes: lender.mortgageTypes,
                    currentRates: lender.rates,
                    featureCount: lender.featureCount
                },

                rating: this.calculateLenderRating(lender),
                
                sections: {
                    overview: this.generateLenderOverview(lender),
                    rates: this.generateRatesSection(lender),
                    features: this.generateFeaturesSection(lender),
                    prosAndCons: this.generateProsAndConsSection(lender),
                    whoItsFor: this.generateWhoItsForSection(lender)
                },

                generatedAt: new Date().toISOString()
            };

            reviews.push(review);

            const fileName = `${lender.name.toLowerCase().replace(/\s+/g, '-')}-review.json`;
            const filePath = path.join(this.outputDir, 'reviews', fileName);
            await fs.ensureDir(path.dirname(filePath));
            await fs.writeJson(filePath, review, { spaces: 2 });
        }

        console.log(`✓ Generated ${reviews.length} lender reviews`);
        return reviews;
    }

    calculateLenderRating(lender) {
        let score = 3.0;
        
        if (lender.featureCount > 5) score += 0.5;
        if (lender.mortgageTypeCount > 8) score += 0.3;
        if (lender.type === 'big-six') score += 0.2;
        
        return Math.min(5.0, score);
    }

    generateLenderOverview(lender) {
        return `${lender.name} is a ${lender.type === 'big-six' ? 'major Canadian bank' : 'specialized mortgage lender'} offering ${lender.mortgageTypeCount} different mortgage products with ${lender.featureCount} key features.`;
    }

    generateRatesSection(lender) {
        const rates = Object.entries(lender.rates || {})
            .map(([type, rate]) => `${type.replace('_', ' ')}: ${rate}`)
            .join(', ');
        
        return rates || 'Contact lender for current rates';
    }

    generateFeaturesSection(lender) {
        return lender.features.length > 0 
            ? `Key features include: ${lender.features.join(', ')}`
            : 'Standard mortgage features available';
    }

    generateProsAndConsSection(lender) {
        return {
            pros: this.generatePros(lender.name, lender.type, lender.features),
            cons: this.generateCons(lender.name, lender.type)
        };
    }

    generateWhoItsForSection(lender) {
        if (lender.type === 'big-six') {
            return 'Best for borrowers seeking comprehensive banking services and established reputation';
        } else {
            return 'Ideal for rate-conscious borrowers and those needing flexible underwriting';
        }
    }

    async generateContentSummary() {
        const data = await this.loadProcessedData();
        
        const summary = {
            totalPages: data.pairwiseComparisons.length + data.comparisonMatrix.length,
            comparisonPages: data.pairwiseComparisons.length,
            reviewPages: data.comparisonMatrix.length,
            lendersCovered: data.comparisonMatrix.map(l => l.name),
            generatedAt: new Date().toISOString()
        };

        await fs.writeJson(
            path.join(this.outputDir, 'content-summary.json'),
            summary,
            { spaces: 2 }
        );

        return summary;
    }

    async generateAll() {
        console.log('Starting content generation...');
        await this.ensureDirectories();

        const results = {
            comparisonPages: await this.generateAllComparisonPages(),
            lenderReviews: await this.generateLenderReviews(),
            summary: await this.generateContentSummary()
        };

        console.log('\n✓ Content generation completed!');
        console.log(`✓ Generated ${results.comparisonPages.length} comparison pages`);
        console.log(`✓ Generated ${results.lenderReviews.length} review pages`);
        console.log(`✓ Total content pieces: ${results.summary.totalPages}`);

        return results;
    }
}

if (require.main === module) {
    const generator = new MortgageContentGenerator();
    generator.generateAll().catch(console.error);
}

module.exports = MortgageContentGenerator;