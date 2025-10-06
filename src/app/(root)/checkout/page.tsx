"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, CreditCard, User, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

export default function Checkout() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("shipping");
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    billingAddress: "",
    paymentMethod: "cash_on_delivery",
    notes: "",
  });

  // Mock user data - in real app, this would come from authentication
  const [userProfile] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
  });

  // Load user data on component mount
  useEffect(() => {
    // In a real app, this would fetch from user profile
    setFormData((prev) => ({
      ...prev,
      customerName: `${userProfile.firstName} ${userProfile.lastName}`,
      customerEmail: userProfile.email,
      customerPhone: userProfile.phone,
      customerAddress: `${userProfile.address.street}, ${userProfile.address.city}, ${userProfile.address.state} ${userProfile.address.zipCode}, ${userProfile.address.country}`,
    }));
  }, [userProfile]);

  const subtotal = getTotalPrice();
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
        items: items.map((item) => ({
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
        clearCart();
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Link>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="leather-card rounded-xl p-6">
              <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Checkout Information
              </h2>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Shipping Information */}
                  <TabsContent value="shipping" className="space-y-4">
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
                          <Label htmlFor="customerAddress">
                            Delivery Address *
                          </Label>
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
                      </div>
                    </div>
                  </TabsContent>

                  {/* Billing Information */}
                  <TabsContent value="billing" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Billing Address
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="sameAsShipping"
                            className="rounded"
                            defaultChecked
                          />
                          <Label htmlFor="sameAsShipping">
                            Same as shipping address
                          </Label>
                        </div>

                        <div>
                          <Label htmlFor="billingAddress">
                            Billing Address
                          </Label>
                          <Textarea
                            id="billingAddress"
                            name="billingAddress"
                            value={formData.billingAddress}
                            onChange={handleInputChange}
                            placeholder="Enter your billing address (if different from shipping)"
                            className="mt-1 min-h-[100px]"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Payment Information */}
                  <TabsContent value="payment" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment Method
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 p-4 border rounded-lg">
                            <input
                              type="radio"
                              id="cashOnDelivery"
                              name="paymentMethod"
                              value="cash_on_delivery"
                              checked={
                                formData.paymentMethod === "cash_on_delivery"
                              }
                              onChange={handleInputChange}
                              className="text-primary"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor="cashOnDelivery"
                                className="font-medium"
                              >
                                Cash on Delivery
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Pay when your order is delivered
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 p-4 border rounded-lg">
                            <input
                              type="radio"
                              id="bankTransfer"
                              name="paymentMethod"
                              value="bank_transfer"
                              checked={
                                formData.paymentMethod === "bank_transfer"
                              }
                              onChange={handleInputChange}
                              className="text-primary"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor="bankTransfer"
                                className="font-medium"
                              >
                                Bank Transfer
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Transfer payment to our bank account
                              </p>
                            </div>
                          </div>
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

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <CreditCard className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-amber-800">
                                Payment Information
                              </h4>
                              <p className="text-sm text-amber-700 mt-1">
                                We&apos;ll contact you after order confirmation
                                to arrange payment and delivery details.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <div className="flex space-x-4">
                    {activeTab !== "shipping" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const tabs = ["shipping", "billing", "payment"];
                          const currentIndex = tabs.indexOf(activeTab);
                          if (currentIndex > 0) {
                            setActiveTab(tabs[currentIndex - 1]);
                          }
                        }}
                      >
                        Previous
                      </Button>
                    )}

                    {activeTab !== "payment" ? (
                      <Button
                        type="button"
                        onClick={() => {
                          const tabs = ["shipping", "billing", "payment"];
                          const currentIndex = tabs.indexOf(activeTab);
                          if (currentIndex < tabs.length - 1) {
                            setActiveTab(tabs[currentIndex + 1]);
                          }
                        }}
                        className="flex-1"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-6 rounded-lg font-medium transition-colors duration-200"
                      >
                        {isProcessing ? "Processing Order..." : "Place Order"}
                      </Button>
                    )}
                  </div>
                </form>
              </Tabs>
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
                      <h3 className="font-medium text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {item.price * item.quantity} LKR
                      </p>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
