import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import ProductDetailClient from "./ProductDetailClient";
import ProductReviews from "./reviews/ProductReviews";
import { ProductItem } from "../../types/products.types";

interface ProductDetailServerProps {
  product: ProductItem;
}

export default function ProductDetailServer({
  product,
}: ProductDetailServerProps) {
  return (
    <main className="pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images - Client Component */}
          <ProductDetailClient product={product} />

          {/* Product Info - Server Rendered */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="mb-2">
                <span className="text-sm text-muted-foreground uppercase tracking-wide">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "text-accent fill-current"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="text-3xl font-bold text-foreground mb-6">
                {product.price} LKR
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stock Status */}
            <div>
              {product.inStock ? (
                <p className="text-sm text-green-600 flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />
                  In Stock - Ready to ship
                </p>
              ) : (
                <p className="text-sm text-red-600 flex items-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2" />
                  Out of Stock
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews
            productId={product.id}
            productName={product.name}
            showReviewForm={true}
          />
        </div>
      </div>
    </main>
  );
}
