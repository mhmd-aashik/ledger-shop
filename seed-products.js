const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const products = [
  {
    name: "Classic Leather Wallet",
    slug: "classic-leather-wallet",
    price: 450,
    compareAtPrice: 550,
    description:
      "Handcrafted from premium Italian leather, this classic wallet combines timeless elegance with modern functionality. Each piece is carefully stitched by master craftsmen using traditional techniques passed down through generations.",
    shortDescription: "Handcrafted from premium Italian leather",
    thumbnail: "/assets/images/leather1.jpg",
    images: [
      "/assets/images/leather1.jpg",
      "/assets/images/leather2.jpg",
      "/assets/images/leather3.jpg",
    ],
    status: "PUBLISHED",
    isActive: true,
    isFeatured: true,
    sku: "CLW-001",
    weight: 0.2,
    dimensions: "10cm x 7cm x 2cm",
    metaTitle: "Classic Leather Wallet - Premium Italian Leather",
    metaDescription:
      "Handcrafted classic leather wallet made from premium Italian leather. Timeless design with modern functionality.",
    publishedAt: new Date(),
  },
  {
    name: "Minimalist Cardholder",
    slug: "minimalist-cardholder",
    price: 280,
    compareAtPrice: 350,
    description:
      "Sleek design for the modern professional. This minimalist cardholder is perfect for those who prefer a clean, uncluttered approach to carrying their essentials.",
    shortDescription: "Sleek design for the modern professional",
    thumbnail: "/assets/images/leather2.jpg",
    images: ["/assets/images/leather2.jpg", "/assets/images/leather1.jpg"],
    status: "PUBLISHED",
    isActive: true,
    isFeatured: true,
    sku: "MCH-002",
    weight: 0.1,
    dimensions: "9cm x 6cm x 1cm",
    metaTitle: "Minimalist Cardholder - Modern Professional Design",
    metaDescription:
      "Sleek minimalist cardholder perfect for modern professionals. Clean design with premium materials.",
    publishedAt: new Date(),
  },
  {
    name: "Executive Briefcase",
    slug: "executive-briefcase",
    price: 1200,
    compareAtPrice: 1500,
    description:
      "Professional elegance meets functionality. This executive briefcase is designed for the modern business professional who demands both style and practicality.",
    shortDescription: "Professional elegance meets functionality",
    thumbnail: "/assets/images/leather3.jpg",
    images: ["/assets/images/leather3.jpg", "/assets/images/leather4.jpg"],
    status: "PUBLISHED",
    isActive: true,
    isFeatured: true,
    sku: "EB-003",
    weight: 1.5,
    dimensions: "40cm x 30cm x 8cm",
    metaTitle: "Executive Briefcase - Professional Business Case",
    metaDescription:
      "Professional executive briefcase combining elegance with functionality for modern business professionals.",
    publishedAt: new Date(),
  },
  {
    name: "Vintage Leather Belt",
    slug: "vintage-leather-belt",
    price: 320,
    compareAtPrice: 400,
    description:
      "Timeless style with contemporary comfort. This vintage-inspired leather belt is crafted from the finest materials and designed to last a lifetime.",
    shortDescription: "Timeless style with contemporary comfort",
    thumbnail: "/assets/images/leather4.jpg",
    images: ["/assets/images/leather4.jpg", "/assets/images/leather5.jpg"],
    status: "PUBLISHED",
    isActive: true,
    isFeatured: false,
    sku: "VLB-004",
    weight: 0.3,
    dimensions: "110cm x 3.5cm x 0.5cm",
    metaTitle: "Vintage Leather Belt - Timeless Style",
    metaDescription:
      "Vintage-inspired leather belt crafted from premium materials with timeless style and contemporary comfort.",
    publishedAt: new Date(),
  },
  {
    name: "Luxury Key Holder",
    slug: "luxury-key-holder",
    price: 180,
    compareAtPrice: 220,
    description:
      "Keep your keys organized in style. This luxury key holder is designed to protect your keys while adding a touch of elegance to your daily routine.",
    shortDescription: "Keep your keys organized in style",
    thumbnail: "/assets/images/leather5.jpg",
    images: ["/assets/images/leather5.jpg", "/assets/images/leather6.jpg"],
    status: "PUBLISHED",
    isActive: true,
    isFeatured: false,
    sku: "LKH-005",
    weight: 0.15,
    dimensions: "8cm x 5cm x 2cm",
    metaTitle: "Luxury Key Holder - Organize Keys in Style",
    metaDescription:
      "Luxury key holder designed to keep your keys organized while adding elegance to your daily routine.",
    publishedAt: new Date(),
  },
  {
    name: "Premium Watch Strap",
    slug: "premium-watch-strap",
    price: 220,
    compareAtPrice: 280,
    description:
      "Hand-stitched for ultimate comfort. This premium watch strap is crafted from the finest leather and designed to complement any timepiece.",
    shortDescription: "Hand-stitched for ultimate comfort",
    thumbnail: "/assets/images/leather6.jpg",
    images: ["/assets/images/leather6.jpg", "/assets/images/leather7.jpg"],
    status: "PUBLISHED",
    isActive: true,
    isFeatured: false,
    sku: "PWS-006",
    weight: 0.08,
    dimensions: "20cm x 2cm x 0.3cm",
    metaTitle: "Premium Watch Strap - Hand-Stitched Comfort",
    metaDescription:
      "Premium hand-stitched watch strap crafted from finest leather for ultimate comfort and style.",
    publishedAt: new Date(),
  },
  {
    name: "Business Card Holder",
    slug: "business-card-holder",
    price: 150,
    compareAtPrice: 180,
    description:
      "Make a lasting first impression. This business card holder is designed to present your cards with style and professionalism.",
    shortDescription: "Make a lasting first impression",
    thumbnail: "/assets/images/leather7.jpg",
    images: ["/assets/images/leather7.jpg", "/assets/images/leather8.jpg"],
    status: "PUBLISHED",
    isActive: true,
    isFeatured: false,
    sku: "BCH-007",
    weight: 0.12,
    dimensions: "9cm x 6cm x 1.5cm",
    metaTitle: "Business Card Holder - Professional Presentation",
    metaDescription:
      "Professional business card holder designed to make a lasting first impression with style and elegance.",
    publishedAt: new Date(),
  },
  {
    name: "Travel Wallet",
    slug: "travel-wallet",
    price: 380,
    compareAtPrice: 450,
    description:
      "Perfect companion for your journeys. This travel wallet is designed with the modern traveler in mind, offering security and convenience.",
    shortDescription: "Perfect companion for your journeys",
    thumbnail: "/assets/images/leather8.jpg",
    images: ["/assets/images/leather8.jpg", "/assets/images/leather1.jpg"],
    status: "PUBLISHED",
    isActive: true,
    isFeatured: true,
    sku: "TW-008",
    weight: 0.25,
    dimensions: "12cm x 8cm x 2.5cm",
    metaTitle: "Travel Wallet - Perfect Travel Companion",
    metaDescription:
      "Travel wallet designed for modern travelers, offering security and convenience for your journeys.",
    publishedAt: new Date(),
  },
];

