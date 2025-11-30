"use client";

import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Phone, Mail, Home } from "lucide-react";
import { useState, useEffect } from "react";
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
import { toast } from "sonner";

interface Property {
  id: number;
  image: string;
  price: string;
  priceValue: number;
  title: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  availableFor: "buy" | "rent" | "both";
  description?: string;
  amenities?: string[];
  gallery?: string[];
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [buyForm, setBuyForm] = useState({ name: "", email: "", phone: "", budget: "", message: "" });
  const [rentForm, setRentForm] = useState({ name: "", email: "", phone: "", moveInDate: "", message: "" });
  const [generalForm, setGeneralForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/properties?id=${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch property");
        }
        
        const data = await response.json();
        setProperty(data);
      } catch (err: any) {
        setError(err.message || "Failed to load property");
        toast.error("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  // Form handlers
  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/buy-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          name: buyForm.name,
          email: buyForm.email,
          phone: buyForm.phone,
          budget: buyForm.budget,
          message: buyForm.message,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit inquiry");

      toast.success(`Thank you! We'll contact you about ${property.title}`);
      setBuyForm({ name: "", email: "", phone: "", budget: "", message: "" });
    } catch (error) {
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/rent-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          name: rentForm.name,
          email: rentForm.email,
          phone: rentForm.phone,
          moveInDate: rentForm.moveInDate,
          message: rentForm.message,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit inquiry");

      toast.success(`Thank you! We'll contact you about renting ${property.title}`);
      setRentForm({ name: "", email: "", phone: "", moveInDate: "", message: "" });
    } catch (error) {
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          name: generalForm.name,
          email: generalForm.email,
          phone: generalForm.phone,
          message: generalForm.message,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit inquiry");

      toast.success("Thank you! We'll get back to you soon.");
      setGeneralForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-24 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading property details...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !property) {
    return (
      <section className="py-24 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "The property you're looking for doesn't exist."}</p>
            <Link href="/properties" className="text-blue-600 hover:underline">
              ← Back to Properties
            </Link>
          </div>
        </div>
      </section>
    );
  }

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
              {property.gallery && property.gallery.length > 0 && (
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
              )}

              {/* Description */}
              {property.description && (
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About This Property
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              )}

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
              {property.amenities && property.amenities.length > 0 && (
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
              )}
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
                          <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Interest"}
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
                          <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Inquiry"}
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
                  <form className="space-y-4" onSubmit={handleGeneralSubmit}>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={generalForm.name}
                        onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
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
                        required
                        value={generalForm.email}
                        onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
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
                        required
                        value={generalForm.phone}
                        onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
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
                        required
                        value={generalForm.message}
                        onChange={(e) => setGeneralForm({ ...generalForm, message: e.target.value })}
                        placeholder="I'm interested in this property..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Inquiry"}
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