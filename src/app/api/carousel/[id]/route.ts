import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const carousel = await prisma.carousel.findUnique({
      where: { id },
    });

    if (!carousel) {
      return NextResponse.json(
        { error: "Carousel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(carousel);
  } catch (error) {
    console.error("Error fetching carousel:", error);
    return NextResponse.json(
      { error: "Failed to fetch carousel" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, subtitle, description, image, isActive } = body;

    const carousel = await prisma.carousel.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        image,
        isActive,
      },
    });

    return NextResponse.json(carousel);
  } catch (error) {
    console.error("Error updating carousel:", error);
    return NextResponse.json(
      { error: "Failed to update carousel" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.carousel.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Carousel deleted successfully" });
  } catch (error) {
    console.error("Error deleting carousel:", error);
    return NextResponse.json(
      { error: "Failed to delete carousel" },
      { status: 500 }
    );
  }
}
