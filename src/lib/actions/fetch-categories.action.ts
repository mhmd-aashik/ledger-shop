import { client } from "@/sanity/lib/client";

export interface SanityCategory {
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
  parentCategory?: {
    _ref: string;
    _type: "reference";
  };
  isActive: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface CategoryWithChildren extends SanityCategory {
  children?: CategoryWithChildren[];
}

/**
 * Fetch all categories
 */
export const fetchCategories = async (): Promise<SanityCategory[]> => {
  try {
    const categories = await client.fetch(`
      *[_type == "category"] | order(sortOrder asc, name asc) {
        _id,
        name,
        slug,
        description,
        image,
        parentCategory,
        isActive,
        sortOrder,
        seoTitle,
        seoDescription,
        _createdAt,
        _updatedAt
      }
    `);

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

/**
 * Fetch only active categories
 */
export const fetchActiveCategories = async (): Promise<SanityCategory[]> => {
  try {
    const categories = await client.fetch(`
      *[_type == "category" && isActive == true] | order(sortOrder asc, name asc) {
        _id,
        name,
        slug,
        description,
        image,
        parentCategory,
        isActive,
        sortOrder,
        seoTitle,
        seoDescription,
        _createdAt,
        _updatedAt
      }
    `);

    return categories;
  } catch (error) {
    console.error("Error fetching active categories:", error);
    return [];
  }
};

/**
 * Fetch category by slug
 */
export const fetchCategoryBySlug = async (
  slug: string
): Promise<SanityCategory | null> => {
  try {
    const category = await client.fetch(
      `
      *[_type == "category" && slug.current == $slug][0] {
        _id,
        name,
        slug,
        description,
        image,
        parentCategory,
        isActive,
        sortOrder,
        seoTitle,
        seoDescription,
        _createdAt,
        _updatedAt
      }
    `,
      { slug }
    );

    return category || null;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }
};

/**
 * Fetch parent categories only (no subcategories)
 */
export const fetchParentCategories = async (): Promise<SanityCategory[]> => {
  try {
    const categories = await client.fetch(`
      *[_type == "category" && isActive == true && !defined(parentCategory)] | order(sortOrder asc, name asc) {
        _id,
        name,
        slug,
        description,
        image,
        parentCategory,
        isActive,
        sortOrder,
        seoTitle,
        seoDescription,
        _createdAt,
        _updatedAt
      }
    `);

    return categories;
  } catch (error) {
    console.error("Error fetching parent categories:", error);
    return [];
  }
};

/**
 * Fetch subcategories for a specific parent category
 */
export const fetchSubcategories = async (
  parentId: string
): Promise<SanityCategory[]> => {
  try {
    const categories = await client.fetch(
      `
      *[_type == "category" && isActive == true && parentCategory._ref == $parentId] | order(sortOrder asc, name asc) {
        _id,
        name,
        slug,
        description,
        image,
        parentCategory,
        isActive,
        sortOrder,
        seoTitle,
        seoDescription,
        _createdAt,
        _updatedAt
      }
    `,
      { parentId }
    );

    return categories;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};

/**
 * Fetch categories with their children (hierarchical structure)
 */
export const fetchCategoriesWithChildren = async (): Promise<
  CategoryWithChildren[]
> => {
  try {
    const categories = await client.fetch(`
      *[_type == "category" && isActive == true] | order(sortOrder asc, name asc) {
        _id,
        name,
        slug,
        description,
        image,
        parentCategory,
        isActive,
        sortOrder,
        seoTitle,
        seoDescription,
        _createdAt,
        _updatedAt
      }
    `);

    // Build hierarchical structure
    const categoryMap = new Map<string, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: create all category objects
    categories.forEach((category: SanityCategory) => {
      categoryMap.set(category._id, { ...category, children: [] });
    });

    // Second pass: build hierarchy
    categories.forEach((category: SanityCategory) => {
      const categoryWithChildren = categoryMap.get(category._id)!;

      if (category.parentCategory) {
        const parent = categoryMap.get(category.parentCategory._ref);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  } catch (error) {
    console.error("Error fetching categories with children:", error);
    return [];
  }
};

/**
 * Search categories by name or description
 */
export const searchCategories = async (
  query: string
): Promise<SanityCategory[]> => {
  try {
    const categories = await client.fetch(
      `
      *[_type == "category" && isActive == true && (
        name match $query ||
        description match $query
      )] | order(sortOrder asc, name asc) {
        _id,
        name,
        slug,
        description,
        image,
        parentCategory,
        isActive,
        sortOrder,
        seoTitle,
        seoDescription,
        _createdAt,
        _updatedAt
      }
    `,
      { query: `*${query}*` } as Record<string, string>
    );

    return categories;
  } catch (error) {
    console.error("Error searching categories:", error);
    return [];
  }
};

/**
 * Get category statistics
 */
export const getCategoryStats = async () => {
  try {
    const stats = await client.fetch(`
      {
        "totalCategories": count(*[_type == "category"]),
        "activeCategories": count(*[_type == "category" && isActive == true]),
        "inactiveCategories": count(*[_type == "category" && isActive == false]),
        "parentCategories": count(*[_type == "category" && isActive == true && !defined(parentCategory)]),
        "subcategories": count(*[_type == "category" && isActive == true && defined(parentCategory)])
      }
    `);

    return stats;
  } catch (error) {
    console.error("Error fetching category stats:", error);
    return {
      totalCategories: 0,
      activeCategories: 0,
      inactiveCategories: 0,
      parentCategories: 0,
      subcategories: 0,
    };
  }
};
