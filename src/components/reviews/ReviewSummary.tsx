"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  showBadge?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ReviewSummary({
  averageRating,
  totalReviews,
  showBadge = true,
  size = "md",
}: ReviewSummaryProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const starSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  if (totalReviews === 0) {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`${starSizeClasses[size]} text-gray-300`}
            />
          ))}
        </div>
        <span className={`${sizeClasses[size]} text-muted-foreground`}>
          No reviews yet
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${starSizeClasses[size]} ${
              i < Math.floor(averageRating)
                ? "text-yellow-400 fill-current"
                : i < averageRating
                  ? "text-yellow-400 fill-current opacity-50"
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className={`${sizeClasses[size]} font-medium`}>
        {averageRating.toFixed(1)}
      </span>
      {showBadge && (
        <Badge variant="secondary" className="text-xs">
          {totalReviews} review{totalReviews !== 1 ? "s" : ""}
        </Badge>
      )}
    </div>
  );
}
