# Clerk Authentication Setup Guide

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Clerk URLs (optional - will use default if not provided)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Getting Your Clerk Keys

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Go to the "API Keys" section in your Clerk dashboard
4. Copy the "Publishable key" and "Secret key"
5. Add them to your `.env.local` file

## Features Implemented

✅ **Beautiful Authentication UI**

- Custom styled sign-in and sign-up pages
- Branded with your Heritano logo
- Responsive design with gradient backgrounds
- Consistent color scheme with your brand colors

✅ **Header Integration**

- Clean authentication buttons in the header
- Mobile-responsive authentication menu
- User profile dropdown when signed in
- Cart integration maintained

✅ **Middleware Protection**

- Public routes: `/`, `/products`, `/about`, `/contact`, `/sign-in`, `/sign-up`
- Protected routes: `/cart`, `/checkout`, and other authenticated pages
- Automatic redirects for unauthenticated users

✅ **Custom Styling**

- Brand colors (`#6c47ff`) throughout the auth flow
- Consistent typography and spacing
- Smooth transitions and hover effects
- Professional appearance matching your luxury brand

## Next Steps

1. Add your Clerk keys to `.env.local`
2. Test the authentication flow
3. Customize the user profile settings in your Clerk dashboard
4. Set up any additional social providers if needed

Your authentication system is now ready to use! 🎉
