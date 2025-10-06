import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { syncUserFromClerk, deleteUser } from "@/lib/actions/user.action";

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const result = await syncUserFromClerk({
      id,
      emailAddresses: email_addresses,
      firstName: first_name,
      lastName: last_name,
      imageUrl: image_url,
    });

    if (!result.success) {
      console.error("Failed to sync user:", result.error);
      return new Response("Error syncing user", { status: 500 });
    }

    console.log("User created and synced:", id);
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const result = await syncUserFromClerk({
      id,
      emailAddresses: email_addresses,
      firstName: first_name,
      lastName: last_name,
      imageUrl: image_url,
    });

    if (!result.success) {
      console.error("Failed to sync user update:", result.error);
      return new Response("Error syncing user update", { status: 500 });
    }

    console.log("User updated and synced:", id);
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const result = await deleteUser(id);

    if (!result.success) {
      console.error("Failed to delete user:", result.error);
      return new Response("Error deleting user", { status: 500 });
    }

    console.log("User deleted:", id);
  }

  return new Response("", { status: 200 });
}
