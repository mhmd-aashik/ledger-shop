"use server";

import { client } from "@/sanity/lib/client";
import { revalidateTag } from "next/cache";

export async function fetchReviews() {
  const reviews = await client.fetch(`*[_type == "review"]`);
  revalidateTag("reviews");
  return reviews;
}
