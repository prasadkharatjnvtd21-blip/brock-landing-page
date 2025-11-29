"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit");
      }

      setFormSubmitted(true);
      toast.success("Thank you! We'll get back to you within 24 hours.");
      (e.target as HTMLFormElement).reset();
      
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help you find your perfect property
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-10 md:p-12 rounded-2xl border border-gray-200">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Send us a message</h3>
            {formSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center font-medium">
                ✓ Thank you! We'll get back to you within 24 hours.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us about your requirements..."
                  required
                  rows={5}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                  📧
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-1 text-gray-900">Email Us</h4>
                  <p className="text-gray-600 text-sm">support@brock.co.in</p>
                  <p className="text-gray-600 text-sm">sales@brock.co.in</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                  📞
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-1 text-gray-900">Call Us</h4>
                  <p className="text-gray-600 text-sm">+91 1800 123 4567 (Toll Free)</p>
                  <p className="text-gray-600 text-sm">Available: Mon-Sat, 9 AM - 7 PM</p>
                </div>
              </div>
              <a 
                href="https://wa.me/911234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group cursor-pointer hover:bg-green-50 p-3 -mx-3 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-1 text-gray-900 group-hover:text-[#25D366] transition-colors">WhatsApp Us</h4>
                  <p className="text-gray-600 text-sm">+91 1234567890</p>
                  <p className="text-gray-600 text-sm">Quick response - Chat anytime</p>
                </div>
              </a>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                  📍
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-1 text-gray-900">Visit Us</h4>
                  <p className="text-gray-600 text-sm">Brock Technologies Pvt. Ltd.</p>
                  <p className="text-gray-600 text-sm">MG Road, Bangalore - 560001</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                  🕒
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-1 text-gray-900">Business Hours</h4>
                  <p className="text-gray-600 text-sm">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                  <p className="text-gray-600 text-sm">Sunday: 10:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-10 p-8 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-lg mb-4 text-gray-900">Quick Links</h4>
              <div className="space-y-2">
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm font-medium">
                  → Schedule a Property Visit
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm font-medium">
                  → Get Home Loan Assistance
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm font-medium">
                  → Request Property Valuation
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-700 text-sm font-medium">
                  → Download Brochure
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}