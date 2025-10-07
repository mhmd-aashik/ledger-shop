import CheckoutClient from "./CheckoutClient";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutServer() {
  return (
    <main className="pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
            Checkout
          </h1>
        </div>

        {/* Client Component for Interactive Functionality */}
        <CheckoutClient />
      </div>
    </main>
  );
}
