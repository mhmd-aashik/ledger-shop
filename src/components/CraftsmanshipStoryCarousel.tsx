"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  Clock,
  Users,
  Award,
} from "lucide-react";

interface StorySlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  video?: string;
  stats?: {
    icon: any;
    value: string;
    label: string;
  }[];
  highlight?: string;
}

const craftsmanshipStory: StorySlide[] = [
  {
    id: 1,
    title: "Premium Material Selection",
    subtitle: "The Foundation of Excellence",
    description:
      "We source only the finest Italian leather from renowned tanneries, carefully selecting each hide for its unique character, durability, and beauty. Every piece tells a story of quality.",
    image: "/assets/images/leather1.jpg",
    stats: [
      { icon: Award, value: "100%", label: "Italian Leather" },
      { icon: Clock, value: "50+", label: "Years Experience" },
      { icon: Users, value: "1000+", label: "Happy Customers" },
    ],
    highlight: "Premium Quality",
  },
  {
    id: 2,
    title: "Master Artisan at Work",
    subtitle: "Traditional Techniques, Modern Precision",
    description:
      "Our master craftsmen employ time-honored techniques passed down through generations. Each stitch is placed with intention, every cut made with precision, ensuring your leather goods will last a lifetime.",
    image: "/assets/images/leather2.jpg",
    video: "/assets/video/craftsmanship.mp4",
    stats: [
      { icon: Clock, value: "8+", label: "Hours per Piece" },
      { icon: Sparkles, value: "200+", label: "Hand Stitches" },
      { icon: Award, value: "Lifetime", label: "Craftsmanship Guarantee" },
    ],
    highlight: "Handcrafted",
  },
  {
    id: 3,
    title: "Attention to Detail",
    subtitle: "Where Perfection Meets Passion",
    description:
      "From edge finishing to hardware selection, every detail is meticulously crafted. Our artisans take pride in creating pieces that not only look beautiful but feel exceptional in your hands.",
    image: "/assets/images/leather3.jpg",
    stats: [
      { icon: Award, value: "0.1mm", label: "Precision Tolerance" },
      { icon: Clock, value: "3+", label: "Quality Checks" },
      { icon: Sparkles, value: "100%", label: "Hand Finished" },
    ],
    highlight: "Precision Crafted",
  },
  {
    id: 4,
    title: "Timeless Beauty",
    subtitle: "Aging Gracefully Through Time",
    description:
      "True luxury leather develops character over time. Our pieces are designed to age beautifully, developing a rich patina that tells the story of your journey together.",
    image: "/assets/images/leather4.jpg",
    stats: [
      { icon: Clock, value: "10+", label: "Years Durability" },
      { icon: Users, value: "95%", label: "Customer Satisfaction" },
      { icon: Award, value: "Premium", label: "Aging Process" },
    ],
    highlight: "Timeless Design",
  },
  {
    id: 5,
    title: "Customer Stories",
    subtitle: "Real People, Real Experiences",
    description:
      "Meet our customers who have chosen quality over quantity. From business professionals to world travelers, each person has found their perfect leather companion in our collection.",
    image: "/assets/images/leather5.jpg",
    stats: [
      { icon: Users, value: "1000+", label: "Happy Customers" },
      { icon: Award, value: "4.9/5", label: "Average Rating" },
      { icon: Clock, value: "24/7", label: "Customer Support" },
    ],
    highlight: "Customer Love",
  },
];

export default function CraftsmanshipStoryCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % craftsmanshipStory.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % craftsmanshipStory.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + craftsmanshipStory.length) % craftsmanshipStory.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentStory = craftsmanshipStory[currentSlide];

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Our Craftsmanship Story</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            The Art of Leather Craftsmanship
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the journey from premium Italian leather to your perfect
            leather companion. Every step is crafted with passion, precision,
            and timeless tradition.
          </p>
        </div>

        {/* Main Carousel */}
        <div
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Image/Video Section */}
            <div className="relative">
              <div className="absolute inset-0">
                {currentStory.video ? (
                  <video
                    src={currentStory.video}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <Image
                    src={currentStory.image}
                    alt={currentStory.title}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Play/Pause Button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={togglePlayPause}
                  className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Highlight Badge */}
              {currentStory.highlight && (
                <div className="absolute bottom-4 left-4">
                  <div className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {currentStory.highlight}
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <div className="text-amber-600 text-sm font-medium mb-2">
                  Step {currentSlide + 1} of {craftsmanshipStory.length}
                </div>
                <h3 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
                  {currentStory.title}
                </h3>
                <p className="text-lg text-amber-600 font-medium mb-4">
                  {currentStory.subtitle}
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {currentStory.description}
                </p>
              </div>

              {/* Stats */}
              {currentStory.stats && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {currentStory.stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-2">
                        <stat.icon className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {craftsmanshipStory.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentSlide
                          ? "bg-amber-500 scale-125"
                          : "bg-gray-300 hover:bg-amber-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={prevSlide}
                    className="p-2 bg-gray-100 hover:bg-amber-100 text-gray-600 hover:text-amber-600 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2 bg-gray-100 hover:bg-amber-100 text-gray-600 hover:text-amber-600 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Ready to experience the difference of handcrafted luxury?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
              Explore Our Collection
            </button>
            <button className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105">
              Watch Craftsmanship Video
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
