"use server";

import { client } from "@/sanity/lib/client";

export async function fetchReviews() {
  const reviews = await client.fetch(
    `*[_type == "review"]`,
    {},
    {
      cache: "no-store",
    }
  );
  return reviews;
}
