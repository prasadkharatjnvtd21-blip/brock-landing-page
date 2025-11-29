export default function BlogPage() {
  return (
    <section className="py-24 min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
            Brock Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Insights, tips, and updates from the world of real estate
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Featured Post */}
          <div className="bg-white p-10 md:p-12 rounded-2xl border border-gray-200 mb-8">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-4">
              FEATURED
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              10 Things to Check Before Buying Your First Home in 2024
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Buying your first home is an exciting milestone, but it's also a major financial decision. 
              From location analysis to legal documentation, here's everything you need to know to make 
              an informed choice and avoid common pitfalls.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>📅 Nov 20, 2024</span>
              <span>⏱️ 8 min read</span>
              <span>🏠 Buying Guide</span>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                category: "Market Trends",
                title: "Real Estate Market Outlook for 2025",
                excerpt: "Expert predictions on property prices, emerging locations, and investment opportunities.",
                date: "Nov 18, 2024",
                readTime: "5 min"
              },
              {
                category: "Home Loans",
                title: "How to Get the Best Home Loan Interest Rate",
                excerpt: "Strategies to improve your credit score and negotiate better loan terms with banks.",
                date: "Nov 15, 2024",
                readTime: "6 min"
              },
              {
                category: "Investment Tips",
                title: "Should You Invest in Commercial vs Residential?",
                excerpt: "A comparative analysis of rental yields, appreciation potential, and maintenance costs.",
                date: "Nov 12, 2024",
                readTime: "7 min"
              },
              {
                category: "Legal Guide",
                title: "Understanding Property Documentation in India",
                excerpt: "A complete guide to sale deeds, encumbrance certificates, and other critical documents.",
                date: "Nov 10, 2024",
                readTime: "9 min"
              },
              {
                category: "Lifestyle",
                title: "Top 10 Amenities Modern Homebuyers Look For",
                excerpt: "From smart homes to sustainability features, what's trending in residential projects.",
                date: "Nov 08, 2024",
                readTime: "4 min"
              },
              {
                category: "Renting Tips",
                title: "Tenant Rights and Responsibilities in India",
                excerpt: "Everything renters need to know about security deposits, lease agreements, and more.",
                date: "Nov 05, 2024",
                readTime: "6 min"
              }
            ].map((post, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-600 transition-colors cursor-pointer">
                <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full mb-3">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime} read</span>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-12 bg-blue-600 p-8 md:p-10 rounded-2xl text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Never Miss an Update
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for weekly insights, property tips, and market trends 
              delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
