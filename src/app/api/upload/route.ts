import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'image' or 'video'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!type || !["image", "video"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be image or video" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];

    if (type === "image" && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid image type. Allowed: JPEG, PNG, WebP",
        },
        { status: 400 }
      );
    }

    if (type === "video" && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid video type. Allowed: MP4, WebM, QuickTime",
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB for images, 100MB for videos)
    const maxImageSize = 10 * 1024 * 1024; // 10MB
    const maxVideoSize = 100 * 1024 * 1024; // 100MB

    if (type === "image" && file.size > maxImageSize) {
      return NextResponse.json(
        {
          error: "Image too large. Maximum size: 10MB",
        },
        { status: 400 }
      );
    }

    if (type === "video" && file.size > maxVideoSize) {
      return NextResponse.json(
        {
          error: "Video too large. Maximum size: 100MB",
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const filename = `${type}-${timestamp}.${fileExtension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: filename,
      type: type,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
