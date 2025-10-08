"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

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

export default function HeroCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch carousel data from database
  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        const response = await fetch("/api/carousel");
        if (response.ok) {
          const data = await response.json();
          // Filter only active slides
          const activeSlides = data.filter(
            (slide: CarouselSlide) => slide.isActive
          );
          setSlides(activeSlides);
        }
      } catch (error) {
        console.error("Error fetching carousels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarousels();
  }, []);

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

  // Show loading state
  if (loading) {
    return (
      <section className="relative h-screen overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading carousel...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no slides
  if (slides.length === 0) {
    return (
      <section className="relative h-screen overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-600 text-lg">
              No carousel slides available
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please add slides from the admin dashboard
            </p>
          </div>
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
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Enhanced Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-amber-500 scale-125"
                  : "bg-white/50 hover:bg-white/70"
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
