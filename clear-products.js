const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Clearing existing products...");

  try {
    // Delete all products
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`✅ Deleted ${deletedProducts.count} existing products`);

    // Delete all categories
    const deletedCategories = await prisma.category.deleteMany({});
    console.log(`✅ Deleted ${deletedCategories.count} existing categories`);

    console.log("✅ Database cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
