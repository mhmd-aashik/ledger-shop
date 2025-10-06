import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("Test route received", request);
  return new Response("Hello, world!", { status: 200 });
}
