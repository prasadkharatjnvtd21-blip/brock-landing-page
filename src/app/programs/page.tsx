import Link from "next/link";

export default function ProgramsPage() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 text-gray-900">
            Brock Programs
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Join our programs and be part of India's fastest-growing real estate platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* List Property */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl border-2 border-gray-200 text-center transition-all hover:border-blue-600 hover:-translate-y-2 hover:shadow-lg">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6">
              📋
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
              List Your Property
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              List your property for FREE and reach millions of potential buyers and tenants. Get maximum visibility with our verified listings.
            </p>
            <Link
              href="/contact"
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Refer & Earn */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl border-2 border-gray-200 text-center transition-all hover:border-blue-600 hover:-translate-y-2 hover:shadow-lg">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6">
              🤝
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
              Refer & Earn
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Refer properties or clients and earn up to ₹50,000 per successful transaction. Turn your network into a revenue stream.
            </p>
            <Link
              href="/contact"
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
            >
              Start Referring
            </Link>
          </div>

          {/* Affiliate Program */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl border-2 border-gray-200 text-center transition-all hover:border-blue-600 hover:-translate-y-2 hover:shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6">
              💼
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
              Affiliate Program
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Partner with Brock as an affiliate. Promote our platform and earn attractive commissions on every successful deal.
            </p>
            <Link
              href="/contact"
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
            >
              Become Affiliate
            </Link>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 sm:mt-16 md:mt-20 bg-gradient-to-br from-blue-50 to-white p-6 sm:p-8 md:p-12 lg:p-16 rounded-xl sm:rounded-2xl border border-blue-100">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-10 md:mb-12 text-gray-900">
            Why Join Brock Programs?
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎯</div>
              <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">Easy Onboarding</h4>
              <p className="text-xs sm:text-sm text-gray-600">Quick and simple registration process</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">💰</div>
              <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">High Earnings</h4>
              <p className="text-xs sm:text-sm text-gray-600">Competitive commissions and rewards</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📊</div>
              <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">Real-time Tracking</h4>
              <p className="text-xs sm:text-sm text-gray-600">Monitor your performance 24/7</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🤝</div>
              <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">Dedicated Support</h4>
              <p className="text-xs sm:text-sm text-gray-600">Expert team to assist you always</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}