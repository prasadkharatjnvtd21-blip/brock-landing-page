"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal, Home, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
  createdAt: string;
  updatedAt: string;
}

export default function PropertiesPage() {
  const searchParams = useSearchParams();

  // ✏️ EDITABLE HERO SECTION CONTENT
  const heroContent = useMemo(() => ({
    title: "Your Complete Real Estate Partner",
    description: "We don't just find your dream home—we handle everything. From property search to financing and loan documentation through our trusted partners, every property is legally verified to ensure zero disputes. We customize homes to your exact requirements and take responsibility for all certificates and documentation. Your journey from search to settlement, completely handled.",
  }), []);

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties from API (optimized with useCallback)
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/properties");
      if (!response.ok) throw new Error("Failed to fetch properties");
      const data = await response.json();
      setAllProperties(data);
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Initialize search state from URL parameters
  const [searchTerm, setSearchTerm] = useState("");
  const [bedsFilter, setBedsFilter] = useState("all");
  const [bathsFilter, setBathsFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  // Apply URL parameters on mount
  useEffect(() => {
    const location = searchParams.get("location");
    const budget = searchParams.get("budget");

    if (location) setSearchTerm(location);

    // Map budget to price range filter with exact matching
    if (budget) {
      if (budget === "Below ₹50 Lakhs") {
        setPriceRange("0-50");
      } else if (budget === "₹50L - ₹1 Crore") {
        setPriceRange("50-100");
      } else if (budget === "₹1 Cr - ₹2 Crore") {
        setPriceRange("100-200");
      } else if (budget === "Above ₹2 Crore") {
        setPriceRange("200+");
      }
    }

    // Show filters if any params are present
    if (location || budget) {
      setShowFilters(true);
    }
  }, [searchParams]);

  // Form states
  const [buyForm, setBuyForm] = useState({ name: "", email: "", phone: "", budget: "", message: "" });
  const [rentForm, setRentForm] = useState({ name: "", email: "", phone: "", moveInDate: "", message: "" });
  const [listForm, setListForm] = useState({ name: "", email: "", phone: "", propertyType: "", location: "", price: "", description: "" });
  const [selectedProperty, setSelectedProperty] = useState<typeof allProperties[0] | null>(null);
  const [isSubmittingBuy, setIsSubmittingBuy] = useState(false);
  const [isSubmittingRent, setIsSubmittingRent] = useState(false);
  const [isSubmittingList, setIsSubmittingList] = useState(false);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [rentDialogOpen, setRentDialogOpen] = useState(false);
  const [listDialogOpen, setListDialogOpen] = useState(false);

  // Optimized filtering and sorting with useMemo
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = [...allProperties];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(term) ||
          property.location.toLowerCase().includes(term)
      );
    }

    // Beds filter
    if (bedsFilter !== "all") {
      const beds = parseInt(bedsFilter);
      filtered = filtered.filter((property) => property.beds === beds);
    }

    // Baths filter
    if (bathsFilter !== "all") {
      const baths = parseInt(bathsFilter);
      filtered = filtered.filter((property) => property.baths === baths);
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter((property) => {
        const price = property.priceValue;
        switch (priceRange) {
          case "0-50":
            return price < 5000000;
          case "50-100":
            return price >= 5000000 && price < 10000000;
          case "100-200":
            return price >= 10000000 && price < 20000000;
          case "200+":
            return price >= 20000000;
          default:
            return true;
        }
      });
    }

    // Sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.priceValue - a.priceValue);
    } else if (sortBy === "sqft-low") {
      filtered.sort((a, b) => a.sqft - b.sqft);
    } else if (sortBy === "sqft-high") {
      filtered.sort((a, b) => b.sqft - a.sqft);
    } else if (sortBy === "beds") {
      filtered.sort((a, b) => b.beds - a.beds);
    }

    return filtered;
  }, [allProperties, searchTerm, bedsFilter, bathsFilter, priceRange, sortBy]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setBedsFilter("all");
    setBathsFilter("all");
    setPriceRange("all");
    setSortBy("default");
  }, []);

  const activeFiltersCount = useMemo(() => 
    [
      searchTerm !== "",
      bedsFilter !== "all",
      bathsFilter !== "all",
      priceRange !== "all",
      sortBy !== "default",
    ].filter(Boolean).length
  , [searchTerm, bedsFilter, bathsFilter, priceRange, sortBy]);

  // Form handlers
  const handleBuySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    setIsSubmittingBuy(true);
    try {
      const response = await fetch("/api/buy-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          propertyTitle: selectedProperty.title,
          name: buyForm.name,
          email: buyForm.email,
          phone: buyForm.phone,
          budget: buyForm.budget,
          message: buyForm.message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit");
      }

      toast.success(`Thank you! We'll contact you about ${selectedProperty.title}`);
      setBuyForm({ name: "", email: "", phone: "", budget: "", message: "" });
      setBuyDialogOpen(false);
    } catch (error) {
      console.error("Buy form error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmittingBuy(false);
    }
  }, [selectedProperty, buyForm]);

  const handleRentSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    setIsSubmittingRent(true);
    try {
      const response = await fetch("/api/rent-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          propertyTitle: selectedProperty.title,
          name: rentForm.name,
          email: rentForm.email,
          phone: rentForm.phone,
          moveInDate: rentForm.moveInDate,
          message: rentForm.message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit");
      }

      toast.success(`Thank you! We'll contact you about renting ${selectedProperty.title}`);
      setRentForm({ name: "", email: "", phone: "", moveInDate: "", message: "" });
      setRentDialogOpen(false);
    } catch (error) {
      console.error("Rent form error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmittingRent(false);
    }
  }, [selectedProperty, rentForm]);

  const handleListSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingList(true);

    try {
      const response = await fetch("/api/listing-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: listForm.name,
          email: listForm.email,
          phone: listForm.phone,
          propertyType: listForm.propertyType,
          location: listForm.location,
          price: listForm.price,
          description: listForm.description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit");
      }

      toast.success("Thank you! We'll review your property listing and contact you soon.");
      setListForm({ name: "", email: "", phone: "", propertyType: "", location: "", price: "", description: "" });
      setListDialogOpen(false);
    } catch (error) {
      console.error("List form error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmittingList(false);
    }
  }, [listForm]);

  return (
    <>
      <section className="py-24 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
              {heroContent.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {heroContent.description}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Filter Toggle & Sort */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium cursor-pointer"
                >
                  <option value="default">Sort By: Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="sqft-low">Size: Small to Large</option>
                  <option value="sqft-high">Size: Large to Small</option>
                  <option value="beds">Bedrooms: Most First</option>
                </select>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-medium"
                  >
                    Reset All
                  </button>
                )}
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="p-6 rounded-xl border border-gray-200 bg-white space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Beds Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <select
                      value={bedsFilter}
                      onChange={(e) => setBedsFilter(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
                    >
                      <option value="all">All Bedrooms</option>
                      <option value="1">1 Bedroom</option>
                      <option value="2">2 Bedrooms</option>
                      <option value="3">3 Bedrooms</option>
                      <option value="4">4+ Bedrooms</option>
                    </select>
                  </div>

                  {/* Baths Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <select
                      value={bathsFilter}
                      onChange={(e) => setBathsFilter(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
                    >
                      <option value="all">All Bathrooms</option>
                      <option value="1">1 Bathroom</option>
                      <option value="2">2 Bathrooms</option>
                      <option value="3">3 Bathrooms</option>
                      <option value="4">4+ Bathrooms</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
                    >
                      <option value="all">All Prices</option>
                      <option value="0-50">Under ₹50 Lakhs</option>
                      <option value="50-100">₹50L - ₹1 Cr</option>
                      <option value="100-200">₹1 Cr - ₹2 Cr</option>
                      <option value="200+">Above ₹2 Cr</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6 text-gray-600 font-medium">
            Showing {filteredAndSortedProperties.length} of {allProperties.length} properties
          </div>

          {/* Property Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredAndSortedProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 transition-all hover:-translate-y-2 hover:shadow-xl"
                >
                  <Link href={`/properties/${property.id}`}>
                    <div className="relative w-full h-60">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-6">
                    <div className="text-3xl font-extrabold text-blue-600 mb-2">
                      {property.price}
                    </div>
                    <Link href={`/properties/${property.id}`}>
                      <h3 className="text-lg font-bold mb-2 text-gray-900 hover:text-blue-600">
                        {property.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-4">
                      📍 {property.location}
                    </p>
                    <div className="flex gap-5 pt-4 border-t border-gray-200 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1.5">
                        🛏️ {property.beds} Beds
                      </span>
                      <span className="flex items-center gap-1.5">
                        🚿 {property.baths} Baths
                      </span>
                      <span className="flex items-center gap-1.5">
                        📏 {property.sqft} sqft
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" 
                            onClick={() => setSelectedProperty(property)}
                          >
                            <Home className="w-4 h-4" />
                            Buy
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
                                disabled={isSubmittingBuy}
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
                                disabled={isSubmittingBuy}
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
                                disabled={isSubmittingBuy}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Budget</label>
                              <Input
                                required
                                value={buyForm.budget}
                                onChange={(e) => setBuyForm({ ...buyForm, budget: e.target.value })}
                                placeholder="e.g., ₹1.5 Cr"
                                disabled={isSubmittingBuy}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Message</label>
                              <Textarea
                                value={buyForm.message}
                                onChange={(e) => setBuyForm({ ...buyForm, message: e.target.value })}
                                placeholder="Any specific requirements or questions..."
                                rows={3}
                                disabled={isSubmittingBuy}
                              />
                            </div>
                            <Button 
                              type="submit" 
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                              disabled={isSubmittingBuy}
                            >
                              {isSubmittingBuy ? "Submitting..." : "Submit Interest"}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={rentDialogOpen} onOpenChange={setRentDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setSelectedProperty(property)}
                          >
                            Rent
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
                                disabled={isSubmittingRent}
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
                                disabled={isSubmittingRent}
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
                                disabled={isSubmittingRent}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Move-in Date</label>
                              <Input
                                required
                                type="date"
                                value={rentForm.moveInDate}
                                onChange={(e) => setRentForm({ ...rentForm, moveInDate: e.target.value })}
                                disabled={isSubmittingRent}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Message</label>
                              <Textarea
                                value={rentForm.message}
                                onChange={(e) => setRentForm({ ...rentForm, message: e.target.value })}
                                placeholder="Any specific requirements or questions..."
                                rows={3}
                                disabled={isSubmittingRent}
                              />
                            </div>
                            <Button 
                              type="submit" 
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                              disabled={isSubmittingRent}
                            >
                              {isSubmittingRent ? "Submitting..." : "Submit Inquiry"}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search criteria
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* List Property Link */}
          <div className="text-center mt-12">
            <Dialog open={listDialogOpen} onOpenChange={setListDialogOpen}>
              <DialogTrigger asChild>
                <button className="text-sm text-gray-600 hover:text-blue-600 underline underline-offset-4 transition-colors">
                  List your property
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>List Your Property</DialogTitle>
                  <DialogDescription>
                    Fill in the details to list your property with us
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleListSubmit} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      required
                      value={listForm.name}
                      onChange={(e) => setListForm({ ...listForm, name: e.target.value })}
                      placeholder="Your full name"
                      disabled={isSubmittingList}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      required
                      type="email"
                      value={listForm.email}
                      onChange={(e) => setListForm({ ...listForm, email: e.target.value })}
                      placeholder="your.email@example.com"
                      disabled={isSubmittingList}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      required
                      type="tel"
                      value={listForm.phone}
                      onChange={(e) => setListForm({ ...listForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      disabled={isSubmittingList}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type</label>
                    <select
                      required
                      value={listForm.propertyType}
                      onChange={(e) => setListForm({ ...listForm, propertyType: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={isSubmittingList}
                    >
                      <option value="">Select type</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="house">House</option>
                      <option value="studio">Studio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      required
                      value={listForm.location}
                      onChange={(e) => setListForm({ ...listForm, location: e.target.value })}
                      placeholder="e.g., Whitefield, Bangalore"
                      disabled={isSubmittingList}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expected Price</label>
                    <Input
                      required
                      value={listForm.price}
                      onChange={(e) => setListForm({ ...listForm, price: e.target.value })}
                      placeholder="e.g., ₹1.2 Cr"
                      disabled={isSubmittingList}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      required
                      value={listForm.description}
                      onChange={(e) => setListForm({ ...listForm, description: e.target.value })}
                      placeholder="Describe your property, including bedrooms, bathrooms, amenities, etc."
                      rows={4}
                      disabled={isSubmittingList}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmittingList}
                  >
                    {isSubmittingList ? "Submitting..." : "Submit Listing"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    </>
  );
}