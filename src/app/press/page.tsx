export default function PressPage() {
  return (
    <section className="py-24 min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
            Press & Media
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Latest news, press releases, and media resources from Brock
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Press Releases */}
          <div className="bg-white p-10 md:p-12 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Recent Press Releases</h2>
            <div className="space-y-6">
              {[
                {
                  date: "Nov 15, 2024",
                  title: "Brock Reaches 1 Million Property Listings Milestone",
                  excerpt: "Platform now hosts over 1 million verified property listings across 50+ cities in India."
                },
                {
                  date: "Oct 22, 2024",
                  title: "Brock Launches AI-Powered Property Recommendation Engine",
                  excerpt: "New feature uses machine learning to match buyers with their ideal properties."
                },
                {
                  date: "Sep 10, 2024",
                  title: "Brock Expands to Tier-2 Cities with Focus on Affordable Housing",
                  excerpt: "Platform now available in 30 new cities, making property search accessible to millions."
                },
                {
                  date: "Aug 05, 2024",
                  title: "Brock Partners with Leading Banks for Instant Home Loan Approvals",
                  excerpt: "Users can now get pre-approved home loans in minutes directly through the platform."
                }
              ].map((release, idx) => (
                <div key={idx} className="pb-6 border-b border-gray-200 last:border-0">
                  <p className="text-sm text-gray-500 mb-2">{release.date}</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{release.title}</h3>
                  <p className="text-gray-600">{release.excerpt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Media Contact */}
          <div className="bg-white p-10 md:p-12 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Media Contact</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                For press inquiries, interview requests, or media kits, please contact our 
                communications team:
              </p>
              <div className="p-5 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">Public Relations</p>
                <p>Email: press@brock.co.in</p>
                <p>Phone: +91 1800 123 4567</p>
              </div>
            </div>
          </div>

          {/* Brand Assets */}
          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Brand Assets</h3>
            <p className="text-gray-600 mb-4">
              Download our official logos, brand guidelines, and media kit for your publication.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Download Media Kit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
