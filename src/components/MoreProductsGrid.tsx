"use client";

import { products } from "@/data/products";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function MoreProductsGrid() {
  const searchParams = useSearchParams();

  // Duplicate products to show more items
  const allProducts = [
    ...products,
    ...products.map((product, index) => ({
      ...product,
      id: `${product.id}-duplicate-${index + 1}`,
      name: `${product.name} - Premium Edition`,
      price: Math.round(product.price * 1.2), // 20% more expensive
      gender: "Unisex", // Add gender field
    })),
    ...products.map((product, index) => ({
      ...product,
      id: `${product.id}-limited-${index + 1}`,
      name: `${product.name} - Limited Edition`,
      price: Math.round(product.price * 1.5), // 50% more expensive
      gender: "Unisex", // Add gender field
    })),
  ];

  // Add gender to original products
  const productsWithGender = allProducts.map((product) => ({
    ...product,
    gender: product.gender || (Math.random() > 0.5 ? "Men" : "Women"),
  }));

  // Filter and sort products based on search params
  const filteredProducts = useMemo(() => {
    let filtered = productsWithGender;

    // Search filter
    const search = searchParams.get("search");
    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    const category = searchParams.get("category");
    if (category && category !== "All") {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Gender filter
    const gender = searchParams.get("gender");
    if (gender && gender !== "All") {
      filtered = filtered.filter((product) => product.gender === gender);
    }

    // Price range filter
    const minPrice = parseInt(searchParams.get("minPrice")) || 0;
    const maxPrice = parseInt(searchParams.get("maxPrice")) || 2000;
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
        // For demo purposes, we'll sort by ID (newer products have higher IDs)
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        // Default sorting - keep original order
        break;
    }

    return filtered;
  }, [searchParams, productsWithGender]);

  return (
    <section className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {productsWithGender.length}{" "}
            products
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
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                {/* Edition Badge */}
                {product.name.includes("Premium") && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold max-w-[80px] truncate">
                    Premium
                  </div>
                )}
                {product.name.includes("Limited") && (
                  <div className="absolute top-2 right-2 bg-red-500 text-red-900 px-2 py-1 rounded-full text-xs font-bold max-w-[80px] truncate">
                    Limited
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-foreground">
                    ${product.price}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
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
              <h3 className="text-2xl font-bold text-foreground mb-2">3</h3>
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
