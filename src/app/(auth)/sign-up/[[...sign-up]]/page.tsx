import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../../../public/assets/logos/logo.png";
import leather4 from "../../../../../public/assets/images/leather4.jpg";
import leather5 from "../../../../../public/assets/images/leather5.jpg";
import leather6 from "../../../../../public/assets/images/leather6.jpg";

export default function Page() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Product Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          <Image
            src={leather4}
            alt="Luxury Leather Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>
        </div>

        {/* Product Gallery Overlay */}
        <div className="absolute top-8 left-8 right-8 flex gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white/30">
            <Image
              src={leather4}
              alt="Leather Product 4"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white/30">
            <Image
              src={leather5}
              alt="Leather Product 5"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white/30">
            <Image
              src={leather6}
              alt="Leather Product 6"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Brand Story Content */}
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <Image
                src={logo}
                alt="Heritano Logo"
                width={32}
                height={32}
                className="filter brightness-0 invert"
              />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold">Heritano</h2>
              <p className="text-white/80 text-sm">Luxury Leather Goods</p>
            </div>
          </div>

          <h3 className="text-4xl font-serif font-bold mb-4 leading-tight">
            Start Shopping Today
          </h3>
          <p className="text-lg text-white/90 mb-6 leading-relaxed">
            Create your account to browse our premium leather collection, save
            your favorites, and enjoy fast, secure checkout with worldwide
            shipping.
          </p>

          <div className="flex items-center space-x-6 text-sm text-white/80">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
              Save Favorites
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
              Order Tracking
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
              Quick Checkout
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Authentication */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-xl">
              <Image
                src={logo}
                alt="Heritano Logo"
                width={40}
                height={40}
                className="filter brightness-0 invert"
              />
            </div>
          </div>

          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-amber-900 mb-3">
              Join Heritano
            </h1>
            <p className="text-amber-700 text-lg">
              Create your account to start shopping our premium collection
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 p-8">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 font-medium text-amber-800",
                  socialButtonsBlockButtonText: "font-semibold",
                  formFieldInput:
                    "border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 transition-all duration-300 bg-amber-50/50 text-amber-900 placeholder-amber-600",
                  formButtonPrimary:
                    "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105",
                  footerActionLink:
                    "text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-300",
                  identityPreviewText: "text-amber-700",
                  formFieldLabel: "text-amber-800 font-semibold",
                  formFieldErrorText: "text-red-600 font-medium",
                  formFieldSuccessText: "text-green-600 font-medium",
                  footerActionText: "text-amber-700",
                  formResendCodeLink:
                    "text-amber-600 hover:text-amber-700 font-semibold",
                  formFieldHintText: "text-amber-600",
                  formFieldWarningText: "text-amber-600",
                  formFieldInfoText: "text-amber-600",
                },
              }}
              redirectUrl="/"
            />
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-amber-700">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-amber-600 hover:text-amber-800 font-bold transition-colors duration-300 underline decoration-amber-400 hover:decoration-amber-600"
              >
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
