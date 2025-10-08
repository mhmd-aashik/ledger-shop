import { prisma } from "@/lib/prisma";
import ProductsClient from "@/components/admin/ProductsClient";

export default async function ProductManagement() {
  try {
    // Fetch products and categories on the server
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: true,
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              favorites: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
    ]);

    // Calculate average rating for each product and convert to proper types
    const productsWithRating = products.map((product) => {
      const reviews = product.reviews;
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          : 0;

      return {
        ...product,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice
          ? Number(product.compareAtPrice)
          : undefined,
        costPrice: product.costPrice ? Number(product.costPrice) : undefined,
        weight: product.weight ? Number(product.weight) : undefined,
        shortDescription: product.shortDescription || undefined,
        sku: product.sku || undefined,
        barcode: product.barcode || undefined,
        video: product.video || undefined,
        thumbnail: product.thumbnail || undefined,
        dimensions: product.dimensions || undefined,
        metaTitle: product.metaTitle || undefined,
        metaDescription: product.metaDescription || undefined,
        publishedAt: product.publishedAt
          ? product.publishedAt.toISOString()
          : undefined,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: product._count.reviews,
        favoriteCount: product._count.favorites,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };
    });

    return (
      <ProductsClient
        initialProducts={productsWithRating}
        initialCategories={categories}
      />
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Error Loading Products
          </h3>
          <p className="text-gray-600">
            Failed to load products. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }
}
