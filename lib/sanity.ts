import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true, // Set to false if statically generating pages at build time
  apiVersion: '2024-01-01', // Use current date (YYYY-MM-DD) to target the latest API version
})

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client)

// Helper function to generate image URLs
export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ queries
export const queries = {
  // Get all products
  allProducts: `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    description,
    price,
    featured,
    inStock,
    images,
    category->{
      _id,
      name,
      slug
    },
    variants
  }`,

  // Get featured products
  featuredProducts: `*[_type == "product" && featured == true] | order(_createdAt desc) {
    _id,
    name,
    slug,
    description,
    price,
    featured,
    inStock,
    images,
    category->{
      _id,
      name,
      slug
    },
    variants
  }`,

  // Get single product by slug
  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    price,
    featured,
    inStock,
    images,
    category->{
      _id,
      name,
      slug
    },
    variants
  }`,

  // Get all categories
  allCategories: `*[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    image
  }`,

  // Get hero section
  heroSection: `*[_type == "heroSection"][0] {
    _id,
    title,
    subtitle,
    images,
    ctaText,
    ctaLink
  }`,
}

