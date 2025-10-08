import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home, Search } from "lucide-react";
import Link from "next/link";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  showSearchButton?: boolean;
  className?: string;
}

export default function ErrorDisplay({
  error,
  onRetry,
  showHomeButton = false,
  showSearchButton = false,
  className = "",
}: ErrorDisplayProps) {
  // Map technical errors to user-friendly messages
  const getFriendlyMessage = (error: string) => {
    if (error.includes("500")) {
      return "We're experiencing some technical difficulties. Our team has been notified and we're working to fix this.";
    }
    if (error.includes("404")) {
      return "The page or product you're looking for doesn't exist.";
    }
    if (error.includes("401") || error.includes("Unauthorized")) {
      return "Please sign in to access this content.";
    }
    if (error.includes("Failed to fetch")) {
      return "Unable to connect to our servers. Please check your internet connection and try again.";
    }
    if (error.includes("timeout")) {
      return "The request is taking longer than expected. Please try again.";
    }
    return "Something went wrong. Please try again or contact support if the problem persists.";
  };

  const friendlyMessage = getFriendlyMessage(error);

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-center">
            {friendlyMessage}
          </AlertDescription>
        </Alert>

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

          {showHomeButton && (
            <Button asChild variant="default">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          )}

          {showSearchButton && (
            <Button asChild variant="outline">
              <Link href="/products" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          )}
        </div>

        {/* Additional help text */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            If this problem continues, please{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
