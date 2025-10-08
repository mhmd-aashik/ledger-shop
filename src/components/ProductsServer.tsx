import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface ProductsServerProps {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export default async function ProductsServer({
  search,
  category,
  page = 1,
  limit = 12,
}: ProductsServerProps) {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      status: "PUBLISHED",
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "all") {
      where.category = {
        name: {
          contains: category,
          mode: "insensitive",
        },
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const reviews = product.reviews;
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          : 0;

      return {
        ...product,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: product._count.reviews,
        favoriteCount: product._count.favorites,
      };
    });

    return {
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
      },
    };
  }
}
