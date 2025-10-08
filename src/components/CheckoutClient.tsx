"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, CreditCard, User, MapPin } from "lucide-react";
import { getCartItems, clearCart, CartItem } from "@/lib/actions/cart.action";
import { getCurrentUser } from "@/lib/actions/user.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/use-analytics";

export default function CheckoutClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { trackPurchase } = useAnalytics();
  const [userProfile, setUserProfile] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  } | null>(null);

  // Load cart items from database
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const result = await getCartItems();
        if (result.success) {
          setItems(result.items || []);
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, []);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    notes: "",
  });

  // Load user profile data from database
  useEffect(() => {
    const loadUserProfile = async () => {
      if (status !== "authenticated" || !session?.user) return;

      try {
        const result = await getCurrentUser();
        if (result.success && "user" in result && result.user) {
          const dbUser = result.user;

          // Merge Auth.js data with database data
          const mergedProfile = {
            firstName:
              session?.user?.name?.split(" ")[0] || dbUser.firstName || "",
            lastName:
              session?.user?.name?.split(" ").slice(1).join(" ") ||
              dbUser.lastName ||
              "",
            email: session?.user?.email || dbUser.email || "",
            phone: dbUser.profile?.phone || "",
            address: dbUser.addresses?.[0]
              ? {
                  street: dbUser.addresses[0].address1 || "",
                  city: dbUser.addresses[0].city || "",
                  state: dbUser.addresses[0].state || "",
                  zipCode: dbUser.addresses[0].postalCode || "",
                  country: dbUser.addresses[0].country || "",
                }
              : {
                  street: "",
                  city: "",
                  state: "",
                  zipCode: "",
                  country: "",
                },
          };

          setUserProfile(mergedProfile);

          // Pre-populate form with user data
          setFormData((prev) => ({
            ...prev,
            customerName:
              `${mergedProfile.firstName} ${mergedProfile.lastName}`.trim() ||
              "",
            customerEmail: mergedProfile.email,
            customerPhone: mergedProfile.phone,
            customerAddress: mergedProfile.address.street
              ? `${mergedProfile.address.street}, ${mergedProfile.address.city}, ${mergedProfile.address.state} ${mergedProfile.address.zipCode}, ${mergedProfile.address.country}`.trim()
              : "",
          }));
        } else {
          // Fallback to Auth.js data only
          const authProfile = {
            firstName: session?.user?.name?.split(" ")[0] || "",
            lastName: session?.user?.name?.split(" ").slice(1).join(" ") || "",
            email: session?.user?.email || "",
            phone: "",
            address: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
          };

          setUserProfile(authProfile);

          setFormData((prev) => ({
            ...prev,
            customerName:
              `${authProfile.firstName} ${authProfile.lastName}`.trim() || "",
            customerEmail: authProfile.email,
            customerPhone: authProfile.phone,
            customerAddress: "",
          }));
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        // Fallback to Auth.js data only
        const authProfile = {
          firstName: session?.user?.name?.split(" ")[0] || "",
          lastName: session?.user?.name?.split(" ").slice(1).join(" ") || "",
          email: session?.user?.email || "",
          phone: "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
        };

        setUserProfile(authProfile);

        setFormData((prev) => ({
          ...prev,
          customerName:
            `${authProfile.firstName} ${authProfile.lastName}`.trim() || "",
          customerEmail: authProfile.email,
          customerPhone: authProfile.phone,
          customerAddress: "",
        }));
      }
    };

    loadUserProfile();
  }, [status, session]);

  const subtotal = items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.customerAddress
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        items: items.map((item: CartItem) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        shipping,
        total,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Track purchase event
        trackPurchase(
          result.orderId,
          total,
          items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }))
        );

        const clearResult = await clearCart();
        if (clearResult.success) {
          setItems([]);
          // Dispatch event to update header count
          window.dispatchEvent(new CustomEvent("cartUpdated"));
        }
        toast.success(
          "Order placed successfully! Check your email for confirmation."
        );
        router.push(`/checkout/success?orderId=${result.orderId}`);
      } else {
        throw new Error(result.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || status === "loading" || !userProfile) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
          Loading your cart...
        </h1>
        <p className="text-muted-foreground">
          Please wait while we load your items
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground mb-8">
          Add some items to your cart before checking out
        </p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <div className="leather-card rounded-xl p-6">
        <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Checkout Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="customerEmail">Email Address *</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="customerAddress">Delivery Address *</Label>
                  <Textarea
                    id="customerAddress"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your complete delivery address"
                    required
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for your order"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <CreditCard className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">
                    Payment Information
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    We&apos;ll contact you after order confirmation to arrange
                    payment and delivery details.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-6 rounded-lg font-medium transition-colors duration-200"
            >
              {isProcessing ? "Processing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="leather-card rounded-xl p-6">
        <h2 className="text-xl font-serif font-semibold text-foreground mb-6">
          Order Summary
        </h2>

        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{item.price * item.quantity} LKR</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-2">
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
          <div className="border-t border-border pt-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{total} LKR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
