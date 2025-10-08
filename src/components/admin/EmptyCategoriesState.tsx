"use client";

import { FolderOpen, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyCategoriesStateProps {
  action?: string;
}

export default function EmptyCategoriesState({
  action,
}: EmptyCategoriesStateProps) {
  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // If action=create, render CategoriesClient with empty data to show the modal
  if (action === "create") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Category Management
            </h1>
            <p className="text-gray-600">
              Organize your products into categories
            </p>
          </div>
          <Button onClick={() => {}}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
              No categories found
            </h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any categories in the database. This might be
              because the database is temporarily unavailable or no categories
              have been added yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/admin/categories?action=create"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Your First Category
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
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
          No categories found
        </h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find any categories in the database. This might be because
          the database is temporarily unavailable or no categories have been
          added yet.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin/categories?action=create"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Category
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
