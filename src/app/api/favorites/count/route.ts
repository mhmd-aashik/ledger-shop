import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
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
