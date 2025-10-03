"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft, ShoppingBag, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mb-8">
              <CheckCircle className="w-24 h-24 mx-auto text-green-600 mb-4" />
              <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
                Order Confirmed!
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                Thank you for your order
              </p>
              {orderId && (
                <p className="text-lg font-medium text-primary">
                  Order #: {orderId}
                </p>
              )}
            </div>

            {/* Order Details Card */}
            <div className="leather-card rounded-xl p-8 mb-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Confirmation Email Sent</span>
                </div>

                  <p className="text-muted-foreground">
                    We&apos;ve sent a confirmation email with your order details.
                    Please check your inbox (and spam folder) for the
                    confirmation.
                  </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    What happens next?
                  </h3>
                  <ul className="text-left text-blue-800 space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      We&apos;ll review your order and contact you within 24 hours
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      We&apos;ll confirm payment details and delivery arrangements
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Your order will be prepared and shipped to your address
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      You&apos;ll receive tracking information once shipped
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Need Help?
                  </h3>
                    <p className="text-amber-800 text-sm">
                      If you have any questions about your order or need to make
                      changes, please don&apos;t hesitate to contact us. We&apos;re here to
                      help!
                    </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
