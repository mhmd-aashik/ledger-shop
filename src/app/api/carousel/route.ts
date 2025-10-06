import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const carousels = await prisma.carousel.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(carousels);
  } catch (error) {
    console.error("Error fetching carousels:", error);
    return NextResponse.json(
      { error: "Failed to fetch carousels" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received carousel data:", body);

    const { title, subtitle, description, image, isActive = true } = body;

    // Validate required fields
    if (!title || !subtitle || !description || !image) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, subtitle, description, and image are required",
        },
        { status: 400 }
      );
    }

    const carousel = await prisma.carousel.create({
      data: {
        title,
        subtitle,
        description,
        image,
        isActive,
      },
    });

    console.log("Created carousel:", carousel);
    return NextResponse.json(carousel, { status: 201 });
  } catch (error) {
    console.error("Error creating carousel:", error);
    return NextResponse.json(
      {
        error: "Failed to create carousel",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
