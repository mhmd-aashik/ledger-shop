"use client";

import { Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyReviewsStateProps {
  action?: string;
}

export default function EmptyReviewsState({ action }: EmptyReviewsStateProps) {
  // Suppress unused parameter warning
  void action;
  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

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
