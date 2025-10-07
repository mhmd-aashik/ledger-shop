import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/lib/actions/cart.action";

interface CartItemsProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartItems({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemsProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {items.map((item) => (
        <div key={item.id} className="leather-card rounded-xl p-6 relative">
          <div className="flex items-center space-x-4">
            {/* Product Image */}
            <div className="w-24 h-24 relative overflow-hidden rounded-lg flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-serif font-semibold text-foreground mb-1">
                {item.name}
              </h3>
              {item.color && (
                <p className="text-sm text-muted-foreground mb-2">
                  Color: {item.color}
                </p>
              )}
              <p className="text-xl font-bold text-foreground">
                {item.price} LKR
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors duration-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemoveItem(item.id)}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors duration-200"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
