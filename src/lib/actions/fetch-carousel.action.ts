import { client } from "@/sanity/lib/client";

export async function fetchCarousel() {
  const carousel = await client.fetch(
    `*[_type == "carousel" && isActive == true] | order(order asc) {
    _id,
    title,
    subtitle,
    image {
      asset->{
        _id,
        url
      },
      alt
    },
    order,
    cta,
    ctaLink,
    isActive
  }`,
    {},
    {
      cache: "no-store",
    }
  );
  return carousel;
}
