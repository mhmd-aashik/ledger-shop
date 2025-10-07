import { ShoppingBag, Heart, User, Sparkles, Loader2 } from "lucide-react";

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
        return <ShoppingBag className="w-8 h-8 text-amber-600" />;
      case "favorites":
        return <Heart className="w-8 h-8 text-red-500" />;
      case "profile":
        return <User className="w-8 h-8 text-amber-600" />;
      default:
        return <Sparkles className="w-8 h-8 text-amber-600" />;
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
    <div className="flex flex-col items-center justify-center min-h-[400px] py-16">
      {/* Modern Loading Animation */}
      <div className="relative mb-8">
        {/* Outer rotating ring */}
        <div className="w-20 h-20 border-4 border-amber-200 rounded-full animate-spin border-t-amber-600"></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full animate-pulse"></div>

        {/* Icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-bounce">{getIcon()}</div>
        </div>

        {/* Floating dots */}
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-amber-500 rounded-full animate-ping"></div>
        <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-amber-400 rounded-full animate-ping animation-delay-200"></div>
      </div>

      {/* Modern Message */}
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 animate-pulse">
          {message || getDefaultMessage()}
        </h3>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce animation-delay-100"></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce animation-delay-200"></div>
        </div>
        <p className="text-sm text-gray-600 max-w-md">
          Crafting your perfect experience with premium leather goods
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

// Modern Skeleton loading components
export function SkeletonCard() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-amber-200/50 rounded-2xl p-6 shadow-lg animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg w-3/4"></div>
          <div className="h-3 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg w-1/2"></div>
          <div className="h-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg w-1/4"></div>
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
          className="bg-white/80 backdrop-blur-sm border border-amber-200/50 rounded-2xl overflow-hidden shadow-lg animate-pulse"
        >
          <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200"></div>
          <div className="p-6 space-y-3">
            <div className="h-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg w-3/4"></div>
            <div className="h-3 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg w-1/2"></div>
            <div className="h-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Modern shimmer effect
export function ShimmerCard() {
  return (
    <div className="bg-white/90 backdrop-blur-sm border border-amber-200/50 rounded-2xl p-6 shadow-lg overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"></div>
      <div className="flex items-center space-x-4 relative z-10">
        <div className="w-24 h-24 bg-amber-100 rounded-xl"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-amber-200 rounded-lg w-3/4"></div>
          <div className="h-3 bg-amber-200 rounded-lg w-1/2"></div>
          <div className="h-4 bg-amber-200 rounded-lg w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
