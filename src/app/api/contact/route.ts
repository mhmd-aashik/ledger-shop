import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the contact form data
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;

    if (!process.env.RESEND_API_KEY) {
      console.warn(
        "Resend API key not configured. Contact form email will not be sent."
      );
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Send email to admin
    const adminEmailResult = await resend.emails.send({
      from: "contact@heritano.com",
      to: ["papaaashik@gmail.com"], // Replace with your admin email
      subject: `Contact Form: ${subject}`,
      html: generateContactFormHTML({ name, email, subject, message }),
    });

    if (adminEmailResult.error) {
      console.error(
        "Failed to send admin notification:",
        adminEmailResult.error
      );
      return NextResponse.json(
        { error: "Failed to send contact form" },
        { status: 500 }
      );
    }

    // Send confirmation email to customer
    const customerEmailResult = await resend.emails.send({
      from: "noreply@heritano.com",
      to: [email],
      subject: "Thank you for contacting Heritano",
      html: generateContactConfirmationHTML(name, subject),
    });

    if (customerEmailResult.error) {
      console.error(
        "Failed to send customer confirmation:",
        customerEmailResult.error
      );
      // Don't fail the request if customer confirmation fails
    }

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      messageId: adminEmailResult.data?.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}

function generateContactFormHTML(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .contact-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .message-content { background: #e8f4f8; padding: 20px; border-radius: 6px; margin: 20px 0; white-space: pre-wrap; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
          <p>Someone has contacted you through your website</p>
        </div>
        
        <div class="content">
          <div class="contact-info">
            <h3>Contact Information</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
          </div>

          <div class="message-content">
            <h3>Message:</h3>
            <p>${data.message}</p>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated notification from Heritano contact form</p>
          <p>Please respond to the customer at: ${data.email}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateContactConfirmationHTML(
  name: string,
  subject: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting us</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .confirmation { background: #e8f4f8; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .contact-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Message Received!</h1>
          <p>Thank you for contacting Heritano</p>
        </div>
        
        <div class="content">
          <div class="confirmation">
            <h3>Hello ${name},</h3>
            <p>We've received your message regarding "<strong>${subject}</strong>" and will get back to you within 24 hours.</p>
            <p>Our team is reviewing your inquiry and will respond as soon as possible.</p>
          </div>

          <div class="contact-info">
            <h3>Need immediate assistance?</h3>
            <p><strong>Phone:</strong> +974 1234 5678</p>
            <p><strong>Email:</strong> info@leadhershop.com</p>
            <p><strong>Business Hours:</strong> Mon-Fri 9AM-6PM (Qatar Time)</p>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing Heritano!</p>
          <p>We appreciate your interest in our premium leather products.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
