"use client";

import { Star, MessageSquare, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  category: {
    name: string;
  };
}

interface EmptyReviewsStateProps {
  action?: string;
}

export default function EmptyReviewsState({ action }: EmptyReviewsStateProps) {
  // Suppress unused parameter warning
  void action;
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    rating: 0,
    title: "",
    comment: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // Search products
  const searchProducts = async (query: string) => {
    if (query.length < 2) {
      setProducts([]);
      return;
    }

    setLoadingProducts(true);
    try {
      const response = await fetch(
        `/api/products?search=${encodeURIComponent(query)}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 2) {
      searchProducts(value);
      setShowProductDropdown(true);
    } else {
      setProducts([]);
      setShowProductDropdown(false);
    }
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setFormData({ ...formData, productId: product.id });
    setSearchTerm(product.name);
    setShowProductDropdown(false);
  };

  // Clear product selection
  const handleClearProduct = () => {
    setSelectedProduct(null);
    setFormData({ ...formData, productId: "" });
    setSearchTerm("");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: formData.productId.trim(),
          rating: formData.rating,
          title: formData.title.trim() || undefined,
          comment: formData.comment.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create review");
      }

      toast.success("Review created successfully!");
      setFormData({
        productId: "",
        rating: 0,
        title: "",
        comment: "",
      });
      setSelectedProduct(null);
      setSearchTerm("");
      setShowAddForm(false);
      // Refresh the page to show the new review
      window.location.reload();
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create review"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showAddForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add a Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productSearch">Select Product *</Label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="productSearch"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Search for a product..."
                      className="pl-10 pr-10"
                      required
                    />
                    {selectedProduct && (
                      <button
                        type="button"
                        onClick={handleClearProduct}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Product Dropdown */}
                  {showProductDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {loadingProducts ? (
                        <div className="p-3 text-center text-gray-500">
                          Searching products...
                        </div>
                      ) : products.length > 0 ? (
                        products.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => handleProductSelect(product)}
                            className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center space-x-3">
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 object-cover rounded"
                                />
                              ) : (
                                <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">
                                    No Image
                                  </span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {product.name}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {product.category.name}
                                  </Badge>
                                  <span className="text-sm text-gray-500">
                                    ${product.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : searchTerm.length >= 2 ? (
                        <div className="p-3 text-center text-gray-500">
                          No products found
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Selected Product Display */}
                {selectedProduct && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center space-x-3">
                      {selectedProduct.images &&
                      selectedProduct.images.length > 0 ? (
                        <Image
                          src={selectedProduct.images[0]}
                          alt={selectedProduct.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 object-cover rounded"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900">
                          {selectedProduct.name}
                        </p>
                        <p className="text-xs text-green-700">
                          {selectedProduct.category.name} • $
                          {selectedProduct.price}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearProduct}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating *</Label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= formData.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.rating > 0 &&
                      `${formData.rating} star${formData.rating > 1 ? "s" : ""}`}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Review title..."
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comment *</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="Write your review..."
                  rows={4}
                  maxLength={1000}
                  required
                />
                <div className="text-sm text-gray-500 text-right">
                  {formData.comment.length}/1000 characters
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !selectedProduct ||
                    formData.rating === 0 ||
                    !formData.comment.trim()
                  }
                >
                  {isSubmitting ? "Creating..." : "Create Review"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <Star className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
          No reviews found
        </h3>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find any reviews in the database. This might be
          because the database is temporarily unavailable or no reviews have
          been submitted yet.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={handleRetry}
            className="flex items-center gap-2"
          >
            Try Again
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Review
          </Button>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Manage Products
          </Link>
        </div>
      </div>
    </div>
  );
}
