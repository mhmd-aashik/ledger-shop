import Image from "next/image";
import { CheckCircle, Clock, Users, Award } from "lucide-react";
import leather2 from "../../public/assets/images/leather2.jpg";
import leather3 from "../../public/assets/images/leather3.jpg";

export default function CraftsmanshipSection() {
  const stats = [
    { icon: Clock, label: "Hours of Crafting", value: "40+" },
    { icon: Users, label: "Master Artisans", value: "15+" },
    { icon: Award, label: "Years of Experience", value: "25+" },
  ];

  const process = [
    "Premium leather selection from trusted suppliers",
    "Hand-cutting with precision tools and techniques",
    "Traditional stitching with waxed thread",
    "Edge finishing and burnishing by hand",
    "Quality inspection and final touches",
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div>
            <h2 className="text-4xl font-serif font-bold text-amber-900 mb-6">
              The Art of Craftsmanship
            </h2>
            <p className="text-xl text-amber-700 mb-8 leading-relaxed">
              Every Heritano piece is born from a passion for perfection. Our
              master artisans combine traditional techniques with modern
              precision to create leather goods that are both beautiful and
              built to last.
            </p>

            {/* Process Steps */}
            <div className="space-y-4 mb-8">
              {process.map((step, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" />
                  <span className="text-amber-800">{step}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-amber-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-amber-700">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={leather2}
                    alt="Leather crafting process"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={leather3}
                    alt="Finished leather product"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-200 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-300 rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
