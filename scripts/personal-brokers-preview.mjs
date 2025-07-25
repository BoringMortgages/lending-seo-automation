// Load environment variables from a .env file
import 'dotenv/config';
import FirecrawlApp from 'firecrawl';

// Initialize Firecrawl
const firecrawl = new FirecrawlApp({ 
  apiKey: process.env.FIRECRAWL_API_KEY 
});

// Check if API key is set
if (!process.env.FIRECRAWL_API_KEY) {
  console.error('Error: FIRECRAWL_API_KEY is not set in your environment variables.');
  process.exit(1);
}

// Personal mortgage broker competitors for preview
const PERSONAL_BROKERS = [
  {
    name: "Your Site",
    url: "https://www.mortgagewithford.ca",
    focus: "Personal story, community advocate, mother's perspective"
  },
  {
    name: "Tara Borle",
    url: "https://taraborle.com/",
    focus: "Team-based personal approach, strong reviews"
  },
  {
    name: "Emily Miszk",
    url: "https://www.portcreditmortgages.com/",
    focus: "Personal brand, virtual process, work-life balance"
  },
  {
    name: "Snezhana Todorova",
    url: "https://www.snezhana.ca/",
    focus: "BRX broker, wealth building focus, Guelph market"
  }
];

async function analyzePersonalBrokers() {
  console.log('👥 PERSONAL MORTGAGE BROKER ANALYSIS');
  console.log('=' .repeat(55));
  console.log('Analyzing personal branding approaches of individual brokers');
  
  const results = [];
  
  for (const broker of PERSONAL_BROKERS) {
    console.log(`\n📄 Analyzing: ${broker.name}`);
    console.log(`🎯 Expected Focus: ${broker.focus}`);
    console.log(`🔗 URL: ${broker.url}`);
    
    try {
      const result = await firecrawl.scrapeUrl(broker.url, {
        formats: ['markdown'],
        onlyMainContent: true,
        timeout: 15000
      });
      
      if (result.success) {
        const content = result.markdown || '';
        const contentLength = content.length;
        
        // Personal branding analysis
        const personalElements = {
          hasPersonalStory: /story|background|about me|journey|experience/gi.test(content),
          hasTeamInfo: /team|staff|associate|assistant/gi.test(content),
          hasTestimonials: /review|testimonial|client|customer/gi.test(content),
          hasPersonalPhoto: /photo|image|picture/gi.test(content),
          hasLocalFocus: /local|community|area|city|town|guelph|mississauga|ontario/gi.test(content),
          hasCalculator: /calculator|calculate/gi.test(content),
          hasBlog: /blog|article|news|insights/gi.test(content),
          hasApplyNow: /apply now|application|get started/gi.test(content)
        };
        
        // Keyword analysis
        const mortgageKeywords = [
          'mortgage', 'broker', 'rate', 'loan', 'refinance', 
          'renewal', 'first time', 'pre-approval', 'home equity'
        ];
        
        const foundKeywords = mortgageKeywords.filter(keyword => 
          content.toLowerCase().includes(keyword)
        );
        
        // Extract key info
        const title = result.metadata?.title || 'No title found';
        const description = result.metadata?.description || 'No description found';
        
        // Personal messaging analysis
        const personalMessaging = {
          hasPersonalPronoun: /\bI\b|\bme\b|\bmy\b/gi.test(content),
          hasWelcomeMessage: /welcome|hello|hi|meet/gi.test(content),
          hasCallToAction: /contact|call|book|schedule|apply/gi.test(content),
          hasValueProposition: /why|choose|different|unique|expertise/gi.test(content)
        };
        
        const brokerAnalysis = {
          name: broker.name,
          url: broker.url,
          contentLength,
          title: title.substring(0, 80),
          description: description.substring(0, 100),
          keywordCount: foundKeywords.length,
          keywords: foundKeywords,
          personalElements,
          personalMessaging,
          personalScore: Object.values(personalElements).filter(Boolean).length,
          messagingScore: Object.values(personalMessaging).filter(Boolean).length
        };
        
        results.push(brokerAnalysis);
        
        console.log(`✅ Successfully analyzed`);
        console.log(`📊 Content: ${contentLength} characters`);
        console.log(`📝 Title: ${title.substring(0, 60)}...`);
        console.log(`🔑 Keywords: ${foundKeywords.length}/9 (${foundKeywords.slice(0, 4).join(', ')})`);
        console.log(`👤 Personal Elements: ${Object.values(personalElements).filter(Boolean).length}/8`);
        console.log(`💬 Personal Messaging: ${Object.values(personalMessaging).filter(Boolean).length}/4`);
        
        // Show key personal elements
        const strongElements = Object.entries(personalElements)
          .filter(([key, value]) => value)
          .map(([key]) => key.replace('has', '').replace(/([A-Z])/g, ' $1').toLowerCase().trim());
        
        if (strongElements.length > 0) {
          console.log(`🎯 Strong personal elements: ${strongElements.join(', ')}`);
        }
        
      } else {
        console.log(`❌ Failed to scrape: ${result.error}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    // Delay between requests
    if (PERSONAL_BROKERS.indexOf(broker) < PERSONAL_BROKERS.length - 1) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Comparative analysis
  if (results.length > 1) {
    console.log('\n📊 COMPARATIVE ANALYSIS:');
    console.log('=' .repeat(55));
    
    const yourSite = results.find(r => r.name === "Your Site");
    const competitors = results.filter(r => r.name !== "Your Site");
    
    if (yourSite && competitors.length > 0) {
      console.log(`\n🏆 Content Length Comparison:`);
      console.log(`• Your Site: ${yourSite.contentLength} characters`);
      competitors.forEach(comp => {
        const percentage = Math.round(((comp.contentLength - yourSite.contentLength) / yourSite.contentLength) * 100);
        console.log(`• ${comp.name}: ${comp.contentLength} chars (${percentage > 0 ? '+' : ''}${percentage}%)`);
      });
      
      console.log(`\n👤 Personal Branding Scores:`);
      console.log(`• Your Site: ${yourSite.personalScore}/8 personal elements`);
      competitors.forEach(comp => {
        console.log(`• ${comp.name}: ${comp.personalScore}/8 personal elements`);
      });
      
      console.log(`\n💬 Personal Messaging Scores:`);
      console.log(`• Your Site: ${yourSite.messagingScore}/4 messaging elements`);
      competitors.forEach(comp => {
        console.log(`• ${comp.name}: ${comp.messagingScore}/4 messaging elements`);
      });
      
      // Identify gaps and opportunities
      console.log(`\n🎯 Key Insights:`);
      
      const avgCompetitorContent = competitors.reduce((sum, c) => sum + c.contentLength, 0) / competitors.length;
      if (yourSite.contentLength < avgCompetitorContent * 0.8) {
        console.log(`• Content Gap: Competitors average ${Math.round(avgCompetitorContent)} chars vs your ${yourSite.contentLength}`);
      }
      
      const avgPersonalScore = competitors.reduce((sum, c) => sum + c.personalScore, 0) / competitors.length;
      if (yourSite.personalScore < avgPersonalScore) {
        console.log(`• Personal Branding: You could strengthen personal elements (avg competitor: ${avgPersonalScore.toFixed(1)}/8)`);
      } else {
        console.log(`• Personal Branding: You're competitive with personal elements!`);
      }
      
      // Find common elements competitors have that you don't
      const competitorElements = competitors.flatMap(c => 
        Object.entries(c.personalElements)
          .filter(([key, value]) => value)
          .map(([key]) => key)
      );
      
      const yourElements = Object.entries(yourSite.personalElements)
        .filter(([key, value]) => value)
        .map(([key]) => key);
      
      const missingElements = [...new Set(competitorElements)]
        .filter(element => !yourElements.includes(element));
      
      if (missingElements.length > 0) {
        console.log(`• Missing Elements: ${missingElements.map(e => e.replace('has', '').replace(/([A-Z])/g, ' $1').toLowerCase().trim()).join(', ')}`);
      }
    }
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('• Run full analysis: node scripts/competitor-analysis.mjs');
  console.log('• Focus on personal branding gaps identified above');
  console.log('• Consider elements that high-performing competitors use');
}

// Run the analysis
analyzePersonalBrokers().catch(console.error); 