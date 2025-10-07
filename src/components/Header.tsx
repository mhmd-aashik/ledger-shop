"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogIn,
  Heart,
  Sparkles,
  Award,
  Clock,
  Search,
  Bell,
} from "lucide-react";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

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
    { name: "Home", href: "/", icon: Sparkles },
    { name: "Products", href: "/products", icon: Award },
    { name: "About", href: "/about", icon: Clock },
    { name: "Contact", href: "/contact", icon: Heart },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const quickStats = [
    { icon: Award, value: "100%", label: "Italian Leather" },
    { icon: Clock, value: "50+", label: "Years Experience" },
    { icon: Sparkles, value: "1000+", label: "Happy Customers" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-amber-200/50 shadow-lg shadow-amber-500/10"
            : "bg-white/90 backdrop-blur-md border-b border-amber-200/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Enhanced Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <Image
                    src={logo || ""}
                    alt="Logo"
                    width={32}
                    height={32}
                    className="filter brightness-0 invert"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors duration-300">
                  Heritano
                </span>
                <span className="text-xs text-amber-700 font-medium -mt-1">
                  Luxury Leather Goods
                </span>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-amber-700 hover:bg-amber-50/50 transition-all duration-300 font-medium relative group"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </nav>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-xl text-gray-600 hover:text-amber-700 hover:bg-amber-50/50 transition-all duration-300 hover:scale-110"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-gray-600 hover:text-amber-700 hover:bg-amber-50/50 transition-all duration-300 hover:scale-110"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full animate-pulse" />
              </button>

              {/* Favorites */}
              <Link
                href="/favorites"
                className="relative p-2 rounded-xl text-gray-600 hover:text-amber-700 hover:bg-amber-50/50 transition-all duration-300 hover:scale-110 group"
              >
                <Heart className="w-5 h-5 group-hover:fill-current" />
                {isMounted && favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-xl text-gray-600 hover:text-amber-700 hover:bg-amber-50/50 transition-all duration-300 hover:scale-110 group"
              >
                <ShoppingBag className="w-5 h-5" />
                {isMounted && cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Authentication */}
              <div className="hidden md:flex items-center space-x-2 ml-2">
                <SignedOut>
                  <Link href="/sign-in">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-700 hover:text-amber-900 hover:bg-amber-50 border border-amber-200 rounded-xl"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
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
                        avatarBox: "w-10 h-10 rounded-xl shadow-lg",
                        userButtonPopoverCard:
                          "shadow-xl border border-amber-200 rounded-xl",
                        userButtonPopoverActionButton:
                          "hover:bg-amber-50 rounded-lg",
                      },
                    }}
                  />
                </SignedIn>
              </div>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-amber-700 hover:bg-amber-50/50 transition-all duration-300 hover:scale-110"
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

          {/* Enhanced Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-amber-200/50 bg-white/95 backdrop-blur-xl shadow-lg">
              <nav className="px-4 pt-4 pb-6 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50/50 rounded-xl transition-all duration-300 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Mobile Quick Stats */}
                <div className="border-t border-amber-200/50 pt-4 mt-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {quickStats.map((stat, index) => (
                      <div
                        key={index}
                        className="text-center p-3 bg-amber-50/50 rounded-xl"
                      >
                        <stat.icon className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="text-xs text-amber-600">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Authentication */}
                <div className="border-t border-amber-200/50 pt-4 mt-4">
                  <SignedOut>
                    <div className="space-y-3">
                      <Link href="/sign-in">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-amber-700 hover:text-amber-900 hover:bg-amber-50 border border-amber-200 rounded-xl"
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/sign-up">
                        <Button className="w-full justify-start bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg rounded-xl">
                          <User className="w-4 h-4 mr-2" />
                          Join Luxury
                        </Button>
                      </Link>
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center justify-between px-4 py-3 bg-amber-50/50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">
                        Account
                      </span>
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10 rounded-xl shadow-lg",
                            userButtonPopoverCard:
                              "shadow-xl border border-amber-200 rounded-xl",
                            userButtonPopoverActionButton:
                              "hover:bg-amber-50 rounded-lg",
                          },
                        }}
                      />
                    </div>
                  </SignedIn>
                </div>
              </nav>
            </div>
          )}

          {/* Search Overlay */}
          {isSearchOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
            >
              <div className="flex items-start justify-center pt-20 px-4">
                <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Search className="w-6 h-6 text-amber-600" />
                    <input
                      type="text"
                      placeholder="Search for leather goods..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-lg border-none outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    Search for wallets, cardholders, belts, and more...
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="fixed top-20 right-4 z-50 bg-white rounded-2xl shadow-2xl border border-amber-200/50 w-80 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-amber-50/50 rounded-xl">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      New Collection
                    </div>
                    <div className="text-xs text-gray-600">
                      Premium Italian leather wallets now available
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-amber-50/50 rounded-xl">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Order Update
                    </div>
                    <div className="text-xs text-gray-600">
                      Your leather wallet is being handcrafted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
