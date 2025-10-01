# Sanity CMS Setup Guide

## 1. Create a Sanity Project

1. Go to [sanity.io](https://sanity.io) and create an account
2. Create a new project
3. Note down your Project ID and Dataset name

## 2. Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

## 3. Install Sanity CLI (Optional)

```bash
npm install -g @sanity/cli
```

## 4. Initialize Sanity Studio (Optional)

```bash
npx sanity init
```

## 5. Deploy Schemas

The schemas are already configured in this project. You can:

1. Use the Sanity Studio at `/studio` route
2. Or manually add content via the Sanity dashboard

## 6. Content Structure

### Products
- Name, Price (LKR), Description
- Category reference
- Multiple images
- Stock status, Featured flag
- Rating and reviews

### Categories
- Name, Slug, Description

### Hero Slides
- Title, Subtitle, CTA text and link
- Background image
- Display order

## 7. Fallback Data

The application includes fallback data if Sanity is not configured, so it will work out of the box.

## 8. Image Optimization

Images are automatically optimized using Sanity's image URL builder with responsive sizing.