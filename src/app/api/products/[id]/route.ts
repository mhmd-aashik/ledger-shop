import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
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
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Calculate average rating
    const reviews = product.reviews;
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    const productWithRating = {
      ...product,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: product._count.reviews,
      favoriteCount: product._count.favorites,
    };

    return NextResponse.json(productWithRating);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      compareAtPrice,
      costPrice,
      sku,
      barcode,
      trackQuantity,
      quantity,
      lowStockThreshold,
      images,
      video,
      thumbnail,
      categoryId,
      tags,
      features,
      materials,
      dimensions,
      weight,
      metaTitle,
      metaDescription,
      status,
      isActive,
      isFeatured,
    } = body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if slug already exists (excluding current product)
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Product with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Check if SKU already exists (excluding current product)
    
    if (sku && sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku },
      });

      if (skuExists) {
        return NextResponse.json(
          { error: "Product with this SKU already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: Prisma.ProductUpdateInput = {};

    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (shortDescription !== undefined)
      updateData.shortDescription = shortDescription;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (compareAtPrice !== undefined)
      updateData.compareAtPrice = compareAtPrice
        ? parseFloat(compareAtPrice)
        : null;
    if (costPrice !== undefined)
      updateData.costPrice = costPrice ? parseFloat(costPrice) : null;
    if (sku !== undefined) updateData.sku = sku;
    if (barcode !== undefined) updateData.barcode = barcode;
    if (trackQuantity !== undefined) updateData.trackQuantity = trackQuantity;
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);
    if (lowStockThreshold !== undefined)
      updateData.lowStockThreshold = parseInt(lowStockThreshold);
    if (images !== undefined) updateData.images = images;
    if (video !== undefined) updateData.video = video;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (categoryId !== undefined) {
      updateData.category = {
        connect: { id: categoryId },
      };
    }
    if (tags !== undefined) updateData.tags = tags;
    if (features !== undefined) updateData.features = features;
    if (materials !== undefined) updateData.materials = materials;
    if (dimensions !== undefined) updateData.dimensions = dimensions;
    if (weight !== undefined)
      updateData.weight = weight ? parseFloat(weight) : null;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      updateData.metaDescription = metaDescription;
    if (status !== undefined) {
      updateData.status = status.toUpperCase();
      // Set publishedAt when status changes to PUBLISHED
      if (
        status.toUpperCase() === "PUBLISHED" &&
        existingProduct.status !== "PUBLISHED"
      ) {
        updateData.publishedAt = new Date();
      }
    }
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product is in any orders
    const orderItems = await prisma.orderItem.findFirst({
      where: { productId: params.id },
    });

    if (orderItems) {
      return NextResponse.json(
        { error: "Cannot delete product that has been ordered" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
