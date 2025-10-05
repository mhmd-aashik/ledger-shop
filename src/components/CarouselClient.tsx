"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

interface SanityCarouselSlide {
  _id: string;
  title: string;
  image: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  order: number;
  cta: string;
  ctaLink: string;
  isActive?: boolean;
  subtitle: string;
}

interface StaticSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
}

type CarouselSlide = SanityCarouselSlide | StaticSlide;

interface CarouselClientProps {
  slides: CarouselSlide[];
}

export default function CarouselClient({ slides }: CarouselClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Don't render if no slides
  if (!slides || slides.length === 0) {
    return <div>No carousel slides available</div>;
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const isSanitySlide = "_id" in slide;
          const slideKey = isSanitySlide ? slide._id : slide.id;
          const imageSrc = isSanitySlide
            ? urlFor(slide.image).width(1920).height(1080).quality(100).url()
            : slide.image;
          const imageAlt = isSanitySlide
            ? slide.image.alt || slide.title
            : slide.title;

          return (
            <div
              key={slideKey}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
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
                      {slide.subtitle}
                    </h1>
                    {!isSanitySlide && (
                      <>
                        <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
                          {slide.cta}
                        </p>
                        <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                          {slide.ctaLink}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-50 cursor-pointer"
          aria-label="Previous slide"
          type="button"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-50 cursor-pointer"
          aria-label="Next slide"
          type="button"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
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
