"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Phone, Mail, Home } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// This would normally come from a database
const allProperties = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    price: "₹1.2 Cr",
    priceValue: 12000000,
    title: "Luxury 3BHK Apartment",
    location: "Whitefield, Bangalore",
    beds: 3,
    baths: 2,
    sqft: 1850,
    availableFor: "buy" as const,
    description: "A stunning luxury apartment in the heart of Whitefield, featuring modern architecture, premium finishes, and world-class amenities. Perfect for families looking for a blend of comfort and sophistication.",
    amenities: ["Swimming Pool", "Gym", "Power Backup", "Parking", "Security 24/7", "Children's Play Area"],
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ]
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    price: "₹2.8 Cr",
    priceValue: 28000000,
    title: "Modern Villa with Pool",
    location: "Gachibowli, Hyderabad",
    beds: 4,
    baths: 4,
    sqft: 3200,
    availableFor: "both" as const,
    description: "Experience luxury living in this spectacular modern villa featuring a private pool, spacious rooms, and contemporary design. Located in the prime area of Gachibowli with excellent connectivity.",
    amenities: ["Private Pool", "Modular Kitchen", "Garden", "4 Car Parking", "Club House", "Jogging Track"],
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    ]
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    price: "₹3.5 Cr",
    priceValue: 35000000,
    title: "Sky Penthouse",
    location: "Powai, Mumbai",
    beds: 4,
    baths: 3,
    sqft: 2800,
    availableFor: "buy" as const,
    description: "Live above the clouds in this exclusive penthouse offering panoramic views of Mumbai. Features include a private terrace, premium interiors, and access to luxury amenities.",
    amenities: ["Terrace Garden", "Home Theater", "Infinity Pool", "Concierge Service", "Valet Parking", "Sky Lounge"],
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
    ]
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    price: "₹95 L",
    priceValue: 9500000,
    title: "Contemporary 2BHK",
    location: "Noida Extension, Delhi NCR",
    beds: 2,
    baths: 2,
    sqft: 1200,
    availableFor: "rent" as const,
    description: "A perfect starter home for young professionals and couples. This contemporary 2BHK offers modern amenities, efficient space utilization, and excellent connectivity to major business hubs.",
    amenities: ["Lift", "Power Backup", "Parking", "Intercom", "Fire Safety", "Rain Water Harvesting"],
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800",
    ]
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    price: "₹1.8 Cr",
    priceValue: 18000000,
    title: "Spacious Duplex House",
    location: "HSR Layout, Bangalore",
    beds: 3,
    baths: 3,
    sqft: 2400,
    availableFor: "rent" as const,
    description: "Elegant duplex house in the sought-after HSR Layout area. Features include separate living and dining areas, modern kitchen, and a private balcony. Ideal for families seeking space and comfort.",
    amenities: ["Private Garden", "Reserved Parking", "Store Room", "Balcony", "Vastu Compliant", "Gated Community"],
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    ]
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    price: "₹45 L",
    priceValue: 4500000,
    title: "Modern Studio Apartment",
    location: "Hinjewadi, Pune",
    beds: 1,
    baths: 1,
    sqft: 650,
    availableFor: "both" as const,
    description: "Compact and efficient studio apartment perfect for working professionals and students. Located in the IT hub of Pune with easy access to major tech parks and amenities.",
    amenities: ["High Speed Wifi", "Furnished", "Gym Access", "Cafeteria", "Laundry", "24/7 Security"],
    gallery: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800",
    ]
  },
];

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = allProperties.find((p) => p.id === parseInt(params.id));

  // Form states
  const [buyForm, setBuyForm] = useState({ name: "", email: "", phone: "", budget: "", message: "" });
  const [rentForm, setRentForm] = useState({ name: "", email: "", phone: "", moveInDate: "", message: "" });

  if (!property) {
    notFound();
  }

  // Form handlers
  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buy Form:", { ...buyForm, property });
    alert(`Thank you! We'll contact you about ${property.title}`);
    setBuyForm({ name: "", email: "", phone: "", budget: "", message: "" });
  };

  const handleRentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Rent Form:", { ...rentForm, property });
    alert(`Thank you! We'll contact you about renting ${property.title}`);
    setRentForm({ name: "", email: "", phone: "", moveInDate: "", message: "" });
  };

  return (
    <>
      <section className="py-24 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
          {/* Back Button */}
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Properties
          </Link>

          {/* Property Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
              <MapPin className="w-5 h-5" />
              {property.location}
            </div>
            <div className="text-4xl font-extrabold text-blue-600">
              {property.price}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-[500px] object-cover"
                />
              </div>

              {/* Gallery */}
              <div className="grid grid-cols-3 gap-4">
                {property.gallery.map((img, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden">
                    <img
                      src={img}
                      alt={`${property.title} ${idx + 1}`}
                      className="w-full h-40 object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Property
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Property Details
                </h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bed className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Bedrooms</div>
                      <div className="text-xl font-bold text-gray-900">
                        {property.beds}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bath className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Bathrooms</div>
                      <div className="text-xl font-bold text-gray-900">
                        {property.baths}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Maximize className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Square Feet</div>
                      <div className="text-xl font-bold text-gray-900">
                        {property.sqft}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Amenities
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Contact Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Interested in this property?
                </h3>

                {/* Buy/Rent Action Buttons */}
                <div className="space-y-3 mb-6">
                  {(property.availableFor === "buy" || property.availableFor === "both") && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          <Home className="w-5 h-5" />
                          Buy This Property
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Buy Property</DialogTitle>
                          <DialogDescription>
                            Express your interest in {property.title}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleBuySubmit} className="space-y-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <Input
                              required
                              value={buyForm.name}
                              onChange={(e) => setBuyForm({ ...buyForm, name: e.target.value })}
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <Input
                              required
                              type="email"
                              value={buyForm.email}
                              onChange={(e) => setBuyForm({ ...buyForm, email: e.target.value })}
                              placeholder="your.email@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Phone</label>
                            <Input
                              required
                              type="tel"
                              value={buyForm.phone}
                              onChange={(e) => setBuyForm({ ...buyForm, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Budget</label>
                            <Input
                              required
                              value={buyForm.budget}
                              onChange={(e) => setBuyForm({ ...buyForm, budget: e.target.value })}
                              placeholder="e.g., ₹1.5 Cr"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Message</label>
                            <Textarea
                              value={buyForm.message}
                              onChange={(e) => setBuyForm({ ...buyForm, message: e.target.value })}
                              placeholder="Any specific requirements or questions..."
                              rows={3}
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Submit Interest
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}

                  {(property.availableFor === "rent" || property.availableFor === "both") && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant={property.availableFor === "both" ? "outline" : "default"}
                          className="w-full" 
                          size="lg"
                        >
                          Rent This Property
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Rent Property</DialogTitle>
                          <DialogDescription>
                            Inquire about renting {property.title}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRentSubmit} className="space-y-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <Input
                              required
                              value={rentForm.name}
                              onChange={(e) => setRentForm({ ...rentForm, name: e.target.value })}
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <Input
                              required
                              type="email"
                              value={rentForm.email}
                              onChange={(e) => setRentForm({ ...rentForm, email: e.target.value })}
                              placeholder="your.email@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Phone</label>
                            <Input
                              required
                              type="tel"
                              value={rentForm.phone}
                              onChange={(e) => setRentForm({ ...rentForm, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Move-in Date</label>
                            <Input
                              required
                              type="date"
                              value={rentForm.moveInDate}
                              onChange={(e) => setRentForm({ ...rentForm, moveInDate: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Message</label>
                            <Textarea
                              value={rentForm.message}
                              onChange={(e) => setRentForm({ ...rentForm, message: e.target.value })}
                              placeholder="Any specific requirements or questions..."
                              rows={3}
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Submit Inquiry
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Or send us a general inquiry:
                  </p>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter your phone"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        placeholder="I'm interested in this property..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Send Inquiry
                    </button>
                  </form>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    +91 98765 43210
                  </a>
                  <a
                    href="mailto:contact@brock.co.in"
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    contact@brock.co.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}