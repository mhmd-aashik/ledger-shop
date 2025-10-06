import { NextRequest, NextResponse } from "next/server";

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  rating: number;
  reviewCount: number;
  addedAt: string;
}

// Mock favorites data - in a real app, this would be stored in a database
const favorites: Record<string, FavoriteProduct[]> = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userFavorites = favorites[userId] || [];
    return NextResponse.json({ favorites: userFavorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, product } = body;

    if (!userId || !product) {
      return NextResponse.json(
        { error: "User ID and product are required" },
        { status: 400 }
      );
    }

    if (!favorites[userId]) {
      favorites[userId] = [];
    }

    // Check if product is already in favorites
    const existingIndex = favorites[userId].findIndex(
      (fav) => fav.id === product.id
    );

    if (existingIndex === -1) {
      favorites[userId].push({
        ...product,
        addedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      favorites: favorites[userId],
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      { error: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "User ID and product ID are required" },
        { status: 400 }
      );
    }

    if (favorites[userId]) {
      favorites[userId] = favorites[userId].filter(
        (fav) => fav.id !== productId
      );
    }

    return NextResponse.json({
      success: true,
      favorites: favorites[userId] || [],
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      { error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
