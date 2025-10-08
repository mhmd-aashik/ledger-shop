"use client";

import { useState, useEffect } from "react";
import { Star, Edit, Trash2, Eye, EyeOff, Search, Filter } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  isPublic: boolean;
  createdAt: string;
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
  product: {
    name: string;
    images: string[];
  };
}

interface ReviewsClientProps {
  initialReviews: Review[];
  action?: string;
}

export default function ReviewsClient({
  initialReviews,
  action,
}: ReviewsClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filteredReviews, setFilteredReviews] =
    useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    rating: 0,
    title: "",
    comment: "",
    isPublic: true,
  });

  // Suppress unused parameter warning
  void action;

  useEffect(() => {
    let filtered = reviews;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(ratingFilter)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((review) =>
        statusFilter === "public" ? review.isPublic : !review.isPublic
      );
    }

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, ratingFilter, statusFilter]);

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setEditForm({
      rating: review.rating,
      title: review.title || "",
      comment: review.comment || "",
      isPublic: review.isPublic,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateReview = async () => {
    if (!selectedReview) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/reviews/${selectedReview.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update review");
      }

      const updatedReview = await response.json();
      setReviews((prev) =>
        prev.map((review) =>
          review.id === updatedReview.id ? updatedReview : review
        )
      );
      setIsEditDialogOpen(false);
      setSelectedReview(null);
      toast.success("Review updated successfully");
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update review"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete review");
      }

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete review"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (
    reviewId: string,
    isPublic: boolean
  ) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic: !isPublic }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update review visibility");
      }

      const updatedReview = await response.json();
      setReviews((prev) =>
        prev.map((review) =>
          review.id === updatedReview.id ? updatedReview : review
        )
      );
      toast.success(
        `Review ${!isPublic ? "published" : "hidden"} successfully`
      );
    } catch (error) {
      console.error("Error updating review visibility:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update review visibility"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Review Management
          </h1>
          <p className="text-gray-600">
            Manage customer reviews ({filteredReviews.length} of{" "}
            {reviews.length} reviews)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating-filter">Rating</Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4 stars</SelectItem>
                  <SelectItem value="3">3 stars</SelectItem>
                  <SelectItem value="2">2 stars</SelectItem>
                  <SelectItem value="1">1 star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {review.user.image ? (
                  <Image
                    src={review.user.image}
                    alt={review.user.name || "User"}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600">👤</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {review.user.name || "Anonymous"}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Badge
                        variant={review.isPublic ? "default" : "secondary"}
                      >
                        {review.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({review.rating}/5)
                    </span>
                  </div>

                  {review.title && (
                    <h4 className="font-medium text-gray-900 mb-1">
                      {review.title}
                    </h4>
                  )}

                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                    {review.comment}
                  </p>

                  <div className="text-xs text-gray-500 mb-3">
                    <div>Product: {review.product.name}</div>
                    <div>{new Date(review.createdAt).toLocaleDateString()}</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditReview(review)}
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleToggleVisibility(review.id, review.isPublic)
                      }
                      disabled={loading}
                    >
                      {review.isPublic ? (
                        <EyeOff className="h-4 w-4 mr-1" />
                      ) : (
                        <Eye className="h-4 w-4 mr-1" />
                      )}
                      {review.isPublic ? "Hide" : "Show"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">
            {searchTerm || ratingFilter !== "all" || statusFilter !== "all"
              ? "No reviews match your filters"
              : "No reviews found"}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-rating">Rating</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditForm({ ...editForm, rating: star })}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= editForm.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Review title..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-comment">Comment</Label>
              <Textarea
                id="edit-comment"
                value={editForm.comment}
                onChange={(e) =>
                  setEditForm({ ...editForm, comment: e.target.value })
                }
                placeholder="Review comment..."
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-public"
                checked={editForm.isPublic}
                onChange={(e) =>
                  setEditForm({ ...editForm, isPublic: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="edit-public">Public review</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateReview} disabled={loading}>
                {loading ? "Updating..." : "Update Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
