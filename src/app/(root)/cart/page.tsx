import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCartItems, CartItem } from "@/lib/actions/cart.action";
import CartClient from "@/components/cart/CartClient";

export default async function Cart() {
  // Get current user from Clerk
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Load cart items from database
  let items: CartItem[] = [];

  try {
    const result = await getCartItems();
    if (result.success) {
      items = result.items || [];
    }
  } catch (error) {
    console.error("Error loading cart items:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Shopping Cart
            </h1>
          </div>

          <CartClient initialItems={items} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
