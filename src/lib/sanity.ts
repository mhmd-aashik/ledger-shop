import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Sanity configuration
const isSanityConfigured =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "your-project-id";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: process.env.NODE_ENV === "production",
  apiVersion: "2023-05-03",
  token: process.env.SANITY_API_TOKEN,
});

// Helper function to check if Sanity is properly configured
export const isSanityReady = () => isSanityConfigured;

// Image URL builder
const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);

// GROQ queries
export const queries = {
  // Get all products
  allProducts: `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    price,
    description,
    slug,
    inStock,
    featured,
    category->{
      _id,
      name,
      slug
    },
    images[]{
      asset->{
        _id,
        url
      }
    }
  }`,

  // Get featured products
  featuredProducts: `*[_type == "product" && featured == true] | order(_createdAt desc) {
    _id,
    name,
    price,
    description,
    slug,
    inStock,
    featured,
    category->{
      _id,
      name,
      slug
    },
    images[]{
      asset->{
        _id,
        url
      }
    }
  }`,

  // Get single product by slug
  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    price,
    description,
    slug,
    inStock,
    featured,
    features,
    rating,
    reviews,
    category->{
      _id,
      name,
      slug
    },
    images[]{
      asset->{
        _id,
        url
      }
    }
  }`,

  // Get all categories
  allCategories: `*[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description
  }`,

  // Get hero slides
  heroSlides: `*[_type == "heroSlide"] | order(order asc) {
    _id,
    title,
    subtitle,
    ctaText,
    ctaLink,
    image{
      asset->{
        _id,
        url
      }
    }
  }`,
};
