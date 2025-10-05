import { Star, Quote } from "lucide-react";
import Image from "next/image";
import leather1 from "../../public/assets/images/leather1.jpg";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "The quality of my Heritano wallet is exceptional. It's been my daily companion for over a year and still looks brand new. The craftsmanship is truly remarkable.",
      image: leather1,
    },
    {
      name: "Ahmed Al-Rashid",
      location: "Dubai, UAE",
      rating: 5,
      text: "I've owned many luxury leather goods, but nothing compares to Heritano. The attention to detail and premium materials make it worth every penny.",
      image: leather1,
    },
    {
      name: "Emma Thompson",
      location: "London, UK",
      rating: 5,
      text: "The customer service was outstanding, and the product exceeded my expectations. This is what true luxury feels like - timeless and elegant.",
      image: leather1,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-amber-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers
            have to say about their Heritano experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-12 h-12 text-amber-600" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-amber-400 fill-current"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-amber-800 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 shadow-lg">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-amber-600 text-sm">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
