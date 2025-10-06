import { client } from "@/sanity/lib/client";

export interface SanityProduct {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  price: number;
  currency: string;
  originalPrice?: number;
  images: Array<{
    _key: string;
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  }>;
  video?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
  category: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
    description?: string;
    image?: {
      asset: {
        _ref: string;
        _type: "reference";
      };
      alt?: string;
    };
  };
  subcategory?: string;
  description: string;
  shortDescription?: string;
  features?: string[];
  materials?: string[];
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  weight?: number;
  color?: string;
  availableColors?: string[];
  gender: "unisex" | "men" | "women";
  inStock: boolean;
  stockQuantity?: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  saleEndDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  relatedProducts?: Array<{
    _ref: string;
    _type: "reference";
  }>;
  _createdAt: string;
  _updatedAt: string;
}

export const fetchProducts = async (): Promise<SanityProduct[]> => {
  try {
    const products = await client.fetch(`
      *[_type == "product"] | order(_createdAt desc) {
        _id,
        name,
        slug,
        price,
        currency,
        originalPrice,
        images,
        video,
        category->{
          _id,
          name,
          slug,
          description,
          image
        },
        subcategory,
        description,
        shortDescription,
        features,
        materials,
        dimensions,
        weight,
        color,
        availableColors,
        gender,
        inStock,
        stockQuantity,
        rating,
        reviewCount,
        tags,
        isFeatured,
        isNew,
        isOnSale,
        saleEndDate,
        seoTitle,
        seoDescription,
        relatedProducts,
        _createdAt,
        _updatedAt
      }
    `);

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const fetchProductBySlug = async (
  slug: string
): Promise<SanityProduct | null> => {
  try {
    const product = await client.fetch(
      `
      *[_type == "product" && slug.current == $slug][0] {
        _id,
        name,
        slug,
        price,
        currency,
        originalPrice,
        images,
        video,
        category->{
          _id,
          name,
          slug,
          description,
          image
        },
        subcategory,
        description,
        shortDescription,
        features,
        materials,
        dimensions,
        weight,
        color,
        availableColors,
        gender,
        inStock,
        stockQuantity,
        rating,
        reviewCount,
        tags,
        isFeatured,
        isNew,
        isOnSale,
        saleEndDate,
        seoTitle,
        seoDescription,
        relatedProducts,
        _createdAt,
        _updatedAt
      }
    `,
      { slug }
    );

    return product || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

export const fetchFeaturedProducts = async (): Promise<SanityProduct[]> => {
  try {
    const products = await client.fetch(`
      *[_type == "product" && isFeatured == true] | order(_createdAt desc) {
        _id,
        name,
        slug,
        price,
        currency,
        originalPrice,
        images,
        video,
        category->{
          _id,
          name,
          slug,
          description,
          image
        },
        subcategory,
        description,
        shortDescription,
        features,
        materials,
        dimensions,
        weight,
        color,
        availableColors,
        gender,
        inStock,
        stockQuantity,
        rating,
        reviewCount,
        tags,
        isFeatured,
        isNew,
        isOnSale,
        saleEndDate,
        seoTitle,
        seoDescription,
        relatedProducts,
        _createdAt,
        _updatedAt
      }
    `);

    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

export const fetchProductsByCategory = async (
  category: string
): Promise<SanityProduct[]> => {
  try {
    const products = await client.fetch(
      `
      *[_type == "product" && category == $category] | order(_createdAt desc) {
        _id,
        name,
        slug,
        price,
        currency,
        originalPrice,
        images,
        video,
        category->{
          _id,
          name,
          slug,
          description,
          image
        },
        subcategory,
        description,
        shortDescription,
        features,
        materials,
        dimensions,
        weight,
        color,
        availableColors,
        gender,
        inStock,
        stockQuantity,
        rating,
        reviewCount,
        tags,
        isFeatured,
        isNew,
        isOnSale,
        saleEndDate,
        seoTitle,
        seoDescription,
        relatedProducts,
        _createdAt,
        _updatedAt
      }
    `,
      { category }
    );

    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

export const fetchNewProducts = async (): Promise<SanityProduct[]> => {
  try {
    const products = await client.fetch(`
      *[_type == "product" && isNew == true] | order(_createdAt desc) {
        _id,
        name,
        slug,
        price,
        currency,
        originalPrice,
        images,
        video,
        category->{
          _id,
          name,
          slug,
          description,
          image
        },
        subcategory,
        description,
        shortDescription,
        features,
        materials,
        dimensions,
        weight,
        color,
        availableColors,
        gender,
        inStock,
        stockQuantity,
        rating,
        reviewCount,
        tags,
        isFeatured,
        isNew,
        isOnSale,
        saleEndDate,
        seoTitle,
        seoDescription,
        relatedProducts,
        _createdAt,
        _updatedAt
      }
    `);

    return products;
  } catch (error) {
    console.error("Error fetching new products:", error);
    return [];
  }
};

export const fetchOnSaleProducts = async (): Promise<SanityProduct[]> => {
  try {
    const products = await client.fetch(`
      *[_type == "product" && isOnSale == true] | order(_createdAt desc) {
        _id,
        name,
        slug,
        price,
        currency,
        originalPrice,
        images,
        video,
        category->{
          _id,
          name,
          slug,
          description,
          image
        },
        subcategory,
        description,
        shortDescription,
        features,
        materials,
        dimensions,
        weight,
        color,
        availableColors,
        gender,
        inStock,
        stockQuantity,
        rating,
        reviewCount,
        tags,
        isFeatured,
        isNew,
        isOnSale,
        saleEndDate,
        seoTitle,
        seoDescription,
        relatedProducts,
        _createdAt,
        _updatedAt
      }
    `);

    return products;
  } catch (error) {
    console.error("Error fetching on-sale products:", error);
    return [];
  }
};
