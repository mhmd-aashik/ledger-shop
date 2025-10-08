"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  thumbnail?: string | null;
  images: string[];
  category: {
    name: string;
  };
  description: string;
  shortDescription?: string | null;
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function MoreProductsGrid() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        const search = searchParams.get("search");
        const category = searchParams.get("category");
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "12";

        if (search) params.append("search", search);
        if (category && category !== "All") params.append("category", category);
        params.append("page", page);
        params.append("limit", limit);

        const response = await fetch(
          `/api/public/products?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: ProductsResponse = await response.json();
        setProducts(data.products);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Filter and sort products based on search params
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Gender filter (if you want to add this feature)
    const gender = searchParams.get("gender");
    if (gender && gender !== "All") {
      // For now, we'll skip gender filtering since it's not in the database schema
      // You can add a gender field to your Product model if needed
    }

    // Price range filter
    const minPrice = parseInt(searchParams.get("minPrice") || "0") || 0;
    const maxPrice = parseInt(searchParams.get("maxPrice") || "2000") || 2000;
    filtered = filtered.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    // Sort products
    const sortBy = searchParams.get("sort") || "default";
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // Default sorting - keep original order
        break;
    }

    return filtered;
  }, [searchParams, products]);

  if (loading) {
    return (
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
              Error Loading Products
            </h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Product Grid - Show filtered products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={
                    product.thumbnail ||
                    product.images[0] ||
                    "/assets/images/leather1.jpg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                {/* Featured Badge */}
                {product.isFeatured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                    Featured
                  </div>
                )}
                {/* Compare Price Badge */}
                {product.compareAtPrice &&
                  product.compareAtPrice > product.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Sale
                    </div>
                  )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    {product.category.name}
                  </span>
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.shortDescription || product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-foreground">
                      LKR {product.price.toLocaleString()}
                    </span>
                    {product.compareAtPrice &&
                      product.compareAtPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          LKR {product.compareAtPrice.toLocaleString()}
                        </span>
                      )}
                  </div>
                  <Link
                    href={`/products/${product.slug || product.id}`}
                    className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
              No products found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => (window.location.href = "/products")}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Stats Section */}
        {filteredProducts.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {filteredProducts.length}
              </h3>
              <p className="text-muted-foreground">Filtered Products</p>
            </div>
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {new Set(products.map((p) => p.category.name)).size}
              </h3>
              <p className="text-muted-foreground">Categories</p>
            </div>
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">100%</h3>
              <p className="text-muted-foreground">Handcrafted</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
