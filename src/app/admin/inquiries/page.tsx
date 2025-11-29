"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Check, X, Mail, Phone, Calendar, Home, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface BuyInquiry {
  id: number;
  propertyId: number;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
  createdAt: string;
}

interface RentInquiry {
  id: number;
  propertyId: number;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  moveInDate: string;
  message: string;
  createdAt: string;
}

interface ListingSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  location: string;
  price: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [buyInquiries, setBuyInquiries] = useState<BuyInquiry[]>([]);
  const [rentInquiries, setRentInquiries] = useState<RentInquiry[]>([]);
  const [listingSubmissions, setListingSubmissions] = useState<ListingSubmission[]>([]);
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);

  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "buy" | "rent" | "listing" | "contact" | null;
    id: number | null;
  }>({ open: false, type: null, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if already authenticated in session
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_inquiries_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  // Handle passphrase submission
  const handlePassphraseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded passphrase - you can change this to your desired passphrase
    const CORRECT_PASSPHRASE = "brock2024";
    
    if (passphrase === CORRECT_PASSPHRASE) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_inquiries_auth", "true");
      toast.success("Access granted");
    } else {
      toast.error("Incorrect passphrase");
      setPassphrase("");
    }
  };

  // Fetch all inquiries
  const fetchAllInquiries = async () => {
    try {
      setLoading(true);
      const [buyRes, rentRes, listingRes, contactRes] = await Promise.all([
        fetch("/api/buy-inquiries"),
        fetch("/api/rent-inquiries"),
        fetch("/api/listing-submissions"),
        fetch("/api/contact-inquiries"),
      ]);

      if (buyRes.ok) setBuyInquiries(await buyRes.json());
      if (rentRes.ok) setRentInquiries(await rentRes.json());
      if (listingRes.ok) setListingSubmissions(await listingRes.json());
      if (contactRes.ok) setContactInquiries(await contactRes.json());
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllInquiries();
    }
  }, [isAuthenticated]);

  // Delete inquiry
  const handleDelete = async () => {
    if (!deleteDialog.type || !deleteDialog.id) return;

    setIsDeleting(true);
    try {
      const endpoints = {
        buy: `/api/buy-inquiries/${deleteDialog.id}`,
        rent: `/api/rent-inquiries/${deleteDialog.id}`,
        listing: `/api/listing-submissions/${deleteDialog.id}`,
        contact: `/api/contact-inquiries/${deleteDialog.id}`,
      };

      const response = await fetch(endpoints[deleteDialog.type], {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Inquiry deleted successfully");
      setDeleteDialog({ open: false, type: null, id: null });
      fetchAllInquiries();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete inquiry");
    } finally {
      setIsDeleting(false);
    }
  };

  // Update listing status
  const updateListingStatus = async (id: number, status: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/listing-submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success(`Listing ${status}`);
      fetchAllInquiries();
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Passphrase Protection Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Secure Access Required
            </h1>
            <p className="text-gray-600">
              Enter the passphrase to access confidential customer inquiries
            </p>
          </div>

          <form onSubmit={handlePassphraseSubmit} className="space-y-6">
            <div>
              <label htmlFor="passphrase" className="block text-sm font-semibold text-gray-900 mb-2">
                Passphrase
              </label>
              <input
                id="passphrase"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter passphrase"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
            >
              Access Inquiries
            </button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              <strong>⚠️ Restricted Area:</strong> This page contains confidential customer information. 
              Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 lg:px-20 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Inquiries Management
        </h1>
        <p className="text-gray-600">
          View and manage all customer inquiries and submissions
        </p>
      </div>

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="buy">
            Buy ({buyInquiries.length})
          </TabsTrigger>
          <TabsTrigger value="rent">
            Rent ({rentInquiries.length})
          </TabsTrigger>
          <TabsTrigger value="listings">
            Listings ({listingSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="contact">
            Contact ({contactInquiries.length})
          </TabsTrigger>
        </TabsList>

        {/* Buy Inquiries */}
        <TabsContent value="buy">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {buyInquiries.length === 0 ? (
              <div className="p-12 text-center">
                <Home className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No buy inquiries yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Property</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Budget</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Message</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {buyInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{inquiry.propertyTitle}</div>
                          <div className="text-sm text-gray-500">ID: {inquiry.propertyId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{inquiry.name}</div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Mail className="w-3 h-3" />
                              {inquiry.email}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Phone className="w-3 h-3" />
                              {inquiry.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {inquiry.budget}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {inquiry.message || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(inquiry.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteDialog({ open: true, type: "buy", id: inquiry.id })
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Rent Inquiries */}
        <TabsContent value="rent">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {rentInquiries.length === 0 ? (
              <div className="p-12 text-center">
                <Home className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No rent inquiries yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Property</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Move-in Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Message</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rentInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{inquiry.propertyTitle}</div>
                          <div className="text-sm text-gray-500">ID: {inquiry.propertyId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{inquiry.name}</div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Mail className="w-3 h-3" />
                              {inquiry.email}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Phone className="w-3 h-3" />
                              {inquiry.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-900">
                            <Calendar className="w-4 h-4" />
                            {new Date(inquiry.moveInDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {inquiry.message || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(inquiry.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteDialog({ open: true, type: "rent", id: inquiry.id })
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Listing Submissions */}
        <TabsContent value="listings">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {listingSubmissions.length === 0 ? (
              <div className="p-12 text-center">
                <Home className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No listing submissions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Property</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {listingSubmissions.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{listing.propertyType}</div>
                          <div className="text-sm text-gray-500">📍 {listing.location}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{listing.name}</div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Mail className="w-3 h-3" />
                              {listing.email}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Phone className="w-3 h-3" />
                              {listing.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {listing.price}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {listing.description}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              listing.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : listing.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {listing.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(listing.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {listing.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateListingStatus(listing.id, "approved")}
                                  title="Approve"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateListingStatus(listing.id, "rejected")}
                                  title="Reject"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteDialog({ open: true, type: "listing", id: listing.id })
                              }
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Contact Inquiries */}
        <TabsContent value="contact">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {contactInquiries.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No contact inquiries yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Message</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contactInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{inquiry.name}</div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Mail className="w-3 h-3" />
                              {inquiry.email}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Phone className="w-3 h-3" />
                              {inquiry.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                          {inquiry.message}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(inquiry.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteDialog({ open: true, type: "contact", id: inquiry.id })
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => !isDeleting && setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Inquiry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this inquiry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, type: null, id: null })}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}