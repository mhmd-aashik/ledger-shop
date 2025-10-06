# Database Configuration

## Environment Variables Required

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/leadher_shop?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

1. Install PostgreSQL locally or use a cloud service like Supabase, PlanetScale, or Neon
2. Create a database named `leadher_shop`
3. Update the `DATABASE_URL` in your `.env` file
4. Run the following commands:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database (optional)
npx prisma db seed
```

## Prisma Models Created

✅ **User Models:**

- `User` - Basic user authentication data
- `Profile` - Extended user profile information
- `Address` - User shipping and billing addresses

✅ **Product Models:**

- `Product` - E-commerce products with full details
- `Category` - Product categories with hierarchy

✅ **Favorites & Wishlists:**

- `Favorite` - User favorite products
- `Wishlist` - User wishlists
- `WishlistItem` - Items in wishlists

✅ **Orders & Checkout:**

- `Order` - Customer orders with full details
- `OrderItem` - Individual items in orders

✅ **Reviews & Activity:**

- `Review` - Product reviews and ratings
- `RecentlyViewed` - Track recently viewed products

## Features Included

- **Profile Management**: Complete user profiles with preferences
- **Favorites System**: Save favorite products
- **Wishlist Management**: Create and manage multiple wishlists
- **Order Management**: Full order lifecycle with status tracking
- **Address Management**: Multiple shipping/billing addresses
- **Product Reviews**: Rating and review system
- **Recently Viewed**: Track user browsing history
- **Inventory Management**: Stock tracking and low stock alerts
- **SEO Support**: Meta titles and descriptions
- **Flexible Pricing**: Regular, compare-at, and cost prices
