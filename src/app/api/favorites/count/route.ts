import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ count: 0 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ count: 0 });
    }

    const favoritesCount = await prisma.favorite.count({
      where: { userId: dbUser.id },
    });

    return NextResponse.json({ count: favoritesCount });
  } catch (error) {
    console.error("Error getting favorites count:", error);
    return NextResponse.json({ count: 0 });
  }
}



