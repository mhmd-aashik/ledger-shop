import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../app/(root)/globals.css";
import "@/styles/header.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { UserSyncProvider } from "@/components/UserSyncProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeadHer Shop - Premium Leather Goods",
  description:
    "Discover our exquisite collection of handcrafted leather goods. From wallets to handbags, each piece is crafted with passion and precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
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
              socialButtonsBlockButton:
                "border border-gray-300 hover:bg-gray-50",
              socialButtonsBlockButtonText: "font-normal",
              formFieldInput:
                "border border-gray-300 focus:border-[#6c47ff] focus:ring-[#6c47ff]",
              footerActionLink: "text-[#6c47ff] hover:text-[#5a3ae6]",
            },
          }}
        >
          <UserSyncProvider>{children}</UserSyncProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "oklch(0.25 0.08 35)",
                color: "oklch(0.95 0.02 45)",
                border: "1px solid oklch(0.8 0.05 40)",
              },
            }}
          />
        </ClerkProvider>
      </body>
    </html>
  );
}
