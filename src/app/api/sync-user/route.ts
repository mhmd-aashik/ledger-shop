import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { syncUserFromAuth } from "@/lib/actions/user.action";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "No authenticated user" },
        { status: 401 }
      );
    }

    const result = await syncUserFromAuth({
      id: session.user.id!,
      email: session.user.email!,
      name: session.user.name || "",
      image: session.user.image || "",
    });

    if (result.success) {
      return NextResponse.json({ success: true, user: result.user });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in sync-user API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
