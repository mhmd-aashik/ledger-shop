import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin Dashboard - LeadHer Shop",
  description: "Admin panel for managing LeadHer Shop e-commerce platform",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#6c47ff",
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#000000",
        },
        elements: {
          formButtonPrimary:
            "bg-[#6c47ff] hover:bg-[#5a3ae6] text-sm normal-case",
          card: "bg-white shadow-lg border border-gray-200",
          headerTitle: "text-gray-900",
          headerSubtitle: "text-gray-600",
          socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
          socialButtonsBlockButtonText: "font-normal",
          formFieldInput:
            "border border-gray-300 focus:border-[#6c47ff] focus:ring-[#6c47ff]",
          footerActionLink: "text-[#6c47ff] hover:text-[#5a3ae6]",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${playfair.variable} ${inter.variable} antialiased`}>
          <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="lg:pl-64">
              <AdminHeader />
              <main className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "oklch(0.25 0.08 35)",
                color: "oklch(0.95 0.02 45)",
                border: "1px solid oklch(0.8 0.05 40)",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
