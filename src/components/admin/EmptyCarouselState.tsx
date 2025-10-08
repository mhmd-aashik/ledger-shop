"use client";

import { ImageIcon, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CarouselClient from "./CarouselClient";

interface EmptyCarouselStateProps {
  action?: string;
}

export default function EmptyCarouselState({
  action,
}: EmptyCarouselStateProps) {
  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // If action=create, render CarouselClient with empty data to show the modal
  if (action === "create") {
    return <CarouselClient initialSlides={[]} action="create" />;
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
          No carousel slides found
        </h3>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find any carousel slides in the database. This might
          be because the database is temporarily unavailable or no carousel
          slides have been added yet.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin/carousel?action=create"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Slide
          </Link>
          <Button
            variant="outline"
            onClick={handleRetry}
            className="flex items-center gap-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
