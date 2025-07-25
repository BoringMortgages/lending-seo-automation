import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateLandingPage(keyword, pageData) {
  const slug = keyword.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
    
  const title = keyword
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  const template = `
import { Metadata } from 'next'
import ComparisonTable from '@/components/ComparisonTable'
import Calculator from '@/components/Calculator'
import FAQ from '@/components/FAQ'
import EmailCapture from '@/components/EmailCapture'

export const metadata: Metadata = {
  title: '${title} - Complete 2025 Guide | YourLendingBrand',
  description: 'Compare the best ${keyword} options with real community insights. Get actionable recommendations from 2,000+ borrowers in 2025.',
  keywords: '${keyword}, lending, loans, rates, comparison, calculator',
  openGraph: {
    title: '${title} - Complete 2025 Guide',
    description: 'Compare the best ${keyword} options with real community insights.',
    type: 'article',
  },
}

const pageData = ${JSON.stringify(pageData, null, 2)};

export default function ${title.replace(/\s/g, '')}Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          ${title} - Complete 2025 Comparison
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Compare the best ${keyword} options side by side with real test community insights
          and actionable recommendations from 2,000+ borrowers.
        </p>
        <EmailCapture />
      </section>

      {/* Comparison Table */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Top ${title} Options</h2>
        <ComparisonTable data={pageData.comparison} />
      </section>

      {/* Calculator */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">${title} Calculator</h2>
        <Calculator type="${keyword}" />
      </section>

      {/* Community Insights */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Community Insights & Reviews</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {pageData.reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="text-lg font-semibold">{review.lender}</div>
                <div className="ml-auto text-yellow-500">
                  {'★'.repeat(review.rating)}
                </div>
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>
              <div className="text-sm text-gray-500">
                Verified borrower • {review.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Frequently Asked Questions</h2>
        <FAQ data={pageData.faq} />
      </section>

      {/* Alternative Comparisons */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Related Comparisons</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {pageData.related.map((related, index) => (
            <a 
              key={index}
              href={\`/\${related.slug}\`}
              className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition"
            >
              <h4 className="font-semibold text-blue-800">{related.title}</h4>
              <p className="text-blue-600 text-sm">{related.description}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
`;

  return { slug, template };
}

async function generatePageData(keyword) {
  // This would integrate with your lending data or be populated from competitor research
  return {
    comparison: [
      {
        lender: "LenderOne",
        apr: "5.99% - 24.99%",
        amount: "$2,500 - $40,000",
        term: "3-7 years",
        rating: 4.5,
        bestFor: "Excellent Credit"
      },
      {
        lender: "LenderTwo", 
        apr: "7.99% - 29.99%",
        amount: "$1,000 - $50,000", 
        term: "2-7 years",
        rating: 4.2,
        bestFor: "Fair Credit"
      }
    ],
    reviews: [
      {
        lender: "LenderOne",
        rating: 5,
        comment: "Quick approval and transparent terms. Exactly what I needed for debt consolidation.",
        date: "Jan 2025"
      }
    ],
    faq: [
      {
        question: \`What credit score do I need for \${keyword}?\`,
        answer: "Most lenders require a minimum credit score of 580-640, though the best rates typically require 700+."
      }
    ],
    related: [
      {
        title: "Personal Loan Calculator",
        description: "Calculate monthly payments and total interest",
        slug: "personal-loan-calculator"
      }
    ]
  };
}

async function main() {
  const keywordData = await fs.readJson('../data/enhanced-keywords.json');
  const selectedKeywords = keywordData.keywords.slice(0, 100); // Generate first 100 pages
  
  let generatedCount = 0;
  
  for (const keyword of selectedKeywords) {
    try {
      const pageData = await generatePageData(keyword);
      const { slug, template } = await generateLandingPage(keyword, pageData);
      
      // Create page file
      const pagePath = path.join(__dirname, '../app', slug, 'page.tsx');
      await fs.ensureDir(path.dirname(pagePath));
      await fs.writeFile(pagePath, template);
      
      generatedCount++;
      
      if (generatedCount % 10 === 0) {
        console.log(\`✅ Generated \${generatedCount} pages...\`);
      }
      
    } catch (error) {
      console.error(\`Error generating page for "\${keyword}":\`, error);
    }
  }
  
  console.log(\`🎉 Successfully generated \${generatedCount} landing pages!\`);
}

main().catch(console.error);
