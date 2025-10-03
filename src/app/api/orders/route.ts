import { NextRequest, NextResponse } from "next/server";
import {
  sendOrderNotificationEmail,
  sendOrderConfirmationEmail,
  OrderData,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json();

    // Validate required fields
    if (
      !orderData.customerName ||
      !orderData.customerEmail ||
      !orderData.items ||
      orderData.items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required order information" },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    orderData.orderId = orderId;
    orderData.orderDate = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Colombo",
    });

    // Send notification email to owner
    await sendOrderNotificationEmail(orderData);

    // Send confirmation email to customer
    await sendOrderConfirmationEmail(orderData);

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order placed successfully and emails sent",
    });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
