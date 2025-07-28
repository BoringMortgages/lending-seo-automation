import Link from "next/link";

export default function Disclaimer() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Disclaimer</h1>
          
          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">General Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              The information provided on this website is for general informational purposes only. While we strive to keep the information accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Mortgage Rate Information</h2>
            <p className="text-gray-700 mb-4">
              Mortgage rates displayed on this website are for informational purposes only and are subject to change without notice. Actual rates may vary based on individual circumstances, creditworthiness, loan amount, and other factors. Always consult with a licensed mortgage professional for current rates and terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Calculator Results</h2>
            <p className="text-gray-700 mb-4">
              The mortgage calculators and tools provided on this website are for estimation purposes only. Results are approximations and should not be considered as actual mortgage quotes or commitments. Actual mortgage terms, payments, and costs may differ significantly from calculator results.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">No Financial Advice</h2>
            <p className="text-gray-700 mb-4">
              The content on this website does not constitute financial, legal, or professional advice. You should consult with qualified professionals before making any financial decisions related to mortgages or real estate transactions.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Licensing Information</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800">
                <strong>Andreina Ford</strong><br/>
                Licensed Mortgage Agent Level 2<br/>
                BRX Mortgage #13463<br/>
                Licensed in Ontario, Canada
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Third-Party Information</h2>
            <p className="text-gray-700 mb-4">
              This website may contain information from third-party sources. We do not guarantee the accuracy, completeness, or reliability of such third-party information and are not responsible for any errors or omissions.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event will Boring Mortgages Ontario, its affiliates, or their respective officers, directors, employees, or agents be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your use of this website or the information contained herein.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Regulatory Compliance</h2>
            <p className="text-gray-700 mb-4">
              All mortgage services are provided in compliance with applicable federal and provincial regulations, including those set forth by the Financial Services Regulatory Authority of Ontario (FSRA) and other relevant regulatory bodies.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Changes to Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to update or modify this disclaimer at any time without prior notice. Your continued use of this website following any changes constitutes acceptance of those changes.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-CA')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                For questions about this disclaimer, contact us at <a href="mailto:hello@boringmortgages.ca" className="text-blue-600 hover:underline">hello@boringmortgages.ca</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}