async function main() {
  console.log("🌱 Starting product seeding...");

  try {
    // First, create categories if they don't exist
    const categories = [
      {
        name: "Wallets",
        slug: "wallets",
        description: "Premium leather wallets for every occasion",
      },
      {
        name: "Cardholders",
        slug: "cardholders",
        description: "Minimalist cardholders for modern professionals",
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Leather accessories to complement your style",
      },
    ];

    for (const categoryData of categories) {
      await prisma.category.upsert({
        where: { name: categoryData.name },
        update: categoryData,
        create: categoryData,
      });
    }

    console.log("✅ Categories created/updated");

    // Get category IDs
    const walletCategory = await prisma.category.findUnique({
      where: { name: "Wallets" },
    });
    const cardholderCategory = await prisma.category.findUnique({
      where: { name: "Cardholders" },
    });
    const accessoriesCategory = await prisma.category.findUnique({
      where: { name: "Accessories" },
    });

    // Create products
    for (const productData of products) {
      let categoryId;

      if (
        productData.name.includes("Wallet") ||
        productData.name.includes("Travel")
      ) {
        categoryId = walletCategory.id;
      } else if (productData.name.includes("Cardholder")) {
        categoryId = cardholderCategory.id;
      } else {
        categoryId = accessoriesCategory.id;
      }

      await prisma.product.upsert({
        where: { sku: productData.sku },
        update: {
          ...productData,
          categoryId,
        },
        create: {
          ...productData,
          categoryId,
        },
      });
    }

    console.log("✅ Products seeded successfully!");
    console.log(`📦 Created ${products.length} products`);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
