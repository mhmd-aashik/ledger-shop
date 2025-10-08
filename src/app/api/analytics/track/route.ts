import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, properties, userId, sessionId } = body;

    if (!event) {
      return NextResponse.json({ error: "Event is required" }, { status: 400 });
    }

    // Create analytics event record
    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        event,
        properties: properties || {},
        userId: userId || null,
        sessionId: sessionId || null,
        timestamp: new Date(),
        userAgent: request.headers.get("user-agent") || null,
        referer: request.headers.get("referer") || null,
        url: properties?.url || null,
      },
    });

    return NextResponse.json({ success: true, id: analyticsEvent.id });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}
