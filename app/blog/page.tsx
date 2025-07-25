import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boring Blog | Mortgage Education That Actually Makes Sense",
  description: "No-nonsense mortgage advice, market insights, and financial education from Ontario's most boring mortgage experts. Real advice that saves you money.",
  keywords: "mortgage blog, Ontario mortgage advice, home buying tips, mortgage rates, Canadian mortgage education",
};

// Sample blog posts - in a real app, this would come from a CMS or API
const blogPosts = [
  {
    id: "2025-rate-predictions",
    title: "2025 Mortgage Rate Predictions: The Boring Truth",
    excerpt: "What the experts won't tell you about where rates are actually heading this year. No hype, just data.",
    date: "January 15, 2025",
    readTime: "8 min read",
    category: "Market Analysis",
    author: "Boring Mortgages Team",
    featured: true,
    image: "/api/placeholder/400/250"
  },
  {
    id: "first-time-buyer-mistakes",
    title: "5 Boring Mistakes First-Time Buyers Make",
    excerpt: "Simple oversights that cost thousands. These aren't the sexy mistakes everyone talks about - they're the boring ones that actually matter.",
    date: "January 12, 2025",
    readTime: "6 min read",
    category: "First-Time Buyers",
    author: "Boring Mortgages Team",
    featured: true,
    image: "/api/placeholder/400/250"
  },
  {
    id: "heloc-vs-refinance",
    title: "HELOC vs Refinance: A Boring Comparison",
    excerpt: "When each option makes sense for your situation. The math might surprise you.",
    date: "January 10, 2025",
    readTime: "7 min read",
    category: "Home Equity",
    author: "Boring Mortgages Team",
    featured: false,
    image: "/api/placeholder/400/250"
  },
  {
    id: "stress-test-explained",
    title: "The Mortgage Stress Test: Boringly Explained",
    excerpt: "Why you need to qualify at 5.25% even if rates are lower. The boring details that banks don't explain well.",
    date: "January 8, 2025",
    readTime: "5 min read",
    category: "Regulations",
    author: "Boring Mortgages Team",
    featured: false,
    image: "/api/placeholder/400/250"
  },
  {
    id: "ontario-land-transfer-tax",
    title: "Ontario Land Transfer Tax: The Complete Boring Guide",
    excerpt: "How much you'll actually pay and the rebates you might miss. City-by-city breakdown included.",
    date: "January 5, 2025",
    readTime: "9 min read",
    category: "Ontario",
    author: "Boring Mortgages Team",
    featured: false,
    image: "/api/placeholder/400/250"
  },
  {
    id: "mortgage-broker-vs-bank",
    title: "Mortgage Broker vs Bank: The Boring Pros and Cons",
    excerpt: "When to use each option and why the answer isn't what most people think.",
    date: "January 3, 2025",
    readTime: "6 min read",
    category: "Professional Services",
    author: "Boring Mortgages Team",
    featured: false,
    image: "/api/placeholder/400/250"
  }
];

const categories = ["All", "Market Analysis", "First-Time Buyers", "Home Equity", "Ontario", "Regulations", "Professional Services"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Boring Mortgages Ontario
                </h1>
                <p className="text-sm text-gray-600">Making complex mortgages boringly simple</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">Home</Link>
              <Link href="/blog" className="text-slate-600 font-semibold">Blog</Link>
              <Link href="/youtube-playbook" className="text-gray-600 hover:text-gray-900 font-medium">Mortgage Playbook</Link>
              <Link
                href="https://mortgagewithford.ca"
                className="bg-gradient-to-r from-slate-600 to-slate-800 text-white px-6 py-2 rounded-lg hover:from-slate-700 hover:to-slate-900 transition-all font-medium"
              >
                Get Expert Help →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-full text-sm font-medium text-slate-700 mb-4">
              📝 The Boring Blog
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Mortgage Education That
              <span className="block text-slate-600">Actually Makes Sense</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              No clickbait. No fluff. Just the boring details about mortgages, rates, and home buying 
              that actually help you make better financial decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-600">50+</div>
                <div className="text-sm text-gray-600">Boring Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-600">Weekly</div>
                <div className="text-sm text-gray-600">New Content</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-600">0%</div>
                <div className="text-sm text-gray-600">Sales Pitches</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All" 
                    ? "bg-slate-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Featured Boring Articles
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {blogPosts.filter(post => post.featured).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border"
              >
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-400/20 to-slate-600/20"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-slate-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Read more →</span>
                    <span className="text-sm text-gray-500">By {post.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Posts Grid */}
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            More Boring Content
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border"
              >
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-slate-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="text-slate-600 font-medium text-sm">Read more →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get Boring Updates
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Weekly mortgage insights delivered to your inbox. No spam, no sales pitches, 
            just boring useful information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <button className="bg-slate-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-400 to-slate-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <h3 className="text-lg font-semibold">Boring Mortgages Ontario</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Making complex mortgages boringly simple for Ontario residents.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Blog Categories</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/blog?category=market-analysis" className="hover:text-white">Market Analysis</Link></li>
                <li><Link href="/blog?category=first-time-buyers" className="hover:text-white">First-Time Buyers</Link></li>
                <li><Link href="/blog?category=ontario" className="hover:text-white">Ontario Focus</Link></li>
                <li><Link href="/blog?category=regulations" className="hover:text-white">Regulations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Free Calculators</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/mortgage-payment-calculator" className="hover:text-white">Payment Calculator</Link></li>
                <li><Link href="/mortgage-affordability-calculator" className="hover:text-white">Affordability Calculator</Link></li>
                <li><Link href="/heloc-payment-calculator" className="hover:text-white">HELOC Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Get Help</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="https://mortgagewithford.ca" className="hover:text-white">Expert Consultation</Link></li>
                <li><Link href="/youtube-playbook" className="hover:text-white">YouTube Playbook</Link></li>
                <li><Link href="/" className="hover:text-white">Home</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Boring Mortgages Ontario. Making mortgages boringly simple.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 