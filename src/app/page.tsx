"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"buy" | "rent" | "commercial">("buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [budgetRange, setBudgetRange] = useState("Below ₹50 Lakhs");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build search parameters
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (propertyType) params.set("type", propertyType);
    if (budgetRange) params.set("budget", budgetRange);
    params.set("category", activeTab);
    
    // Navigate to properties page with search parameters
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
                Find Your Perfect Home in Minutes
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover thousands of verified properties across India. Buy, sell, rent, or invest in residential and commercial properties with confidence on Brock. We also specialize in commercial stores and shops for your business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/properties"
                  className="px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-md text-center"
                >
                  Explore Properties
                </Link>
                <Link
                  href="/programs"
                  className="px-8 py-4 text-base font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 shadow-md text-center"
                >
                  List Your Property
                </Link>
              </div>
              <div className="flex flex-wrap gap-8 pt-6 border-t border-gray-200">
                <div>
                  <strong className="block text-2xl font-extrabold text-gray-900">50,000+</strong>
                  <span className="text-sm text-gray-500">Properties Listed</span>
                </div>
                <div>
                  <strong className="block text-2xl font-extrabold text-gray-900">10,000+</strong>
                  <span className="text-sm text-gray-500">Happy Customers</span>
                </div>
                <div>
                  <strong className="block text-2xl font-extrabold text-gray-900">500+</strong>
                  <span className="text-sm text-gray-500">Cities Covered</span>
                </div>
              </div>
            </div>

            {/* Right - Search Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
              <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab("buy")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === "buy"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-900 hover:bg-white"
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("rent")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === "rent"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-900 hover:bg-white"
                  }`}
                >
                  Rent
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("commercial")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === "commercial"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-900 hover:bg-white"
                  }`}
                >
                  Commercial
                </button>
              </div>
              <form className="space-y-4" onSubmit={handleSearch}>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Enter city, locality, or project"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                  >
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Independent House</option>
                    <option>Plot</option>
                    <option>Studio</option>
                    <option disabled>─────────────</option>
                    <option>Shop</option>
                    <option>Showroom</option>
                    <option>Office Space</option>
                    <option>Commercial Building</option>
                    <option>Warehouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Budget Range</label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                  >
                    <option>Below ₹50 Lakhs</option>
                    <option>₹50L - ₹1 Crore</option>
                    <option>₹1 Cr - ₹2 Crore</option>
                    <option>Above ₹2 Crore</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="block w-full py-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all text-center"
                >
                  Search Properties
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
              How Brock Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your journey to finding the perfect property is just three simple steps away
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center transition-all hover:-translate-y-2 hover:shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
                🔍
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Search & Discover</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse through thousands of verified properties across India. Use our advanced filters to find exactly what you're looking for.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center transition-all hover:-translate-y-2 hover:shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
                📞
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Connect & Visit</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect directly with property owners or our verified agents. Schedule site visits at your convenience with zero hassle.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center transition-all hover:-translate-y-2 hover:shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
                🏠
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Close the Deal</h3>
              <p className="text-gray-600 leading-relaxed">
                Get expert assistance with documentation, legal verification, and home loans. Move into your dream home with complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}