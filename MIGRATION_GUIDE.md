# Migration Guide: Static Data to Sanity

This guide shows how to migrate from your current static product data to Sanity CMS.

## Current Data Structure vs Sanity Schema

### Current Product Type
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  gender?: string;
}
```

### Current ProductItem Type
```typescript
interface ProductItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  video?: string;
  category: string;
  description: string;
  features: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
}
```

### Sanity Schema Fields
The Sanity schema includes all your current fields plus additional ones:
- ✅ **id** → `_id` (Sanity's internal ID)
- ✅ **name** → `name`
- ✅ **price** → `price` + `currency` (now supports LKR, USD, EUR)
- ✅ **image** → `images` (array with alt text)
- ✅ **category** → `category` (matches your current values: "Wallets", "Cardholders", "Accessories")
- ✅ **description** → `description` + `shortDescription`
- ✅ **gender** → `gender` (matches your current values: "Men", "Women", "Unisex")
- ✅ **images** → `images` (array)
- ✅ **video** → `video` (file reference)
- ✅ **features** → `features` (array)
- ✅ **rating** → `rating`
- ✅ **reviews** → `reviewCount`
- ✅ **inStock** → `inStock`

## Migration Steps

### 1. Update Component Imports

**Before:**
```typescript
import { products } from "@/data/products";
```

**After:**
```typescript
import { fetchProducts } from "@/lib/actions/fetch-products.action";
import { sanityToProducts } from "@/lib/utils/sanity-to-product";
```

### 2. Update Component Logic

**Before (ProductGrid.tsx):**
```typescript
export default function ProductGrid() {
  // Static data
  return (
    <div>
      {products.map((product) => (
        // Product rendering
      ))}
    </div>
  );
}
```

**After:**
```typescript
export default async function ProductGrid() {
  // Fetch from Sanity
  const sanityProducts = await fetchProducts();
  const products = sanityToProducts(sanityProducts);
  
  return (
    <div>
      {products.map((product) => (
        // Product rendering (no changes needed)
      ))}
    </div>
  );
}
```

### 3. Update Price Display

**Before:**
```typescript
<span className="text-2xl font-bold text-foreground">
  {product.price} LKR
</span>
```

**After:**
```typescript
<span className="text-2xl font-bold text-foreground">
  {product.price} {sanityProduct.currency}
</span>
```

### 4. Update Product Links

**Before:**
```typescript
<Link href={`/products/${product.id}`}>
```

**After:**
```typescript
<Link href={`/products/${sanityProduct.slug.current}`}>
```

## Component-Specific Updates

### ProductGrid.tsx
- Change from client component to server component (remove "use client")
- Add async/await for data fetching
- Update import statements

### MoreProductsGrid.tsx
- Update filtering logic to work with Sanity data
- Remove duplicate product generation (let Sanity handle this)
- Update search functionality

### AllProductsGrid.tsx
- Similar changes to ProductGrid.tsx
- Update to use Sanity data

### ProductFilters.tsx
- Update category options to match Sanity schema
- Update gender options to match Sanity schema
- Add currency filtering if needed

## Data Migration

### 1. Create Products in Sanity Studio
1. Go to your Sanity Studio
2. Create new products with the following mapping:

| Current Field | Sanity Field | Example Value |
|---------------|--------------|---------------|
| id: "1" | name: "Classic Leather Wallet" | "Classic Leather Wallet" |
| name: "Classic Leather Wallet" | name: "Classic Leather Wallet" | "Classic Leather Wallet" |
| price: 450 | price: 450 | 450 |
| image: "/assets/images/leather1.jpg" | images: [upload image] | Upload leather1.jpg |
| category: "Wallets" | category: "Wallets" | "Wallets" |
| description: "Handcrafted..." | description: "Handcrafted..." | "Handcrafted..." |

### 2. Set Default Values
- **currency**: "LKR" (for all existing products)
- **gender**: "Unisex" (for all existing products)
- **inStock**: true (for all existing products)
- **isFeatured**: false (for most products)
- **isNew**: false (for existing products)

## Testing the Migration

### 1. Test Data Fetching
```typescript
// Test in a component
const products = await fetchProducts();
console.log("Fetched products:", products.length);
```

### 2. Test Utility Functions
```typescript
// Test conversion
const sanityProducts = await fetchProducts();
const convertedProducts = sanityToProducts(sanityProducts);
console.log("Converted products:", convertedProducts);
```

### 3. Test Individual Components
- Verify ProductGrid displays correctly
- Check product links work
- Ensure filtering still works
- Test search functionality

## Rollback Plan

If you need to rollback:
1. Revert component imports back to static data
2. Remove async/await from components
3. Change server components back to client components
4. Keep the Sanity schema for future use

## Benefits After Migration

1. **Content Management**: Easy product updates through Sanity Studio
2. **SEO**: Better SEO with proper slugs and meta fields
3. **Scalability**: Handle more products without code changes
4. **Rich Content**: Support for multiple images, videos, and detailed descriptions
5. **Filtering**: Advanced filtering capabilities
6. **Multi-language**: Easy to add multiple languages later
7. **Analytics**: Track product performance through Sanity

## Next Steps

1. Set up Sanity Studio
2. Create your first products
3. Update one component at a time
4. Test thoroughly
5. Deploy and monitor
