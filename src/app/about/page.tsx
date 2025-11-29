export default function AboutPage() {
  return (
    <section className="py-24 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
        <div className="grid md:grid-cols-2 gap-20 items-center mb-20">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
            alt="About Brock"
            className="w-full h-[500px] rounded-2xl object-cover bg-gradient-to-br from-gray-200 to-gray-300"
          />
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
              About Brock
            </h1>
            <p className="text-lg text-gray-600 mb-5 leading-relaxed">
              Brock is India's most trusted real estate platform, connecting property seekers with their dream homes since 2020. We've revolutionized the way people buy, sell, and rent properties across India.
            </p>
            <p className="text-lg text-gray-600 mb-5 leading-relaxed">
              With cutting-edge technology, verified listings, and a dedicated team of real estate experts, we make property transactions transparent, efficient, and hassle-free.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our mission is to empower every Indian to make informed real estate decisions with confidence and ease.
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <strong className="block text-4xl font-extrabold text-blue-600 mb-2">
                  500+
                </strong>
                <span className="text-sm text-gray-600">Cities Covered</span>
              </div>
              <div className="text-center">
                <strong className="block text-4xl font-extrabold text-blue-600 mb-2">
                  50K+
                </strong>
                <span className="text-sm text-gray-600">Properties</span>
              </div>
              <div className="text-center">
                <strong className="block text-4xl font-extrabold text-blue-600 mb-2">
                  10K+
                </strong>
                <span className="text-sm text-gray-600">Happy Customers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">
          <div className="bg-blue-50 p-10 rounded-2xl border border-blue-100">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To democratize real estate in India by providing transparent, accessible, and efficient property solutions for everyone. We strive to make property search and transactions as simple as online shopping.
            </p>
          </div>
          <div className="bg-amber-50 p-10 rounded-2xl border border-amber-100">
            <div className="text-4xl mb-4">🔭</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To become India's #1 real estate platform, where every property transaction is seamless, secure, and satisfying. We envision a future where finding your dream home is stress-free and exciting.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
            Our Core Values
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The principles that guide everything we do at Brock
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ✨
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Transparency</h3>
            <p className="text-sm text-gray-600">
              Honest and clear communication in every transaction
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🛡️
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Trust</h3>
            <p className="text-sm text-gray-600">
              Building lasting relationships through reliability
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🚀
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Innovation</h3>
            <p className="text-sm text-gray-600">
              Leveraging technology for better experiences
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ❤️
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Customer First</h3>
            <p className="text-sm text-gray-600">
              Your satisfaction is our top priority
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}