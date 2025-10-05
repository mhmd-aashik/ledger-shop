import { Resend } from "resend";
import { OrderData } from "../../types/email.types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderNotificationEmail(orderData: OrderData) {
  console.log("Sending order notification email for order:", orderData.orderId);
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("Resend API key not configured. Email will not be sent.");
      return { success: false, message: "Email service not configured" };
    }

    const { data, error } = await resend.emails.send({
      from: "aashikdevelop@gmail.com",
      to: "whatever@heritano.com",
      subject: `New Order #${orderData.orderId} - ${orderData.customerName}`,
      html: generateOrderEmailHTML(orderData),
    });

    // if error, return error
    if (error) {
      console.error("Resend API error:", error);
      return {
        success: false,
        message: "Failed to send order notification email",
        error: error.message || "Unknown Resend API error",
        details: error,
      };
    }

    console.log("Order notification email sent successfully:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Unexpected error sending order notification email:", error);
    return {
      success: false,
      message: "Unexpected error occurred while sending email",
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    };
  }
}

export async function sendOrderConfirmationEmail(orderData: OrderData) {
  console.log("Sending order confirmation email for order:", orderData.orderId);
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("Resend API key not configured. Email will not be sent.");
      return { success: false, message: "Email service not configured" };
    }

    const { data, error } = await resend.emails.send({
      from: "whatever@heritano.com",
      to: [orderData.customerEmail || "papaaashik@gmail.com"],
      subject: `Order Confirmation #${orderData.orderId} - LeadHer Shop`,
      html: generateOrderConfirmationHTML(orderData),
    });

    if (error) {
      console.error("Resend API error:", error);
      return {
        success: false,
        message: "Failed to send order confirmation email",
        error: error.message || "Unknown Resend API error",
        details: error,
      };
    }

    console.log("Order confirmation email sent successfully:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Unexpected error sending order confirmation email:", error);
    return {
      success: false,
      message: "Unexpected error occurred while sending confirmation email",
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    };
  }
}

function generateOrderEmailHTML(orderData: OrderData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .order-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .item { display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee; }
        .item:last-child { border-bottom: none; }
        .item-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 15px; }
        .item-details { flex: 1; }
        .item-name { font-weight: bold; margin-bottom: 5px; }
        .item-price { color: #666; }
        .totals { background: #f8f9fa; padding: 20px; border-radius: 6px; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .total-final { font-size: 18px; font-weight: bold; border-top: 2px solid #8B4513; padding-top: 10px; }
        .customer-info { background: #e8f4f8; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛍️ New Order Received!</h1>
          <p>Order #${orderData.orderId}</p>
        </div>
        
        <div class="content">
          <div class="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${orderData.customerName}</p>
            <p><strong>Email:</strong> ${orderData.customerEmail}</p>
            <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
            <p><strong>Address:</strong> ${orderData.customerAddress}</p>
          </div>

          <div class="order-info">
            <h3>Order Details</h3>
            <p><strong>Order Date:</strong> ${orderData.orderDate}</p>
            
            <h4>Items Ordered:</h4>
            ${orderData.items
              .map(
                (item) => `
              <div class="item">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                  <div class="item-name">${item.name}</div>
                  <div class="item-price">Quantity: ${item.quantity} × ${item.price} LKR = ${item.price * item.quantity} LKR</div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${orderData.subtotal} LKR</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>${orderData.shipping === 0 ? "Free" : orderData.shipping + " LKR"}</span>
            </div>
            <div class="total-row total-final">
              <span>Total:</span>
              <span>${orderData.total} LKR</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated notification from LeadHer Shop</p>
          <p>Please process this order and contact the customer for payment confirmation.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateOrderConfirmationHTML(orderData: OrderData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .order-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .item { display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee; }
        .item:last-child { border-bottom: none; }
        .item-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 15px; }
        .item-details { flex: 1; }
        .item-name { font-weight: bold; margin-bottom: 5px; }
        .item-price { color: #666; }
        .totals { background: #f8f9fa; padding: 20px; border-radius: 6px; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .total-final { font-size: 18px; font-weight: bold; border-top: 2px solid #8B4513; padding-top: 10px; }
        .next-steps { background: #e8f4f8; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmed!</h1>
          <p>Thank you for your order, ${orderData.customerName}!</p>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h3>Order #${orderData.orderId}</h3>
            <p><strong>Order Date:</strong> ${orderData.orderDate}</p>
            
            <h4>Your Items:</h4>
            ${orderData.items
              .map(
                (item) => `
              <div class="item">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                  <div class="item-name">${item.name}</div>
                  <div class="item-price">Quantity: ${item.quantity} × ${item.price} LKR = ${item.price * item.quantity} LKR</div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${orderData.subtotal} LKR</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>${orderData.shipping === 0 ? "Free" : orderData.shipping + " LKR"}</span>
            </div>
            <div class="total-row total-final">
              <span>Total:</span>
              <span>${orderData.total} LKR</span>
            </div>
          </div>

          <div class="next-steps">
            <h3>What's Next?</h3>
            <p>We've received your order and will contact you shortly to confirm payment details and arrange delivery.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing LeadHer Shop!</p>
          <p>We'll be in touch soon with payment and delivery details.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
