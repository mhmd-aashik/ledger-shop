import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../app/(root)/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
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
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
