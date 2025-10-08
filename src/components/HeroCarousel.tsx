"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  Award,
  Clock,
  Users,
  RefreshCw,
  ImageIcon,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import EmptyState from "./EmptyState";

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link?: string;
  linkText?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function HeroCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchCarousels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/carousel");

      if (!response.ok) {
        throw new Error(`Failed to fetch carousel: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success && data.error) {
        throw new Error(data.error);
      }

      // Filter only active slides
      const activeSlides = data.filter(
        (slide: CarouselSlide) => slide.isActive
      );
      setSlides(activeSlides);
    } catch (err) {
      console.error("Error fetching carousels:", err);
      // Show user-friendly message instead of technical error
      setError("Unable to load carousel content");
      setSlides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch carousel data from database
  useEffect(() => {
    fetchCarousels();
  }, [fetchCarousels]);

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlaying || isHovered || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Increased to 6 seconds for storytelling

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const togglePlayPause = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Enhanced loading state with skeleton
  if (loading) {
    return (
      <section className="relative h-screen overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content Skeleton */}
              <div className="max-w-2xl">
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-16 w-full mb-6" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-6 w-full mb-8" />
                <Skeleton className="h-12 w-40" />
              </div>
              {/* Right Content Skeleton */}
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <Skeleton className="h-8 w-48 mb-6" />
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Enhanced error state - show friendly message instead of technical error
  if (error) {
    return (
      <section className="relative h-screen overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
              Unable to load carousel
            </h3>
            <p className="text-muted-foreground mb-6">
              We&apos;re having trouble loading the carousel content. Please try
              again or check back later.
            </p>
            <Button
              variant="outline"
              onClick={fetchCarousels}
              className="flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no slides
  if (!loading && slides.length === 0) {
    return (
      <section className="relative h-screen overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <EmptyState
            title="No carousel slides available"
            description="Please add slides from the admin dashboard to display content here."
            onRetry={fetchCarousels}
            showSearchButton={false}
            showHomeButton={true}
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-screen overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Enhanced Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left Content */}
                  <div className="max-w-2xl">
                    {/* Step Indicator */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Slide {index + 1} of {slides.length}
                      </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-4 font-light">
                      {slide.subtitle}
                    </p>
                    <p className="text-lg text-white/80 mb-8 leading-relaxed">
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href={slide.link || "/products"}>
                        <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                          {slide.linkText || "Learn More"}
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Right Content - Stats/Features */}
                  <div className="hidden lg:block">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                      <h3 className="text-2xl font-serif font-bold text-white mb-6">
                        Why Choose Our Leather?
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Award className="w-6 h-6 text-amber-400" />
                          <span className="text-white">
                            Premium Italian Leather
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-6 h-6 text-amber-400" />
                          <span className="text-white">
                            Handcrafted Excellence
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Users className="w-6 h-6 text-amber-400" />
                          <span className="text-white">
                            1000+ Happy Customers
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Sparkles className="w-6 h-6 text-amber-400" />
                          <span className="text-white">Lifetime Guarantee</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced Navigation Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={togglePlayPause}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Arrows with enhanced hover effects */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>

        {/* Enhanced Dots Indicator with better hover effects */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                index === currentSlide
                  ? "bg-amber-500 scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/70 hover:shadow-md"
              }`}
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-amber-500 transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

// Memoized component for better performance
export default memo(HeroCarousel);
