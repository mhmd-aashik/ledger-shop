// Fallback data for when database is unavailable
export const fallbackProducts = [
  {
    id: "fallback-1",
    name: "Premium Leather Handbag",
    slug: "premium-leather-handbag",
    price: 299.99,
    compareAtPrice: 399.99,
    thumbnail: "/assets/images/leather1.jpg",
    images: ["/assets/images/leather1.jpg"],
    category: { name: "Handbags" },
    description:
      "Crafted from the finest Italian leather, this handbag combines timeless elegance with modern functionality.",
    shortDescription: "Premium Italian leather handbag",
    rating: 4.8,
    reviewCount: 24,
    favoriteCount: 12,
    status: "PUBLISHED",
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    name: "Classic Leather Wallet",
    slug: "classic-leather-wallet",
    price: 89.99,
    compareAtPrice: 129.99,
    thumbnail: "/assets/images/leather2.jpg",
    images: ["/assets/images/leather2.jpg"],
    category: { name: "Wallets" },
    description:
      "A classic leather wallet that ages beautifully and becomes more personal over time.",
    shortDescription: "Classic leather wallet",
    rating: 4.6,
    reviewCount: 18,
    favoriteCount: 8,
    status: "PUBLISHED",
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    price: 199.99,
    compareAtPrice: 249.99,
    thumbnail: "/assets/images/leather3.jpg",
    images: ["/assets/images/leather3.jpg"],
    category: { name: "Bags" },
    description:
      "Perfect for everyday use, this crossbody bag offers both style and practicality.",
    shortDescription: "Versatile leather crossbody bag",
    rating: 4.7,
    reviewCount: 15,
    favoriteCount: 6,
    status: "PUBLISHED",
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const fallbackCartItems = [];

export const fallbackCategories = [
  { id: "cat-1", name: "Handbags", slug: "handbags" },
  { id: "cat-2", name: "Wallets", slug: "wallets" },
  { id: "cat-3", name: "Bags", slug: "bags" },
];
