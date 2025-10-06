import {
  SanityCategory,
  CategoryWithChildren,
} from "@/lib/actions/fetch-categories.action";

export interface SimpleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder?: number;
  children?: SimpleCategory[];
  level?: number;
}

/**
 * Converts Sanity category data to a simple category format
 */
export const sanityToCategory = (
  sanityCategory: SanityCategory
): SimpleCategory => {
  return {
    id: sanityCategory._id,
    name: sanityCategory.name,
    slug: sanityCategory.slug.current,
    description: sanityCategory.description,
    image: sanityCategory.image?.asset?._ref
      ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${sanityCategory.image.asset._ref.split("-")[1]}.${sanityCategory.image.asset._ref.split("-")[2]}`
      : undefined,
    parentId: sanityCategory.parentCategory?._ref,
    isActive: sanityCategory.isActive,
    sortOrder: sanityCategory.sortOrder,
  };
};

/**
 * Converts Sanity category with children to simple format
 */
export const sanityToCategoryWithChildren = (
  sanityCategory: CategoryWithChildren
): SimpleCategory => {
  return {
    id: sanityCategory._id,
    name: sanityCategory.name,
    slug: sanityCategory.slug.current,
    description: sanityCategory.description,
    image: sanityCategory.image?.asset?._ref
      ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${sanityCategory.image.asset._ref.split("-")[1]}.${sanityCategory.image.asset._ref.split("-")[2]}`
      : undefined,
    parentId: sanityCategory.parentCategory?._ref,
    isActive: sanityCategory.isActive,
    sortOrder: sanityCategory.sortOrder,
    children: sanityCategory.children?.map(sanityToCategoryWithChildren),
  };
};

/**
 * Converts an array of Sanity categories to simple format
 */
export const sanityToCategories = (
  sanityCategories: SanityCategory[]
): SimpleCategory[] => {
  return sanityCategories.map(sanityToCategory);
};

/**
 * Converts an array of Sanity categories with children to simple format
 */
export const sanityToCategoriesWithChildren = (
  sanityCategories: CategoryWithChildren[]
): SimpleCategory[] => {
  return sanityCategories.map(sanityToCategoryWithChildren);
};

/**
 * Flattens a hierarchical category structure into a flat array
 */
export const flattenCategories = (
  categories: SimpleCategory[]
): SimpleCategory[] => {
  const result: SimpleCategory[] = [];

  const flatten = (cats: SimpleCategory[], level = 0) => {
    cats.forEach((cat) => {
      result.push({ ...cat, level });
      if (cat.children && cat.children.length > 0) {
        flatten(cat.children, level + 1);
      }
    });
  };

  flatten(categories);
  return result;
};

/**
 * Gets only parent categories (no children)
 */
export const getParentCategories = (
  categories: SimpleCategory[]
): SimpleCategory[] => {
  return categories.filter((cat) => !cat.parentId);
};

/**
 * Gets subcategories for a specific parent
 */
export const getSubcategories = (
  categories: SimpleCategory[],
  parentId: string
): SimpleCategory[] => {
  return categories.filter((cat) => cat.parentId === parentId);
};

/**
 * Finds a category by slug in a flat array
 */
export const findCategoryBySlug = (
  categories: SimpleCategory[],
  slug: string
): SimpleCategory | undefined => {
  return categories.find((cat) => cat.slug === slug);
};

/**
 * Gets the breadcrumb path for a category
 */
export const getCategoryBreadcrumb = (
  categories: SimpleCategory[],
  categoryId: string
): SimpleCategory[] => {
  const breadcrumb: SimpleCategory[] = [];
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  let currentId = categoryId;
  while (currentId) {
    const category = categoryMap.get(currentId);
    if (!category) break;

    breadcrumb.unshift(category);
    currentId = category.parentId || "";
  }

  return breadcrumb;
};
