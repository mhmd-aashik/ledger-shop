import Link from "next/link";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
}

export default function OrderSummary({
  subtotal,
  shipping,
  total,
}: OrderSummaryProps) {
  return (
    <div className="lg:col-span-1">
      <div className="leather-card rounded-xl p-6 sticky top-24">
        <h2 className="text-xl font-serif font-semibold text-foreground mb-6">
          Order Summary
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{subtotal} LKR</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? "Free" : `${shipping} LKR`}
            </span>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-muted-foreground">
              Free shipping on orders over 500 LKR
            </p>
          )}
          <div className="border-t border-border pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{total} LKR</span>
            </div>
          </div>
        </div>

        <Link href="/checkout">
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-6 rounded-lg font-medium transition-colors duration-200 mb-4">
            Proceed to Checkout
          </button>
        </Link>

        <p className="text-xs text-muted-foreground text-center">
          Secure checkout with SSL encryption
        </p>
      </div>
    </div>
  );
}
