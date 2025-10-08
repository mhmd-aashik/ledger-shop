"use client";

import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductsClient from "./ProductsClient";

interface EmptyProductsStateProps {
  action?: string;
}

export default function EmptyProductsState({
  action,
}: EmptyProductsStateProps) {
  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // If action=create, render ProductsClient with empty data to show the modal
  if (action === "create") {
    return (
      <ProductsClient
        initialProducts={[]}
        initialCategories={[]}
        action="create"
      />
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
          No products found
        </h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find any products in the database. This might be because
          the database is temporarily unavailable or no products have been added
          yet.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin/products?action=create"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Product
          </Link>
          <Button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-2 rounded-md hover:bg-secondary/90 transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
