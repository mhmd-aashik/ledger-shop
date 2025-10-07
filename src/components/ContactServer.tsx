import ContactFormClient from "./ContactFormClient";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactServer() {
  return (
    <main className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-leather-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                Contact Information
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Reach out to us through any of the following channels.
                We&apos;re here to help!
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Email
                  </h3>
                  <p className="text-muted-foreground mb-1">
                    info@leadhershop.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Phone
                  </h3>
                  <p className="text-muted-foreground mb-1">+974 1234 5678</p>
                  <p className="text-sm text-muted-foreground">
                    Mon-Fri 9AM-6PM (Qatar Time)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Address
                  </h3>
                  <p className="text-muted-foreground mb-1">
                    Souq Waqif, Doha
                    <br />
                    Qatar
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Visit our showroom
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Business Hours
                  </h3>
                  <p className="text-muted-foreground mb-1">
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Client Component */}
          <ContactFormClient />
        </div>
      </div>
    </main>
  );
}
