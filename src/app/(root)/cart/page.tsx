import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCartItems } from "@/lib/actions/cart.action";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CartClient from "@/components/cart/CartClient";

export default async function Cart() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  try {
    // Get user's cart items from database
    const result = await getCartItems();

    if (!result.success) {
      console.error("Error loading cart:", result.error);
      // Still show the page but with empty cart
      return (
        <div className="min-h-screen bg-background">
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

              <CartClient initialItems={[]} />
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

            <CartClient initialItems={result.items || []} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading cart:", error);
    redirect("/sign-in");
  }
}
