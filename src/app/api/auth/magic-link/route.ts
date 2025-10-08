import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMagicLinkEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate magic link token
    const magicToken = crypto.randomBytes(32).toString("hex");
    const magicTokenExpiry = new Date(Date.now() + 900000); // 15 minutes from now

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a temporary user for magic link
      user = await prisma.user.create({
        data: {
          email,
          firstName: "User",
          lastName: "Name",
          password: null, // No password for magic link users
          magicToken,
          magicTokenExpiry,
        },
      });
    } else {
      // Update existing user with magic token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          magicToken,
          magicTokenExpiry,
        },
      });
    }

    // Send magic link email
    const emailResult = await sendMagicLinkEmail({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      magicToken,
    });

    if (!emailResult.success) {
      console.error("Failed to send magic link email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send magic link email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Magic link sent to your email",
    });
  } catch (error) {
    console.error("Error in magic link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
