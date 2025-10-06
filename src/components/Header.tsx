"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, User, LogIn, Heart } from "lucide-react";
import Image from "next/image";
import logo from "../../public/assets/logos/logo.png";
import { Button } from "@/components/ui/button";
import { getCartItems } from "@/lib/actions/cart.action";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Function to refresh counts
  const refreshCounts = async () => {
    try {
      // Load cart items
      const cartResult = await getCartItems();
      if (cartResult.success) {
        setCartItemCount(cartResult.items?.length || 0);
      }

      // Load favorites count from API
      const favoritesResponse = await fetch("/api/favorites/count");
      const favoritesData = await favoritesResponse.json();
      setFavoritesCount(favoritesData.count || 0);
    } catch (error) {
      console.error("Error loading counts:", error);
    }
  };

  // Load cart and favorites count from database
  useEffect(() => {
    setIsMounted(true);
    refreshCounts();
  }, []);

  // Listen for storage events to refresh counts when favorites change
  useEffect(() => {
    const handleStorageChange = () => {
      refreshCounts();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events
    window.addEventListener("favoritesUpdated", handleStorageChange);
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoritesUpdated", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image src={logo || ""} alt="Logo" width={40} height={40} />
            </div>
            <span className="font-serif text-xl lg:text-2xl font-bold text-foreground">
              Heritano
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Auth & Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Authentication */}
            <div className="hidden md:flex items-center space-x-2">
              <SignedOut>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-700 hover:text-amber-900 hover:bg-amber-50 border border-amber-200"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Join Luxury
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "shadow-lg border border-gray-200",
                      userButtonPopoverActionButton: "hover:bg-gray-50",
                    },
                  }}
                />
              </SignedIn>
            </div>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative p-2 text-foreground/80 hover:text-foreground transition-colors duration-200"
            >
              <Heart className="w-6 h-6" />
              {isMounted && favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-foreground/80 hover:text-foreground transition-colors duration-200"
            >
              <ShoppingBag className="w-6 h-6" />
              {isMounted && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Authentication */}
              <div className="border-t border-border pt-3 mt-3">
                <SignedOut>
                  <div className="space-y-2">
                    <Link href="/sign-in">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-amber-700 hover:text-amber-900 hover:bg-amber-50 border border-amber-200"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button className="w-full justify-start bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg">
                        <User className="w-4 h-4 mr-2" />
                        Join Luxury
                      </Button>
                    </Link>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm text-foreground/80">Account</span>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                          userButtonPopoverCard:
                            "shadow-lg border border-gray-200",
                          userButtonPopoverActionButton: "hover:bg-gray-50",
                        },
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
