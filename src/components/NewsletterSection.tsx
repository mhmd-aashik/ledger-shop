import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsletterSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-amber-600 to-amber-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Be the first to know about new collections, exclusive offers, and
            the latest in luxury leather craftsmanship.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-amber-900 placeholder-amber-600 border-0 focus:ring-2 focus:ring-white/50 focus:outline-none"
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-white text-amber-700 hover:bg-white/90 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Subscribe
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-white/80 text-sm mt-4">
            Join over 10,000 luxury leather enthusiasts worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
