import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

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
  title: "LeadHer Shop - Luxury Leather Goods",
  description:
    "Handcrafted luxury leather wallets, cardholders, and accessories. Premium quality, timeless elegance.",
};

export default function RootLayout({
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
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${playfair.variable} ${inter.variable} antialiased`}>
          {children}
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
