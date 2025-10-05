import { Product, ProductItem } from "../types/products.types";

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Leather Wallet",
    price: 450,
    image: "/assets/images/leather1.jpg",
    category: "Wallets",
    description: "Handcrafted from premium Italian leather",
  },
  {
    id: "2",
    name: "Minimalist Cardholder",
    price: 280,
    image: "/assets/images/leather2.jpg",
    category: "Cardholders",
    description: "Sleek design for the modern professional",
  },
  {
    id: "3",
    name: "Executive Briefcase",
    price: 1200,
    image: "/assets/images/leather3.jpg",
    category: "Accessories",
    description: "Professional elegance meets functionality",
  },
  {
    id: "4",
    name: "Vintage Leather Belt",
    price: 320,
    image: "/assets/images/leather4.jpg",
    category: "Accessories",
    description: "Timeless style with contemporary comfort",
  },
  {
    id: "5",
    name: "Luxury Key Holder",
    price: 180,
    image: "/assets/images/leather5.jpg",
    category: "Accessories",
    description: "Keep your keys organized in style",
  },
  {
    id: "6",
    name: "Premium Watch Strap",
    price: 220,
    image: "/assets/images/leather6.jpg",
    category: "Accessories",
    description: "Hand-stitched for ultimate comfort",
  },
  {
    id: "7",
    name: "Business Card Holder",
    price: 150,
    image: "/assets/images/leather7.jpg",
    category: "Accessories",
    description: "Make a lasting first impression",
  },
  {
    id: "8",
    name: "Travel Wallet",
    price: 380,
    image: "/assets/images/leather8.jpg",
    category: "Wallets",
    description: "Perfect companion for your journeys",
  },
];

export const productItem: ProductItem = {
  id: "1",
  name: "Classic Leather Wallet",
  price: 450,
  images: [
    "/assets/images/leather1.jpg",
    "/assets/images/leather2.jpg",
    "/assets/images/leather3.jpg",
  ],
  video: "/assets/video/video-1.mp4",
  category: "Wallets",
  description:
    "Handcrafted from premium Italian leather, this classic wallet combines timeless elegance with modern functionality. Each piece is carefully stitched by master craftsmen using traditional techniques passed down through generations.",
  features: [
    "Premium Italian leather construction",
    "Hand-stitched seams for durability",
    "Multiple card slots and cash compartments",
    "RFID blocking technology",
    "Lifetime craftsmanship guarantee",
  ],
  rating: 4.8,
  reviews: 127,
  inStock: true,
};
