import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyFavorites() {
  return (
    <div className="text-center py-16">
      <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
        Your favorites list is empty
      </h1>
      <p className="text-muted-foreground mb-8">
        Start adding products you love to your favorites
      </p>
      <Link href="/products">
        <Button>Browse Products</Button>
      </Link>
    </div>
  );
}
