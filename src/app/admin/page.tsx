"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  description: string | null;
  amenities: string[] | null;
  gallery: string[] | null;
  categories: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PropertyFormData {
  image: string;
  price: string;
  priceValue: string;
  title: string;
  location: string;
  beds: string;
  baths: string;
  sqft: string;
  availableFor: "buy" | "rent" | "both";
  description: string;
  amenities: string;
  gallery: string;
  categories: string;
}

const initialFormData: PropertyFormData = {
  image: "",
  price: "",
  priceValue: "",
  title: "",
  location: "",
  beds: "",
  baths: "",
  sqft: "",
  availableFor: "buy",
  description: "",
  amenities: "",
  gallery: "",
  categories: "",
};

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/properties");
      if (!response.ok) throw new Error("Failed to fetch properties");
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      toast.error("Failed to load properties");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Create property
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Parse amenities and gallery from comma-separated strings to arrays
      const amenitiesArray = formData.amenities
        .split(",")
        .map(a => a.trim())
        .filter(a => a.length > 0);
      
      const galleryArray = formData.gallery
        .split(",")
        .map(g => g.trim())
        .filter(g => g.length > 0);

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: formData.image,
          price: formData.price,
          priceValue: parseInt(formData.priceValue),
          title: formData.title,
          location: formData.location,
          beds: parseInt(formData.beds),
          baths: parseInt(formData.baths),
          sqft: parseInt(formData.sqft),
          availableFor: formData.availableFor,
          description: formData.description || null,
          amenities: amenitiesArray.length > 0 ? amenitiesArray : null,
          gallery: galleryArray.length > 0 ? galleryArray : null,
          categories: formData.categories || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create property");
      }

      toast.success("Property created successfully!");
      setIsCreateOpen(false);
      setFormData(initialFormData);
      fetchProperties();
    } catch (error: any) {
      toast.error(error.message || "Failed to create property");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Update property
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    setSubmitting(true);

    try {
      // Parse amenities and gallery from comma-separated strings to arrays
      const amenitiesArray = formData.amenities
        .split(",")
        .map(a => a.trim())
        .filter(a => a.length > 0);
      
      const galleryArray = formData.gallery
        .split(",")
        .map(g => g.trim())
        .filter(g => g.length > 0);

      const response = await fetch(`/api/properties?id=${selectedProperty.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: formData.image,
          price: formData.price,
          priceValue: parseInt(formData.priceValue),
          title: formData.title,
          location: formData.location,
          beds: parseInt(formData.beds),
          baths: parseInt(formData.baths),
          sqft: parseInt(formData.sqft),
          availableFor: formData.availableFor,
          description: formData.description || null,
          amenities: amenitiesArray.length > 0 ? amenitiesArray : null,
          gallery: galleryArray.length > 0 ? galleryArray : null,
          categories: formData.categories || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update property");
      }

      toast.success("Property updated successfully!");
      setIsEditOpen(false);
      setSelectedProperty(null);
      setFormData(initialFormData);
      fetchProperties();
    } catch (error: any) {
      toast.error(error.message || "Failed to update property");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete property
  const handleDelete = async () => {
    if (!selectedProperty) return;
    setSubmitting(true);

    try {
      const response = await fetch(`/api/properties?id=${selectedProperty.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete property");
      }

      toast.success("Property deleted successfully!");
      setIsDeleteOpen(false);
      setSelectedProperty(null);
      fetchProperties();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete property");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (property: Property) => {
    setSelectedProperty(property);
    setFormData({
      image: property.image,
      price: property.price,
      priceValue: property.priceValue.toString(),
      title: property.title,
      location: property.location,
      beds: property.beds.toString(),
      baths: property.baths.toString(),
      sqft: property.sqft.toString(),
      availableFor: property.availableFor,
      description: property.description || "",
      amenities: property.amenities ? property.amenities.join(", ") : "",
      gallery: property.gallery ? property.gallery.join(", ") : "",
      categories: property.categories || "",
    });
    setIsEditOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteOpen(true);
  };

  return (
    <section className="py-24 min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Manage property listings
            </p>
          </div>
          <Button
            onClick={() => {
              setFormData(initialFormData);
              setIsCreateOpen(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Properties Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first property
            </p>
            <Button
              onClick={() => {
                setFormData(initialFormData);
                setIsCreateOpen(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-20 h-20 object-cover rounded-lg bg-gray-200"
                          />
                          <div>
                            <div className="font-bold text-gray-900">{property.title}</div>
                            <div className="text-sm text-gray-500">ID: {property.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{property.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-blue-600">{property.price}</div>
                        <div className="text-xs text-gray-500">
                          ₹{property.priceValue.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>🛏️ {property.beds} Beds</div>
                          <div>🚿 {property.baths} Baths</div>
                          <div>📏 {property.sqft} sqft</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          property.availableFor === "buy" 
                            ? "bg-green-100 text-green-800"
                            : property.availableFor === "rent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {property.availableFor}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(property)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(property)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new property listing
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-2">Main Image URL</label>
                <Input
                  required
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Property Title</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Luxury 3BHK Apartment"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Location</label>
                <Input
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Whitefield, Bangalore"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Display Price</label>
                <Input
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="₹1.2 Cr"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price Value (₹)</label>
                <Input
                  required
                  type="number"
                  value={formData.priceValue}
                  onChange={(e) => setFormData({ ...formData, priceValue: e.target.value })}
                  placeholder="12000000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Bedrooms</label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.beds}
                  onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Bathrooms</label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.baths}
                  onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                  placeholder="2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Square Feet</label>
                <Input
                  required
                  type="number"
                  min="100"
                  value={formData.sqft}
                  onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                  placeholder="1850"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Available For</label>
                <select
                  required
                  value={formData.availableFor}
                  onChange={(e) => setFormData({ ...formData, availableFor: e.target.value as "buy" | "rent" | "both" })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                  <option value="both">Both (Buy & Rent)</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A stunning luxury apartment in the heart of Whitefield..."
                  rows={4}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Amenities <span className="text-xs text-gray-500">(comma-separated)</span>
                </label>
                <Textarea
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="Swimming Pool, Gym, Power Backup, Parking, Security 24/7"
                  rows={2}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Gallery Images <span className="text-xs text-gray-500">(comma-separated URLs)</span>
                </label>
                <Textarea
                  value={formData.gallery}
                  onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..."
                  rows={2}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Categories/Keywords <span className="text-xs text-gray-500">(comma-separated)</span>
                </label>
                <Input
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                  placeholder="luxury, apartment, bangalore, whitefield, 3bhk"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={submitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Property
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>
              Update the property details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-2">Main Image URL</label>
                <Input
                  required
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Property Title</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Luxury 3BHK Apartment"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Location</label>
                <Input
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Whitefield, Bangalore"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Display Price</label>
                <Input
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="₹1.2 Cr"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price Value (₹)</label>
                <Input
                  required
                  type="number"
                  value={formData.priceValue}
                  onChange={(e) => setFormData({ ...formData, priceValue: e.target.value })}
                  placeholder="12000000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Bedrooms</label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.beds}
                  onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Bathrooms</label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.baths}
                  onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                  placeholder="2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Square Feet</label>
                <Input
                  required
                  type="number"
                  min="100"
                  value={formData.sqft}
                  onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                  placeholder="1850"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Available For</label>
                <select
                  required
                  value={formData.availableFor}
                  onChange={(e) => setFormData({ ...formData, availableFor: e.target.value as "buy" | "rent" | "both" })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                  <option value="both">Both (Buy & Rent)</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A stunning luxury apartment in the heart of Whitefield..."
                  rows={4}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Amenities <span className="text-xs text-gray-500">(comma-separated)</span>
                </label>
                <Textarea
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="Swimming Pool, Gym, Power Backup, Parking, Security 24/7"
                  rows={2}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Gallery Images <span className="text-xs text-gray-500">(comma-separated URLs)</span>
                </label>
                <Textarea
                  value={formData.gallery}
                  onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..."
                  rows={2}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Categories/Keywords <span className="text-xs text-gray-500">(comma-separated)</span>
                </label>
                <Input
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                  placeholder="luxury, apartment, bangalore, whitefield, 3bhk"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={submitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Update Property
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <div className="my-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <div className="font-bold text-gray-900">{selectedProperty.title}</div>
                  <div className="text-sm text-gray-600">{selectedProperty.location}</div>
                  <div className="text-sm font-semibold text-blue-600">{selectedProperty.price}</div>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={submitting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Property
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}