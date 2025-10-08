import { NextResponse } from "next/server";
import { testDatabaseConnection } from "@/lib/db-utils";

export async function GET() {
  try {
    const dbStatus = await testDatabaseConnection();

    const health = {
      status: dbStatus.connected ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      database: {
        connected: dbStatus.connected,
        error: dbStatus.error,
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    return NextResponse.json(health, {
      status: dbStatus.connected ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
