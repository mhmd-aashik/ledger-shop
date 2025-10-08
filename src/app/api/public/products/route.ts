import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { fallbackProducts } from "@/lib/fallback-data";

// GET /api/public/products - Get all published products (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      status: "PUBLISHED",
      isActive: true,
    };

    if (featured === "true") {
      where.isFeatured = true;
    }

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

    return NextResponse.json({
      success: true,
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      message:
        productsWithRating.length === 0
          ? "No products found matching your criteria"
          : undefined,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    // Return fallback data instead of error
    return NextResponse.json({
      success: true,
      products: fallbackProducts,
      pagination: {
        page: 1,
        limit: 12,
        total: fallbackProducts.length,
        pages: 1,
      },
      message: "Using cached data - please try again later",
      fallback: true,
    });
  }
}
