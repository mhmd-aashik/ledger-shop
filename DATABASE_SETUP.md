# Database Integration Setup Guide

## Overview

This guide explains how to set up database integration with Clerk authentication for the LeadHer Shop application.

## What's Been Set Up

### 1. Database Schema

- **Modular Prisma Schema**: Uses individual `.prisma` files in the `prisma/` directory
- **Models Included**:
  - `User` - Basic user information from Clerk
  - `Profile` - Extended user profile data
  - `Address` - Shipping/billing addresses
  - `Product` - E-commerce products
  - `Category` - Product categories
  - `Order` & `OrderItem` - Order management
  - `Favorite` - User favorites
  - `Wishlist` & `WishlistItem` - User wishlists
  - `Review` - Product reviews
  - `RecentlyViewed` - Recently viewed products

### 2. User Actions (`src/lib/actions/user.action.ts`)

Server actions for user database operations:

- `createUser()` - Create new user with profile and wishlist
- `updateUser()` - Update user information
- `getUserByClerkId()` - Fetch user by Clerk ID
- `getCurrentUser()` - Get current authenticated user
- `deleteUser()` - Delete user and related data
- `syncUserFromClerk()` - Sync user data from Clerk to database
- `userExists()` - Check if user exists in database

### 3. Webhook Integration (`src/app/api/webhooks/clerk/route.ts`)

Handles Clerk webhook events:

- `user.created` - Creates user in database
- `user.updated` - Updates user in database
- `user.deleted` - Deletes user from database

### 4. Client-Side Sync (`src/hooks/use-user-sync.ts`)

React hook that automatically syncs user data when they sign in.

### 5. User Sync Provider (`src/components/UserSyncProvider.tsx`)

Wrapper component that handles user synchronization across the app.

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Database
DATABASE_URL="your_database_url_here"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# Or run migrations (for production)
npx prisma migrate dev --name init
```

### 3. Clerk Webhook Configuration

1. Go to your Clerk Dashboard
2. Navigate to Webhooks
3. Create a new webhook endpoint: `https://yourdomain.com/api/webhooks/clerk`
4. Select events: `user.created`, `user.updated`, `user.deleted`
5. Copy the webhook secret to your environment variables

### 4. Test Database Connection

Visit `/api/test-db` to test if the database connection is working.

## How It Works

### User Sign-Up Flow

1. User signs up through Clerk
2. Clerk webhook triggers `user.created` event
3. Webhook handler calls `syncUserFromClerk()`
4. User is created in database with:
   - Basic user information
   - Default profile
   - Default wishlist

### User Sign-In Flow

1. User signs in through Clerk
2. `useUserSync` hook detects authenticated user
3. Calls `syncUserFromClerk()` to ensure data is up-to-date
4. User data is available throughout the app

### Data Synchronization

- **Automatic**: Webhooks handle real-time sync
- **Client-side**: Hook ensures data is current on page load
- **Manual**: Server actions available for custom operations

## Usage Examples

### Get Current User

```typescript
import { getCurrentUser } from "@/lib/actions/user.action";

const { success, user, error } = await getCurrentUser();
if (success) {
  console.log("User:", user);
}
```

### Create User Manually

```typescript
import { createUser } from "@/lib/actions/user.action";

const result = await createUser({
  clerkId: "user_123",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  imageUrl: "https://example.com/avatar.jpg",
});
```

### Update User Profile

```typescript
import { updateUser } from "@/lib/actions/user.action";

const result = await updateUser("user_123", {
  firstName: "Jane",
  lastName: "Smith",
});
```

## Troubleshooting

### Database Connection Issues

1. Check `DATABASE_URL` in environment variables
2. Ensure database is running and accessible
3. Test connection at `/api/test-db`

### Webhook Issues

1. Verify `CLERK_WEBHOOK_SECRET` is correct
2. Check webhook URL is accessible
3. Review webhook logs in Clerk dashboard

### User Sync Issues

1. Check browser console for errors
2. Verify Clerk configuration
3. Test server actions manually

## Next Steps

1. Set up your database (PostgreSQL recommended)
2. Configure Clerk webhooks
3. Test the sign-up flow
4. Customize user profile fields as needed
5. Add additional user-related features (addresses, preferences, etc.)

The database integration is now ready! Users will automatically be synced to your database when they sign up or sign in.
