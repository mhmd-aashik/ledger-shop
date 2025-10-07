import { currentUser } from "@clerk/nextjs/server";
import { getCartItems } from "@/lib/actions/cart.action";
import { getFavoriteProducts } from "@/lib/actions/favorite.action";
import { CountProvider } from "./CountProvider";
import HeaderClient from "./HeaderClient";

export default async function HeaderServer() {
  // Get current user from Clerk
  const clerkUser = await currentUser();

  let initialCartCount = 0;
  let initialFavoritesCount = 0;

  if (clerkUser) {
    try {
      // Load cart count
      const cartResult = await getCartItems();
      if (cartResult.success) {
        initialCartCount = cartResult.items?.length || 0;
      }

      // Load favorites count
      const favoritesResult = await getFavoriteProducts();
      if (favoritesResult.success) {
        initialFavoritesCount = favoritesResult.favorites?.length || 0;
      }
    } catch (error) {
      console.error("Error loading initial counts:", error);
    }
  }

  return (
    <CountProvider
      initialCartCount={initialCartCount}
      initialFavoritesCount={initialFavoritesCount}
    >
      <HeaderClient />
    </CountProvider>
  );
}
