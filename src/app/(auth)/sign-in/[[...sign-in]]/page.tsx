import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import logo from "../../../../../public/assets/logos/logo.png";
import leather1 from "../../../../../public/assets/images/leather1.jpg";
import leather2 from "../../../../../public/assets/images/leather2.jpg";
import leather3 from "../../../../../public/assets/images/leather3.jpg";
import { SignInForm } from "@/components/auth/SignInForm";

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect("/");
  }
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Product Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          <Image
            src={leather1}
            alt="Luxury Leather Wallet"
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
              src={leather1}
              alt="Leather Product 1"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white/30">
            <Image
              src={leather2}
              alt="Leather Product 2"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white/30">
            <Image
              src={leather3}
              alt="Leather Product 3"
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
            Premium Leather Collection
          </h3>
          <p className="text-lg text-white/90 mb-6 leading-relaxed">
            Shop our exclusive collection of luxury leather wallets,
            cardholders, and accessories. Each piece is handcrafted with the
            finest materials and delivered worldwide.
          </p>

          <div className="flex items-center space-x-6 text-sm text-white/80">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
              Free Shipping
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
              Secure Checkout
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
              Fast Delivery
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
              Welcome Back
            </h1>
            <p className="text-amber-700 text-lg">
              Sign in to access your account and continue shopping
            </p>
          </div>

          {/* Sign In Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 p-8">
            <SignInForm />
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-amber-700">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-amber-600 hover:text-amber-800 font-bold transition-colors duration-300 underline decoration-amber-400 hover:decoration-amber-600"
              >
                Create your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
