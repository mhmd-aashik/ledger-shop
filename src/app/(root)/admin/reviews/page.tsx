"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Star,
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  isPublic: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      userId: "user1",
      userName: "Sarah Johnson",
      userEmail: "sarah.johnson@email.com",
      productId: "prod1",
      productName: "Classic Leather Wallet",
      productImage: "/assets/images/leather1.jpg",
      rating: 5,
      title: "Absolutely perfect!",
      comment:
        "The quality is outstanding. The leather feels premium and the craftsmanship is excellent. Highly recommend!",
      isVerified: true,
      isPublic: true,
      helpful: 12,
      notHelpful: 1,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      userId: "user2",
      userName: "Mike Chen",
      userEmail: "mike.chen@email.com",
      productId: "prod2",
      productName: "Minimalist Cardholder",
      productImage: "/assets/images/leather2.jpg",
      rating: 4,
      title: "Great quality",
      comment:
        "Really like the minimalist design. Perfect for my needs. The leather quality is good.",
      isVerified: true,
      isPublic: true,
      helpful: 8,
      notHelpful: 0,
      createdAt: "2024-01-14T15:20:00Z",
      updatedAt: "2024-01-14T15:20:00Z",
    },
    {
      id: "3",
      userId: "user3",
      userName: "Emily Davis",
      userEmail: "emily.davis@email.com",
      productId: "prod3",
      productName: "Executive Briefcase",
      productImage: "/assets/images/leather3.jpg",
      rating: 2,
      title: "Not what I expected",
      comment:
        "The briefcase arrived with some scratches and the leather quality seems lower than advertised.",
      isVerified: false,
      isPublic: false,
      helpful: 2,
      notHelpful: 5,
      createdAt: "2024-01-13T09:45:00Z",
      updatedAt: "2024-01-13T09:45:00Z",
    },
    {
      id: "4",
      userId: "user4",
      userName: "David Wilson",
      userEmail: "david.wilson@email.com",
      productId: "prod4",
      productName: "Premium Watch Strap",
      productImage: "/assets/images/leather6.jpg",
      rating: 5,
      title: "Excellent craftsmanship",
      comment:
        "The attention to detail is amazing. The strap fits perfectly and looks great with my watch.",
      isVerified: true,
      isPublic: true,
      helpful: 15,
      notHelpful: 0,
      createdAt: "2024-01-12T14:10:00Z",
      updatedAt: "2024-01-12T14:10:00Z",
    },
    {
      id: "5",
      userId: "user5",
      userName: "Lisa Anderson",
      userEmail: "lisa.anderson@email.com",
      productId: "prod1",
      productName: "Classic Leather Wallet",
      productImage: "/assets/images/leather1.jpg",
      rating: 3,
      title: "Decent but overpriced",
      comment:
        "The wallet is nice but I think it's a bit expensive for what you get. Quality is good though.",
      isVerified: false,
      isPublic: true,
      helpful: 3,
      notHelpful: 2,
      createdAt: "2024-01-11T16:30:00Z",
      updatedAt: "2024-01-11T16:30:00Z",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      ratingFilter === "all" || review.rating.toString() === ratingFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && review.isVerified) ||
      (statusFilter === "unverified" && !review.isVerified) ||
      (statusFilter === "public" && review.isPublic) ||
      (statusFilter === "private" && !review.isPublic);
    return matchesSearch && matchesRating && matchesStatus;
  });

  const handleToggleVerified = (id: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === id
          ? { ...review, isVerified: !review.isVerified }
          : review
      )
    );
  };

  const handleTogglePublic = (id: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, isPublic: !review.isPublic } : review
      )
    );
  };

  const handleDeleteReview = (id: string) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsReviewDialogOpen(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const getStatusBadges = (review: Review) => {
    return (
      <div className="flex space-x-1">
        {review.isVerified && (
          <Badge variant="default" className="text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
        {!review.isPublic && (
          <Badge variant="secondary" className="text-xs">
            <XCircle className="h-3 w-3 mr-1" />
            Private
          </Badge>
        )}
      </div>
    );
  };

  const getAverageRating = () => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: reviews.filter((r) => r.rating === rating).length,
      percentage:
        (reviews.filter((r) => r.rating === rating).length / reviews.length) *
        100,
    }));
    return distribution;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
        <p className="text-gray-600">Manage customer reviews and ratings</p>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Average Rating
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {getAverageRating()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter((r) => r.isVerified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Public</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter((r) => r.isPublic).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getRatingDistribution().map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-8">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 w-12 text-right">
                  {count} ({percentage.toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({filteredReviews.length})</CardTitle>
          <CardDescription>Manage customer reviews and ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Review</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Helpful</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-900 truncate">
                          {review.title || "No title"}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {review.comment || "No comment"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Image
                          src={review.productImage}
                          alt={review.productName}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium">
                            {review.productName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {review.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {review.userEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell>{getStatusBadges(review)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-green-600">
                          <ThumbsUp className="h-3 w-3" />
                          <span className="text-xs">{review.helpful}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-red-600">
                          <ThumbsDown className="h-3 w-3" />
                          <span className="text-xs">{review.notHelpful}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewReview(review)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleVerified(review.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {review.isVerified ? "Unverify" : "Verify"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleTogglePublic(review.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {review.isPublic ? "Make Private" : "Make Public"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Review Details Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Complete review information and management options
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src={selectedReview.productImage}
                    alt={selectedReview.productName}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedReview.productName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {renderStars(selectedReview.rating)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {getStatusBadges(selectedReview)}
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h4 className="font-medium mb-2">Review Title</h4>
                <p className="text-gray-700 mb-4">
                  {selectedReview.title || "No title provided"}
                </p>

                <h4 className="font-medium mb-2">Review Comment</h4>
                <p className="text-gray-700 mb-4">
                  {selectedReview.comment || "No comment provided"}
                </p>
              </div>

              {/* Customer Information */}
              <div>
                <h4 className="font-medium mb-2">Customer Information</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">
                      {selectedReview.userName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {selectedReview.userEmail}
                    </span>
                  </div>
                </div>
              </div>

              {/* Helpfulness Stats */}
              <div>
                <h4 className="font-medium mb-2">Helpfulness</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-green-600">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{selectedReview.helpful} helpful</span>
                  </div>
                  <div className="flex items-center space-x-1 text-red-600">
                    <ThumbsDown className="h-4 w-4" />
                    <span>{selectedReview.notHelpful} not helpful</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleToggleVerified(selectedReview.id)}
                >
                  {selectedReview.isVerified ? "Unverify" : "Verify"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleTogglePublic(selectedReview.id)}
                >
                  {selectedReview.isPublic ? "Make Private" : "Make Public"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteReview(selectedReview.id);
                    setIsReviewDialogOpen(false);
                  }}
                >
                  Delete Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
