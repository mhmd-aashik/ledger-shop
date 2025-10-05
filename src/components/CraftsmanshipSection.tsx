import Image from "next/image";
import leather1 from "../../public/assets/images/leather1.jpg";
import leather4 from "../../public/assets/images/leather4.jpg";
import { Heart } from "lucide-react";
import { features } from "@/data/features";

export default function CraftsmanshipSection() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Why Choose Heritano?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We&apos;re not just selling leather goods – we&apos;re crafting
            experiences that last a lifetime. Every piece tells a story of
            quality, tradition, and uncompromising attention to detail.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Image Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="relative">
              <Image
                src={leather1}
                alt="Premium leather craftsmanship"
                width={600}
                height={400}
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <Image
                src={leather4}
                alt="Artisan at work"
                width={600}
                height={400}
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-amber-50 px-6 py-3 rounded-full">
            <Heart className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800 font-medium">
              Join thousands of satisfied customers worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
