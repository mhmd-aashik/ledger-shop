import { Shield, Truck, Award, Heart } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Premium Quality",
      description:
        "Handcrafted with the finest materials and attention to detail",
    },
    {
      icon: Truck,
      title: "Free Worldwide Shipping",
      description:
        "Complimentary shipping on all orders with tracking included",
    },
    {
      icon: Award,
      title: "Lifetime Warranty",
      description:
        "Our commitment to quality with lifetime craftsmanship guarantee",
    },
    {
      icon: Heart,
      title: "Ethically Made",
      description:
        "Sustainable practices and ethical sourcing from trusted suppliers",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-amber-900 mb-4">
            Why Choose Heritano
          </h2>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            We combine traditional craftsmanship with modern luxury to create
            leather goods that stand the test of time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-amber-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
