"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

interface ReviewStatsProps {
  productId: string;
}

export default function ReviewStats({ productId }: ReviewStatsProps) {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/public/reviews?productId=${productId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch review stats");
        }

        const data = await response.json();
        const reviews = data.reviews || [];

        if (reviews.length === 0) {
          setStats({
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: [],
          });
          return;
        }

        // Calculate average rating
        const totalRating = reviews.reduce(
          (sum: number, review: any) => sum + review.rating,
          0
        );
        const averageRating = totalRating / reviews.length;

        // Calculate rating distribution
        const distribution = [5, 4, 3, 2, 1].map((rating) => {
          const count = reviews.filter(
            (review: any) => review.rating === rating
          ).length;
          const percentage =
            reviews.length > 0 ? (count / reviews.length) * 100 : 0;
          return { rating, count, percentage };
        });

        setStats({
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: reviews.length,
          ratingDistribution: distribution,
        });
      } catch (error) {
        console.error("Error fetching review stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [productId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <div className="h-4 w-8 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-muted animate-pulse rounded" />
              <div className="h-2 w-24 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-2xl font-bold text-muted-foreground mb-1">0</div>
        <div className="text-sm text-muted-foreground">No reviews yet</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Rating */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-1 mb-2">
          <span className="text-3xl font-bold text-foreground">
            {stats.averageRating}
          </span>
          <div className="flex items-center">
            <Star className="h-6 w-6 text-yellow-400 fill-current" />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Based on {stats.totalReviews} review
          {stats.totalReviews !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {stats.ratingDistribution.map(({ rating, count, percentage }) => (
          <div key={rating} className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 w-8">
              <span className="text-sm font-medium">{rating}</span>
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
            </div>
            <Progress value={percentage} className="flex-1 h-2" />
            <span className="text-sm text-muted-foreground w-8 text-right">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
