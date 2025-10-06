# Category Management System Setup

This guide explains how to set up and use the separate category management system for your Sanity CMS.

## Overview

The category management system allows you to:

- Create and manage product categories separately from products
- Set up hierarchical categories (parent/child relationships)
- Control category visibility and ordering
- Use categories as references in products
- Manage category images and SEO data

## Files Created

### 1. Category Schema (`src/sanity/schemaTypes/category.ts`)

A comprehensive category schema with:

- **name**: Category name (required)
- **slug**: URL-friendly identifier (auto-generated)
- **description**: Category description
- **image**: Category image with alt text
- **parentCategory**: Reference to parent category (for subcategories)
- **isActive**: Active/inactive status
- **sortOrder**: Display order
- **seoTitle**: SEO title
- **seoDescription**: SEO description

### 2. Category Actions (`src/lib/actions/fetch-categories.action.ts`)

Functions to fetch and manage categories:

- `fetchCategories()`: Get all categories
- `fetchActiveCategories()`: Get only active categories
- `fetchCategoryBySlug(slug)`: Get category by slug
- `fetchParentCategories()`: Get parent categories only
- `fetchSubcategories(parentId)`: Get subcategories for a parent
- `fetchCategoriesWithChildren()`: Get hierarchical category structure
- `searchCategories(query)`: Search categories
- `getCategoryStats()`: Get category statistics

### 3. Category Utilities (`src/lib/utils/sanity-to-category.ts`)

Utility functions to convert and work with category data:

- `sanityToCategory()`: Convert single category
- `sanityToCategories()`: Convert category array
- `sanityToCategoryWithChildren()`: Convert hierarchical structure
- `flattenCategories()`: Flatten hierarchical structure
- `getParentCategories()`: Get only parent categories
- `getSubcategories()`: Get subcategories for a parent
- `findCategoryBySlug()`: Find category by slug
- `getCategoryBreadcrumb()`: Get breadcrumb path

### 4. Category Components

- `CategoryManager.tsx`: Full category management interface
- `CategorySelector.tsx`: Category selection component for forms

## Setup Instructions

### 1. Deploy Schema to Sanity

1. Go to your Sanity Studio
2. The category schema should automatically appear
3. Create your first categories

### 2. Create Initial Categories

Create these categories in your Sanity Studio:

#### Main Categories:

- **Wallets** (slug: wallets)
- **Cardholders** (slug: cardholders)
- **Accessories** (slug: accessories)
- **Bags** (slug: bags)
- **Belts** (slug: belts)
- **Watches** (slug: watches)

#### Optional Subcategories:

- **Wallets** → **Bifold Wallets**, **Trifold Wallets**
- **Accessories** → **Key Holders**, **Business Card Holders**, **Watch Straps**

### 3. Update Product Schema

The product schema has been updated to use category references instead of strings. This means:

- Products now reference category documents
- You can access full category data from products
- Categories can be managed independently

## Usage Examples

### 1. Display Categories in Components

```typescript
import { fetchActiveCategories } from '@/lib/actions/fetch-categories.action';
import { sanityToCategories } from '@/lib/utils/sanity-to-category';

export default async function CategoriesPage() {
  const sanityCategories = await fetchActiveCategories();
  const categories = sanityToCategories(sanityCategories);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map(category => (
        <div key={category.id} className="border rounded-lg p-4">
          <h3 className="font-semibold">{category.name}</h3>
          <p className="text-sm text-gray-600">{category.description}</p>
          {category.image && (
            <img src={category.image} alt={category.name} className="w-full h-32 object-cover rounded mt-2" />
          )}
        </div>
      ))}
    </div>
  );
}
```

### 2. Use Category Selector in Forms

```typescript
import CategorySelector from '@/components/CategorySelector';

export default function ProductForm() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  return (
    <form>
      <CategorySelector
        value={selectedCategory}
        onChange={setSelectedCategory}
        placeholder="Select a category..."
        showImage={true}
        showDescription={true}
      />
    </form>
  );
}
```

### 3. Filter Products by Category

```typescript
import { fetchProductsByCategory } from '@/lib/actions/fetch-products.action';
import { sanityToProductItems } from '@/lib/utils/sanity-to-product';

export default async function CategoryProductsPage({ params }: { params: { slug: string } }) {
  const products = await fetchProductsByCategory(params.slug);
  const productItems = sanityToProductItems(products);

  return (
    <div>
      <h1>Products in {params.slug}</h1>
      {productItems.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### 4. Display Category Manager

```typescript
import CategoryManager from '@/components/CategoryManager';

export default function AdminCategoriesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      <CategoryManager
        showStats={true}
        showFilters={true}
        showSearch={true}
        viewMode="grid"
      />
    </div>
  );
}
```

## Category Hierarchy Example

```
Accessories (Parent)
├── Key Holders (Child)
├── Business Card Holders (Child)
└── Watch Straps (Child)

Wallets (Parent)
├── Bifold Wallets (Child)
├── Trifold Wallets (Child)
└── Money Clips (Child)
```

## Migration from String Categories

If you have existing products with string categories, you'll need to:

1. **Create categories in Sanity** with the same names as your current string categories
2. **Update product references** to point to the new category documents
3. **Update your components** to use the new category structure

### Migration Script Example

```typescript
// This would be run in your Sanity Studio or as a migration script
const migrateCategories = async () => {
  const products = await client.fetch('*[_type == "product"]');

  for (const product of products) {
    // Find the category document
    const category = await client.fetch(
      '*[_type == "category" && name == $categoryName][0]',
      { categoryName: product.category }
    );

    if (category) {
      // Update the product to reference the category
      await client
        .patch(product._id)
        .set({
          category: {
            _type: "reference",
            _ref: category._id,
          },
        })
        .commit();
    }
  }
};
```

## Benefits

1. **Centralized Management**: Manage all categories in one place
2. **Rich Metadata**: Add images, descriptions, and SEO data to categories
3. **Hierarchical Structure**: Support for parent/child category relationships
4. **Better Performance**: Categories are cached and can be reused
5. **Consistency**: Ensures category names are consistent across products
6. **SEO Friendly**: Each category can have its own SEO optimization
7. **Flexible Filtering**: Easy to filter and search by category
8. **Analytics**: Track category performance and usage

## Next Steps

1. **Create Categories**: Set up your initial categories in Sanity Studio
2. **Update Products**: Link existing products to category references
3. **Update Components**: Modify your product components to use the new structure
4. **Test Functionality**: Ensure all category-related features work correctly
5. **Add Category Pages**: Create dedicated pages for each category
6. **Implement Filtering**: Add category-based filtering to your product grids

## Troubleshooting

### Common Issues:

1. **Categories not showing**: Check if categories are marked as active
2. **Products not linking**: Ensure product category references are correct
3. **Images not loading**: Verify Sanity project ID and dataset in environment variables
4. **Performance issues**: Consider implementing caching for frequently accessed categories

### Debug Tips:

```typescript
// Check if categories are loading
const categories = await fetchActiveCategories();
console.log("Categories loaded:", categories.length);

// Check category structure
const category = await fetchCategoryBySlug("wallets");
console.log("Category data:", category);

// Check category stats
const stats = await getCategoryStats();
console.log("Category stats:", stats);
```
