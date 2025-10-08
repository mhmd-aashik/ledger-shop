"use client";

import { Suspense, ReactNode } from "react";
import Loading, { SkeletonGrid, SkeletonCard } from "./Loading";
import ErrorBoundary from "./ErrorBoundary";

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  type?: "default" | "products" | "cart" | "favorites" | "profile" | "page";
  count?: number;
  className?: string;
}

export default function SuspenseWrapper({
  children,
  fallback,
  errorFallback,
  type = "default",
  count = 3,
  className = "",
}: SuspenseWrapperProps) {
  const getDefaultFallback = () => {
    switch (type) {
      case "products":
        return <SkeletonGrid count={count} />;
      case "cart":
        return <Loading type="cart" />;
      case "favorites":
        return <Loading type="favorites" />;
      case "profile":
        return <Loading type="profile" />;
      case "page":
        return <Loading type="page" />;
      default:
        return <SkeletonCard />;
    }
  };

  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback || getDefaultFallback()}>
        <div className={className}>{children}</div>
      </Suspense>
    </ErrorBoundary>
  );
}

// Specialized wrappers for different use cases
export function ProductSuspense({
  children,
  count = 8,
  className = "",
}: {
  children: ReactNode;
  count?: number;
  className?: string;
}) {
  return (
    <SuspenseWrapper type="products" count={count} className={className}>
      {children}
    </SuspenseWrapper>
  );
}

export function CartSuspense({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <SuspenseWrapper type="cart" className={className}>
      {children}
    </SuspenseWrapper>
  );
}

export function FavoritesSuspense({
  children,
  count = 6,
  className = "",
}: {
  children: ReactNode;
  count?: number;
  className?: string;
}) {
  return (
    <SuspenseWrapper type="favorites" count={count} className={className}>
      {children}
    </SuspenseWrapper>
  );
}

export function ProfileSuspense({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <SuspenseWrapper type="profile" className={className}>
      {children}
    </SuspenseWrapper>
  );
}

export function PageSuspense({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <SuspenseWrapper type="page" className={className}>
      {children}
    </SuspenseWrapper>
  );
}
