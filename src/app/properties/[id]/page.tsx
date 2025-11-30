"use client";

import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Phone, Mail, Home, X, ChevronLeft, ChevronRight, ZoomIn, Share2, Facebook, Twitter, Copy, Check } from "lucide-react";
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
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  
  // Image lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);

  // Share state
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Form states
  const [buyForm, setBuyForm] = useState({ name: "", email: "", phone: "", budget: "", message: "" });
  const [rentForm, setRentForm] = useState({ name: "", email: "", phone: "", moveInDate: "", message: "" });
  const [generalForm, setGeneralForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get all images for lightbox (main + gallery)
  const allImages = property ? [property.image, ...(property.gallery || [])] : [];

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

        // Fetch similar properties based on location and beds
        const allPropsResponse = await fetch("/api/properties?limit=100");
        if (allPropsResponse.ok) {
          const allProps = await allPropsResponse.json();
          const similar = allProps
            .filter((p: Property) => 
              p.id !== data.id && 
              (p.location === data.location || p.beds === data.beds)
            )
            .slice(0, 3);
          setSimilarProperties(similar);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load property");
        toast.error("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
        setImageZoom(1);
      } else if (e.key === "ArrowLeft") {
        navigateLightbox("prev");
      } else if (e.key === "ArrowRight") {
        navigateLightbox("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, currentImageIndex, allImages.length]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    setImageZoom(1);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    setImageZoom(1);
    if (direction === "prev") {
      setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    } else {
      setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    }
  };

  const handleShare = async (platform: "native" | "whatsapp" | "facebook" | "twitter" | "copy") => {
    const url = window.location.href;
    const text = `Check out this property: ${property?.title}`;

    if (platform === "native" && navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: text,
          url: url,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        // User cancelled or error
      }
      return;
    }

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

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
      <section className="py-16 md:py-24 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
          {/* Back Button */}
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 md:mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm md:text-base">Back to Properties</span>
          </Link>

          {/* Property Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
                {property.title}
              </h1>
              <Button
                onClick={() => setShareDialogOpen(true)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
            <div className="flex items-center gap-2 text-base md:text-lg text-gray-600 mb-4">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              {property.location}
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-blue-600">
              {property.price}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden cursor-pointer" onClick={() => openLightbox(0)}>
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-[300px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Gallery */}
              {property.gallery && property.gallery.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {property.gallery.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => openLightbox(idx + 1)}
                    >
                      <img
                        src={img}
                        alt={`${property.title} ${idx + 1}`}
                        className="w-full h-32 md:h-40 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    About This Property
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Property Details */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                  Property Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
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
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
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
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
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
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {property.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-gray-700 text-sm md:text-base"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Properties */}
              {similarProperties.length > 0 && (
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    Similar Properties
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {similarProperties.map((similar) => (
                      <Link
                        key={similar.id}
                        href={`/properties/${similar.id}`}
                        className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                      >
                        <img
                          src={similar.image}
                          alt={similar.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-4">
                          <div className="text-lg font-bold text-blue-600 mb-1">
                            {similar.price}
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 text-sm md:text-base">
                            {similar.title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                            📍 {similar.location}
                          </p>
                          <div className="flex gap-3 text-xs text-gray-600">
                            <span>🛏️ {similar.beds}</span>
                            <span>🚿 {similar.baths}</span>
                            <span>📏 {similar.sqft} sqft</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Contact Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 lg:sticky lg:top-24">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
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
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors text-sm md:text-base"
                  >
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    +91 98765 43210
                  </a>
                  <a
                    href="mailto:contact@brock.co.in"
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors text-sm md:text-base"
                  >
                    <Mail className="w-5 h-5 flex-shrink-0" />
                    contact@brock.co.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          <button
            onClick={() => {
              setLightboxOpen(false);
              setImageZoom(1);
            }}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>

          <button
            onClick={() => navigateLightbox("prev")}
            className="absolute left-4 z-10 p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
            disabled={allImages.length <= 1}
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>

          <button
            onClick={() => navigateLightbox("next")}
            className="absolute right-4 z-10 p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
            disabled={allImages.length <= 1}
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-white px-4 py-2 rounded-full">
            <button
              onClick={() => setImageZoom(zoom => Math.min(zoom + 0.5, 3))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-gray-900" />
            </button>
            <span className="text-sm font-medium text-gray-900">
              {currentImageIndex + 1} / {allImages.length}
            </span>
            <button
              onClick={() => setImageZoom(1)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 px-2"
              title="Reset zoom"
            >
              Reset
            </button>
          </div>

          <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden">
            <img
              src={allImages[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${imageZoom})` }}
            />
          </div>
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Property</DialogTitle>
            <DialogDescription>
              Share this property with friends and family
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {navigator.share && (
              <Button
                onClick={() => handleShare("native")}
                variant="outline"
                className="w-full justify-start"
              >
                <Share2 className="w-5 h-5 mr-3" />
                Share via...
              </Button>
            )}
            <Button
              onClick={() => handleShare("whatsapp")}
              variant="outline"
              className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </Button>
            <Button
              onClick={() => handleShare("facebook")}
              variant="outline"
              className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Facebook className="w-5 h-5 mr-3" />
              Facebook
            </Button>
            <Button
              onClick={() => handleShare("twitter")}
              variant="outline"
              className="w-full justify-start text-sky-500 hover:text-sky-600 hover:bg-sky-50"
            >
              <Twitter className="w-5 h-5 mr-3" />
              Twitter
            </Button>
            <Button
              onClick={() => handleShare("copy")}
              variant="outline"
              className="w-full justify-start"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-3 text-green-600" />
                  <span className="text-green-600">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-3" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}