import { prisma, connectWithRetry } from "./prisma";

/**
 * Test database connection and return connection status
 */
export async function testDatabaseConnection(): Promise<{
  connected: boolean;
  error?: string;
}> {
  try {
    await connectWithRetry(3, 1000);
    await prisma.$disconnect();
    return { connected: true };
  } catch (error) {
    console.error("Database connection test failed:", error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
}

/**
 * Execute a database operation with connection error handling
 */
export async function withDatabaseConnection<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    // Test connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.connected) {
      return {
        success: false,
        error: "Database connection failed. Please try again later.",
        data: fallback,
      };
    }

    // Execute the operation
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    console.error("Database operation failed:", error);
    return {
      success: false,
      error: "Database operation failed. Please try again later.",
      data: fallback,
    };
  }
}

/**
 * Get user-friendly error message for database issues
 */
export function getDatabaseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("connection")) {
      return "Unable to connect to the database. Please check your internet connection and try again.";
    }
    if (error.message.includes("timeout")) {
      return "The request is taking longer than expected. Please try again.";
    }
    if (error.message.includes("permission")) {
      return "Access denied. Please check your permissions.";
    }
    if (error.message.includes("not found")) {
      return "The requested data was not found.";
    }
  }
  return "A database error occurred. Please try again later.";
}
