import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // "image", "video", "thumbnail"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type based on upload type
    if (type === "image" || type === "thumbnail") {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Please select an image file" },
          { status: 400 }
        );
      }
    } else if (type === "video") {
      if (!file.type.startsWith("video/")) {
        return NextResponse.json(
          { error: "Please select a video file" },
          { status: 400 }
        );
      }
    }

    // Validate file size (10MB limit for images, 50MB for videos)
    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File size must be less than ${type === "video" ? "50MB" : "10MB"}`,
        },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `product-${type}-${timestamp}-${file.name}`;

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
