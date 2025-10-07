import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FavoritesClient from "@/components/favorites/FavoritesClient";

export default function FavoritesPage() {
  // Temporarily disable server-side auth to fix React Context errors
  // Auth will be handled on client-side

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </div>

          <FavoritesClient initialFavorites={[]} />
        </div>
      </main>
    </div>
  );
}
