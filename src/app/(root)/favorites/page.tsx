import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getFavoriteProducts } from "@/lib/actions/favorite.action";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FavoritesClient from "@/components/favorites/FavoritesClient";
import { FavoritesSuspense } from "@/components/SuspenseWrapper";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  try {
    // Get user's favorite products from database
    const result = await getFavoriteProducts();

    if (!result.success) {
      console.error("Error loading favorites:", result.error);
      // Still show the page but with empty favorites
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

              <FavoritesSuspense>
                <FavoritesClient initialFavorites={[]} />
              </FavoritesSuspense>
            </div>
          </main>
        </div>
      );
    }

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

            <FavoritesSuspense>
              <FavoritesClient initialFavorites={result.favorites || []} />
            </FavoritesSuspense>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading favorites:", error);
    redirect("/sign-in");
  }
}
