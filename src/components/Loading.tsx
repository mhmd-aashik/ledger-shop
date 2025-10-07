import { Loader2, ShoppingBag, Heart, User } from "lucide-react";

interface LoadingProps {
  type?: "default" | "cart" | "favorites" | "profile" | "page";
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function Loading({
  type = "default",
  message,
  size = "md",
}: LoadingProps) {
  const getIcon = () => {
    switch (type) {
      case "cart":
        return <ShoppingBag className="w-8 h-8 text-primary" />;
      case "favorites":
        return <Heart className="w-8 h-8 text-red-500" />;
      case "profile":
        return <User className="w-8 h-8 text-primary" />;
      default:
        return <Loader2 className="w-8 h-8 text-primary animate-spin" />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-6 h-6";
      case "lg":
        return "w-12 h-12";
      default:
        return "w-8 h-8";
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case "cart":
        return "Loading your cart...";
      case "favorites":
        return "Loading your favorites...";
      case "profile":
        return "Loading your profile...";
      case "page":
        return "Loading page...";
      default:
        return "Loading...";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        {/* Spinner */}
        <div className="animate-spin rounded-full border-4 border-muted border-t-primary w-12 h-12"></div>

        {/* Icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {type === "default" || type === "page" ? (
            <Loader2
              className={`${getSizeClasses()} text-primary animate-spin`}
            />
          ) : (
            <div className="animate-pulse">{getIcon()}</div>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {message || getDefaultMessage()}
        </h3>
        <p className="text-sm text-muted-foreground">
          Please wait while we load your data
        </p>
      </div>
    </div>
  );
}

// Specialized loading components for different contexts
export function CartLoading() {
  return <Loading type="cart" message="Loading your cart..." />;
}

export function FavoritesLoading() {
  return <Loading type="favorites" message="Loading your favorites..." />;
}

export function ProfileLoading() {
  return <Loading type="profile" message="Loading your profile..." />;
}

export function PageLoading() {
  return <Loading type="page" message="Loading page..." />;
}

// Inline loading component for buttons and small areas
export function InlineLoading({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        className={`${size === "sm" ? "w-4 h-4" : "w-6 h-6"} text-current animate-spin`}
      />
    </div>
  );
}

// Skeleton loading components
export function SkeletonCard() {
  return (
    <div className="leather-card rounded-xl p-6 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 bg-muted rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="leather-card rounded-xl overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-muted"></div>
          <div className="p-6 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
