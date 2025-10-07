import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ShoppingBag, ArrowLeft, Heart } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simplified Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/assets/logos/logo.png"
                alt="LeadHer Shop"
                width={40}
                height={40}
                className="w-8 h-8 lg:w-10 lg:h-10"
              />
              <span className="text-xl lg:text-2xl font-serif font-bold text-foreground">
                LeadHer Shop
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-foreground hover:text-primary transition-colors"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/cart">
                <Button variant="ghost" size="sm">
                  <ShoppingBag className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/favorites">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* 404 Illustration */}
          <div className="text-center mb-12">
            <div className="relative mx-auto w-80 h-80 mb-8">
              <Image
                src="/assets/images/leather1.jpg"
                alt="404 - Page Not Found"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
                <div className="text-white text-8xl font-bold font-serif">
                  404
                </div>
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-foreground mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The page you&apos;re looking for seems to have wandered off like a
              lost leather artisan. Don&apos;t worry, we&apos;ll help you find
              your way back to our premium collection.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Go Home</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Return to our homepage and explore our collection
                </p>
                <Link href="/">
                  <Button className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Search Products</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Find exactly what you&apos;re looking for
                </p>
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Browse
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Your Cart</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Continue with your shopping
                </p>
                <Link href="/cart">
                  <Button variant="outline" className="w-full">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Cart
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Favorites</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View your saved items
                </p>
                <Link href="/favorites">
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorites
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Popular Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-center mb-8">
              Explore Our Popular Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Handbags", href: "/products?category=handbags" },
                { name: "Wallets", href: "/products?category=Wallets" },
                { name: "Belts", href: "/products?category=belts" },
                { name: "Accessories", href: "/products?category=accessories" },
              ].map((category) => (
                <Link key={category.name} href={category.href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-muted/50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-serif font-bold mb-4">
              Need Help Finding Something?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our customer service team is here to help you find exactly what
              you&apos;re looking for. Whether you need assistance with a
              specific product or have questions about our collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contact Support
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button variant="ghost" size="lg" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Image
                  src="/assets/logos/logo.png"
                  alt="LeadHer Shop"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-lg font-serif font-bold text-foreground">
                  LeadHer Shop
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium leather goods crafted with passion and precision.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Products
                </Link>
                <Link
                  href="/about"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Categories</h3>
              <div className="space-y-2">
                <Link
                  href="/products?category=handbags"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Handbags
                </Link>
                <Link
                  href="/products?category=wallets"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Wallets
                </Link>
                <Link
                  href="/products?category=belts"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Belts
                </Link>
                <Link
                  href="/products?category=accessories"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Accessories
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Support</h3>
              <div className="space-y-2">
                <Link
                  href="/contact"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/profile"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  My Account
                </Link>
                <Link
                  href="/cart"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Shopping Cart
                </Link>
                <Link
                  href="/favorites"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Favorites
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 LeadHer Shop. All rights reserved. Crafted with ❤️ for
              leather enthusiasts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
