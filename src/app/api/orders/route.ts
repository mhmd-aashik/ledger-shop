import { NextRequest, NextResponse } from "next/server";
import {
  sendOrderNotificationEmail,
  sendOrderConfirmationEmail,
} from "@/lib/email";
import { OrderData } from "../../../../types/email.types";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const orderData: Omit<OrderData, "orderId" | "orderDate"> =
      await request.json();

    if (
      !orderData.customerName ||
      !orderData.customerEmail ||
      !orderData.customerPhone ||
      !orderData.customerAddress ||
      !orderData.items ||
      orderData.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Generate order ID and date
    const orderId = `ORD-${uuidv4()}`;
    const orderDate = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Create complete order data
    const completeOrderData: OrderData = {
      ...orderData,
      orderId,
      orderDate,
    };

    const notificationResult =
      await sendOrderNotificationEmail(completeOrderData);
    if (!notificationResult.success) {
      console.error("Failed to send notification email:", notificationResult);
      // Don't fail the order if email fails, just log it
    }

    // Send confirmation email to customer
    const confirmationResult =
      await sendOrderConfirmationEmail(completeOrderData);
    if (!confirmationResult.success) {
      console.error("Failed to send confirmation email:", confirmationResult);
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order placed successfully",
      emailStatus: {
        notification: notificationResult.success,
        confirmation: confirmationResult.success,
      },
    });
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
