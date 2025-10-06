# Sanity Products Schema Setup

This document outlines the Sanity schema setup for the products grid in the LeadHer Shop application.

## Schema Files Created

### 1. Product Schema (`src/sanity/schemaTypes/product.ts`)
A comprehensive product schema with the following fields:

#### Basic Information
- **name**: Product name (required, 3-100 characters)
- **slug**: URL-friendly identifier (auto-generated from name)
- **price**: Product price (required, minimum 0)
- **originalPrice**: Original price before discount (optional)

#### Media
- **images**: Array of product images with alt text (1-10 images)
- **video**: Optional product video file

#### Categorization
- **category**: Main product category (dropdown: wallets, cardholders, accessories, bags, belts, watches)
- **subcategory**: Optional subcategory for better organization
- **gender**: Target gender (unisex, men, women)

#### Descriptions
- **description**: Full product description (20-500 characters)
- **shortDescription**: Brief description for product cards (max 100 characters)

#### Product Details
- **features**: Array of key product features
- **materials**: Array of materials used
- **dimensions**: Object with length, width, height (in cm)
- **weight**: Product weight in grams
- **color**: Primary color
- **availableColors**: Array of all available colors

#### Inventory & Status
- **inStock**: Boolean for stock availability
- **stockQuantity**: Number of items in stock
- **isFeatured**: Featured product flag
- **isNew**: New product flag
- **isOnSale**: Sale status flag
- **saleEndDate**: Optional sale end date

#### Reviews & Ratings
- **rating**: Average customer rating (0-5)
- **reviewCount**: Number of reviews

#### SEO & Organization
- **tags**: Search tags array
- **seoTitle**: SEO-optimized title
- **seoDescription**: SEO-optimized description
- **relatedProducts**: Array of related product references

### 2. Category Schema (`src/sanity/schemaTypes/category.ts`)
A category schema for better product organization:

- **name**: Category name
- **slug**: URL-friendly identifier
- **description**: Category description
- **image**: Category image with alt text
- **parentCategory**: Optional parent category for subcategories
- **isActive**: Active status
- **sortOrder**: Display order
- **seoTitle**: SEO title
- **seoDescription**: SEO description

## API Actions

### Product Fetching Functions (`src/lib/actions/fetch-products.action.ts`)

#### Available Functions:
1. **`fetchProducts()`**: Get all products
2. **`fetchProductBySlug(slug)`**: Get single product by slug
3. **`fetchFeaturedProducts()`**: Get featured products only
4. **`fetchProductsByCategory(category)`**: Get products by category
5. **`fetchNewProducts()`**: Get new products only
6. **`fetchOnSaleProducts()`**: Get products on sale

#### Type Definitions:
- **`SanityProduct`**: Complete type definition for Sanity product data

## Utility Functions

### Data Conversion (`src/lib/utils/sanity-to-product.ts`)

#### Available Functions:
1. **`sanityToProduct(sanityProduct)`**: Convert to existing `Product` type
2. **`sanityToProductItem(sanityProduct)`**: Convert to existing `ProductItem` type
3. **`sanityToProducts(sanityProducts)`**: Convert array to `Product[]`
4. **`sanityToProductItems(sanityProducts)`**: Convert array to `ProductItem[]`

## Usage Examples

### Fetching Products in Components

```typescript
import { fetchProducts, fetchFeaturedProducts } from '@/lib/actions/fetch-products.action';
import { sanityToProducts, sanityToProductItems } from '@/lib/utils/sanity-to-product';

// Fetch all products
const sanityProducts = await fetchProducts();
const products = sanityToProducts(sanityProducts);

// Fetch featured products
const featuredSanityProducts = await fetchFeaturedProducts();
const featuredProducts = sanityToProductItems(featuredSanityProducts);
```

### Using in Product Grid Component

```typescript
import { fetchProducts } from '@/lib/actions/fetch-products.action';
import { sanityToProductItems } from '@/lib/utils/sanity-to-product';

export default async function ProductsPage() {
  const sanityProducts = await fetchProducts();
  const products = sanityToProductItems(sanityProducts);
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Environment Variables Required

Make sure these environment variables are set in your `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Schema Features

### Ordering Options
The product schema includes multiple ordering options:
- Name A-Z / Z-A
- Price Low to High / High to Low
- Rating High to Low
- Featured First
- Newest First

### Preview Configuration
- Shows product name, category, price, and stock status
- Displays product image
- Indicates if product is featured

### Validation Rules
- Required fields are properly validated
- String length limits are enforced
- Number ranges are validated
- Array limits are set where appropriate

## Next Steps

1. **Deploy Schema**: Deploy the schema to your Sanity studio
2. **Add Products**: Start adding products through the Sanity studio
3. **Update Components**: Update existing product components to use the new Sanity data
4. **Test Integration**: Test the product fetching and display functionality

## Migration from Static Data

The utility functions are designed to work with your existing `Product` and `ProductItem` types, making migration seamless. You can gradually replace static data with Sanity data without breaking existing components.
