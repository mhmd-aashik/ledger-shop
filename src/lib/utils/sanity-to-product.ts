import { SanityProduct } from "@/lib/actions/fetch-products.action";
import { Product, ProductItem } from "@/types/products.types";

/**
 * Converts Sanity product data to the existing Product type
 */
export const sanityToProduct = (sanityProduct: SanityProduct): Product => {
  return {
    id: sanityProduct._id,
    name: sanityProduct.name,
    price: sanityProduct.price,
    image: sanityProduct.images?.[0]?.asset?._ref
      ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${sanityProduct.images[0].asset._ref.split("-")[1]}.${sanityProduct.images[0].asset._ref.split("-")[2]}`
      : "/assets/images/placeholder.jpg",
    category: sanityProduct.category.name,
    description: sanityProduct.shortDescription || sanityProduct.description,
    gender: sanityProduct.gender,
  };
};

/**
 * Converts Sanity product data to the existing ProductItem type
 */
export const sanityToProductItem = (
  sanityProduct: SanityProduct
): ProductItem => {
  // Convert Sanity image references to URLs
  const images = sanityProduct.images?.map((img) =>
    img.asset?._ref
      ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${img.asset._ref.split("-")[1]}.${img.asset._ref.split("-")[2]}`
      : "/assets/images/placeholder.jpg"
  ) || ["/assets/images/placeholder.jpg"];

  // Convert video reference to URL if exists
  const video = sanityProduct.video?.asset?._ref
    ? `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${sanityProduct.video.asset._ref.split("-")[1]}.${sanityProduct.video.asset._ref.split("-")[2]}`
    : undefined;

  return {
    id: sanityProduct._id,
    name: sanityProduct.name,
    price: sanityProduct.price,
    images,
    video,
    category: sanityProduct.category.name,
    description: sanityProduct.description,
    features: sanityProduct.features || [],
    rating: sanityProduct.rating || 0,
    reviews: sanityProduct.reviewCount || 0,
    inStock: sanityProduct.inStock,
  };
};

/**
 * Converts an array of Sanity products to Product array
 */
export const sanityToProducts = (
  sanityProducts: SanityProduct[]
): Product[] => {
  return sanityProducts.map(sanityToProduct);
};

/**
 * Converts an array of Sanity products to ProductItem array
 */
export const sanityToProductItems = (
  sanityProducts: SanityProduct[]
): ProductItem[] => {
  return sanityProducts.map(sanityToProductItem);
};
