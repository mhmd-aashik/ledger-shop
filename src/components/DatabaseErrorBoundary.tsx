"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface DatabaseErrorBoundaryProps {
  error?: string;
  onRetry?: () => void;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function DatabaseErrorBoundary({
  error,
  onRetry,
  children,
  fallback,
}: DatabaseErrorBoundaryProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (error && (error.includes("connection") || error.includes("database"))) {
      setShowError(true);
    }
  }, [error]);

  // If there's a database error, show the error UI
  if (showError && error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-center">
              {getUserFriendlyMessage(error, isOnline)}
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button
                variant="outline"
                onClick={() => {
                  setShowError(false);
                  onRetry();
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </Button>
          </div>

          {/* Connection status indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span>You're online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span>You're offline</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If there's a fallback and an error, show fallback
  if (fallback && error) {
    return <>{fallback}</>;
  }

  // Otherwise, show children
  return <>{children}</>;
}

function getUserFriendlyMessage(error: string, isOnline: boolean): string {
  if (!isOnline) {
    return "You're currently offline. Please check your internet connection and try again.";
  }

  if (error.includes("connection") || error.includes("timeout")) {
    return "Unable to connect to our servers. Please check your internet connection and try again.";
  }

  if (error.includes("database")) {
    return "We're experiencing some technical difficulties with our database. Our team has been notified and we're working to fix this.";
  }

  if (error.includes("permission") || error.includes("access")) {
    return "Access denied. Please check your permissions or try signing in again.";
  }

  return "Something went wrong. Please try again or contact support if the problem persists.";
}
