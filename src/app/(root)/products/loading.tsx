import { SkeletonGrid } from "@/components/Loading";

export default function ProductsPageLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-muted rounded w-1/3 mb-4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
          </div>

          {/* Products Grid Skeleton */}
          <SkeletonGrid count={6} />
        </div>
      </main>
    </div>
  );
}
