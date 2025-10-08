import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Find user with valid magic token
    const user = await prisma.user.findFirst({
      where: {
        magicToken: token,
        magicTokenExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired magic link" },
        { status: 400 }
      );
    }

    // Clear magic token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        magicToken: null,
        magicTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        image: user.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error in verify magic link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
