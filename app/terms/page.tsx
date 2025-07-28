import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(to right, #264653, #2A9D8F)'}}>
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{color: '#222831'}}>
                  Boring Mortgages Ontario
                </h1>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials on Boring Mortgages Ontario's website for personal, non-commercial transitory viewing only.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              The materials on Boring Mortgages Ontario's website are provided on an 'as is' basis. Boring Mortgages Ontario makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Limitations</h2>
            <p className="text-gray-700 mb-4">
              In no event shall Boring Mortgages Ontario or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Boring Mortgages Ontario's website.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Accuracy of Materials</h2>
            <p className="text-gray-700 mb-4">
              The materials appearing on Boring Mortgages Ontario's website could include technical, typographical, or photographic errors. Boring Mortgages Ontario does not warrant that any of the materials on its website are accurate, complete, or current.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Links</h2>
            <p className="text-gray-700 mb-4">
              Boring Mortgages Ontario has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Modifications</h2>
            <p className="text-gray-700 mb-4">
              Boring Mortgages Ontario may revise these terms of service for its website at any time without notice.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of Ontario, Canada.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-CA')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Contact us at <a href="mailto:hello@boringmortgages.ca" className="text-blue-600 hover:underline">hello@boringmortgages.ca</a> for questions about these terms.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}