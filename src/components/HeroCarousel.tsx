"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { client, queries, urlFor, isSanityReady } from "@/lib/sanity";

interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  image?: {
    asset: {
      _ref: string;
    };
  } | null;
  ctaText: string;
  ctaLink: string;
}

const fallbackSlides = [
  {
    _id: "1",
    title: "Handcrafted Elegance",
    subtitle: "Premium leather goods for the discerning individual",
    ctaText: "Shop Collection",
    ctaLink: "/products",
    image: null, // Will use fallback image
  },
  {
    _id: "2",
    title: "Timeless Quality",
    subtitle: "Crafted with precision, designed for life",
    ctaText: "Discover More",
    ctaLink: "/products",
    image: null, // Will use fallback image
  },
  {
    _id: "3",
    title: "Luxury Redefined",
    subtitle: "Where tradition meets modern sophistication",
    ctaText: "Explore Now",
    ctaLink: "/products",
    image: null, // Will use fallback image
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      // Check if Sanity is properly configured
      if (!isSanityReady()) {
        console.log("Sanity not configured, using fallback data");
        setHeroSlides(fallbackSlides);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching hero slides from Sanity...");
        const data = await client.fetch(queries.heroSlides);
        console.log("Hero slides data:", data);

        if (data && data.length > 0) {
          console.log("Using Sanity hero slides data");
          setHeroSlides(data);
        } else {
          console.log("No hero slides found, using fallback data");
          setHeroSlides(fallbackSlides);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
        console.log("Using fallback data due to error");
        // Use fallback data
        setHeroSlides(fallbackSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || heroSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={
                  slide.image?.asset?._ref
                    ? urlFor(slide.image).width(1920).height(1080).url()
                    : `/assets/images/leather${(index % 3) + 1}.jpg`
                }
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
                    {slide.subtitle}
                  </p>
                  <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                    {slide.ctaText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-accent scale-125"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
