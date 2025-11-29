"use client";

import Link from "next/link";
import { useState, memo, useCallback } from "react";

const FooterContent = memo(() => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-8 md:py-10 lg:py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20">
        {/* Newsletter Section */}
        <div className="py-6 md:py-7 lg:py-8 mb-6 md:mb-8 lg:mb-10 border-b border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">
              Subscribe to Our Newsletter
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest property listings, market insights, and exclusive deals delivered to your inbox.
            </p>
            {subscribed && (
              <div className="mb-3 p-3 bg-green-600/20 border border-green-600 rounded-lg text-green-400 text-sm font-medium">
                ✓ Successfully subscribed! Thank you.
              </div>
            )}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 md:gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 mb-6 md:mb-8 lg:mb-10">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-500 mb-3 md:mb-4">
              Brock
            </h3>
            <p className="text-sm text-gray-400 mb-4 md:mb-5 leading-relaxed max-w-md">
              India's most trusted real estate platform. Find, buy, sell, or rent properties with complete transparency and confidence.
            </p>
            <p className="text-gray-500 text-xs">
              © 2024 Brock Technologies Pvt. Ltd. All rights reserved.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm md:text-base font-bold mb-3 md:mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  prefetch={true} 
                  className="text-gray-400 hover:text-white text-sm transition-colors inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/careers" 
                  prefetch={true} 
                  className="text-gray-400 hover:text-white text-sm transition-colors inline-block"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  href="/press" 
                  prefetch={true} 
                  className="text-gray-400 hover:text-white text-sm transition-colors inline-block"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  prefetch={true} 
                  className="text-gray-400 hover:text-white text-sm transition-colors inline-block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin" 
                  prefetch={true} 
                  className="text-gray-400 hover:text-white text-sm transition-colors inline-block"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-sm md:text-base font-bold mb-3 md:mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/properties" 
                  prefetch={true} 
                  className="text-gray-400 hover:text-white text-sm transition-colors inline-block"
                >
                  Buy Property
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties" 
                  prefetch={true} 
                  className="text-gray-400 hover:text-white text-sm transition-colors inline-block"
                >
                  Rent Property
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs" 
                  prefetch={true} 
                  className="text-gray-400 hover:text-white text-sm transition-colors inline-block"
                >
                  List Property
                </Link>
              </li>
              <li>
                <Link 
                  href="/calculators" 
                  prefetch={true} 
                  className="text-gray-400 hover:text-white text-sm transition-colors inline-block"
                >
                  Calculators
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors inline-block">
                  Home Loans
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 md:pt-5 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-xs">
            Made with ❤️ in India | brock.co.in
          </p>
        </div>
      </div>
    </footer>
  );
});

FooterContent.displayName = "FooterContent";

export const Footer = FooterContent;