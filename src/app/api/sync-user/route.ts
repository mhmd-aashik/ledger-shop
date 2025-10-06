import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { syncUserFromClerk } from "@/lib/actions/user.action";

export async function POST() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { success: false, error: "No authenticated user" },
        { status: 401 }
      );
    }

    const result = await syncUserFromClerk({
      id: clerkUser.id,
      emailAddresses: clerkUser.emailAddresses,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      imageUrl: clerkUser.imageUrl || "",
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
