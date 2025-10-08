import { Button } from "@/components/ui/button";
import { Package, Search, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showSearchButton?: boolean;
  showHomeButton?: boolean;
  onRetry?: () => void;
  className?: string;
}

export default function EmptyState({
  title = "No products found",
  description = "We couldn't find any products matching your criteria. Try adjusting your search or browse our collection.",
  showSearchButton = true,
  showHomeButton = true,
  onRetry,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>

        {/* Title and Description */}
        <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
          {title}
        </h3>
        <p className="text-muted-foreground mb-8">{description}</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}

          {showSearchButton && (
            <Button asChild variant="default">
              <Link href="/products" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse All Products
              </Link>
            </Button>
          )}

          {showHomeButton && (
            <Button asChild variant="outline">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          )}
        </div>

        {/* Additional help text */}
        <div className="mt-6 text-sm text-muted-foreground">
          <p>
            Need help?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
