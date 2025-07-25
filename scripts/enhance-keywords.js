import fs from 'fs-extra';
import path from 'path';

const LENDING_KEYWORDS = {
  loanTypes: [
    'personal loan', 'home loan', 'auto loan', 'student loan', 
    'business loan', 'payday loan', 'title loan', 'installment loan'
  ],
  comparisons: [
    'vs bank', 'vs credit union', 'vs online lender', 'vs traditional lender'
  ],
  calculations: [
    'payment calculator', 'rate calculator', 'affordability calculator',
    'refinance calculator', 'consolidation calculator'
  ],
  requirements: [
    'credit score requirements', 'income requirements', 'eligibility requirements'
  ],
  actionable: [
    'how to apply', 'how to qualify', 'how to improve', 'best practices',
    'step by step guide', 'complete guide'
  ]
};

function generateProgrammaticKeywords() {
  const keywords = [];
  
  // Generate combinations
  LENDING_KEYWORDS.loanTypes.forEach(loanType => {
    LENDING_KEYWORDS.comparisons.forEach(comparison => {
      keywords.push(`${loanType} ${comparison}`);
    });
    
    LENDING_KEYWORDS.calculations.forEach(calc => {
      keywords.push(`${loanType} ${calc}`);
    });
    
    LENDING_KEYWORDS.requirements.forEach(req => {
      keywords.push(`${loanType} ${req}`);
    });
    
    LENDING_KEYWORDS.actionable.forEach(action => {
      keywords.push(`${action} for ${loanType}`);
    });
  });
  
  // Add location-based keywords
  const locations = [
    'ontario', 'toronto', 'vancouver', 'calgary', 'montreal',
    'canada', 'canadian'
  ];
  
  locations.forEach(location => {
    LENDING_KEYWORDS.loanTypes.forEach(loanType => {
      keywords.push(`${loanType} ${location}`);
      keywords.push(`best ${loanType} lenders in ${location}`);
    });
  });
  
  return keywords;
}

async function main() {
  const programmaticKeywords = generateProgrammaticKeywords();
  
  // Load existing keyword data
  const existingData = await fs.readJson('../data/keyword-analysis.json');
  
  // Combine and deduplicate
  const allKeywords = [...new Set([
    ...existingData.keywords,
    ...programmaticKeywords
  ])];
  
  const enhancedData = {
    ...existingData,
    keywords: allKeywords,
    programmaticKeywords,
    totalEnhanced: allKeywords.length,
    updatedAt: new Date().toISOString()
  };
  
  await fs.writeJson(
    '../data/enhanced-keywords.json',
    enhancedData,
    { spaces: 2 }
  );
  
  console.log(`🚀 Generated ${programmaticKeywords.length} programmatic keywords`);
  console.log(`📈 Total keyword pool: ${allKeywords.length}`);
}

main().catch(console.error);
