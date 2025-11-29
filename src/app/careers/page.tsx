export default function CareersPage() {
  return (
    <section className="py-24 min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
            Careers at Brock
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our team and help transform the real estate industry in India
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Why Join Section */}
          <div className="bg-white p-10 md:p-12 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Join Brock?</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                At Brock, we're building India's most trusted real estate platform. We're a team of 
                passionate individuals committed to bringing transparency and innovation to the property market.
              </p>
              <p>
                We offer competitive salaries, comprehensive benefits, flexible work arrangements, 
                and the opportunity to make a real impact in one of India's largest industries.
              </p>
            </div>
          </div>

          {/* Open Positions */}
          <div className="bg-white p-10 md:p-12 rounded-2xl border border-gray-200 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Open Positions</h2>
            <div className="space-y-4">
              {[
                { title: "Full Stack Developer", dept: "Engineering", location: "Bangalore" },
                { title: "Product Manager", dept: "Product", location: "Bangalore" },
                { title: "Senior Sales Executive", dept: "Sales", location: "Mumbai" },
                { title: "Marketing Specialist", dept: "Marketing", location: "Remote" },
                { title: "Customer Success Manager", dept: "Support", location: "Bangalore" }
              ].map((job, idx) => (
                <div key={idx} className="p-5 border-2 border-gray-200 rounded-lg hover:border-blue-600 transition-colors">
                  <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                    <span>📁 {job.dept}</span>
                    <span>📍 {job.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact HR */}
          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 text-center">
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              Don't see a role that fits?
            </h3>
            <p className="text-gray-600 mb-4">
              Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <a 
              href="mailto:careers@brock.co.in" 
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Email us at careers@brock.co.in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
