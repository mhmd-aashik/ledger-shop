import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { testimonials } from "@/data/testimonials";
import { fetchReviews } from "@/lib/actions/fetch-review.action";
import { ReviewTypes } from "../types/review.types";
import { urlFor } from "@/sanity/lib/image";

export default async function TestimonialsSection() {
  const reviews = await fetchReviews();

  console.log(JSON.stringify(reviews, null, 2));

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-amber-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied
            customers have to say about their Heritano experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Render Sanity reviews if available */}
          {reviews && reviews.length > 0
            ? reviews.map((review: ReviewTypes) => (
                <div
                  key={review._id}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 opacity-10">
                    <Quote className="w-12 h-12 text-amber-600" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-amber-400 fill-current"
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-amber-800 leading-relaxed mb-6 italic">
                    &ldquo;{review.description}&rdquo;
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 shadow-lg">
                      {review.image?.asset ? (
                        <Image
                          src={urlFor(review.image).width(48).height(48).url()}
                          alt={review.image.alt || review.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-amber-200 flex items-center justify-center">
                          <span className="text-amber-600 font-semibold text-lg">
                            {review.name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">
                        {review.name}
                      </h4>
                      <p className="text-amber-600 text-sm">
                        {review.location || "Verified Customer"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            : /* Fallback to static testimonials if no Sanity reviews */
              testimonials.map((testimonial, index) => (
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
                    &ldquo;{testimonial.text}&rdquo;
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
