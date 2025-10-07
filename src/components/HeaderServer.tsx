import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getCartItems } from "@/lib/actions/cart.action";
import { getFavoriteProducts } from "@/lib/actions/favorite.action";
import { CountProvider } from "./CountProvider";
import HeaderClient from "./HeaderClient";

export default async function HeaderServer() {
  let session = null;
  let initialCartCount = 0;
  let initialFavoritesCount = 0;

  try {
    // Get current user from Auth.js with error handling
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Session error (likely JWT decryption issue):", error);
    // Continue without session - user will need to sign in again
  }

  if (session?.user) {
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
