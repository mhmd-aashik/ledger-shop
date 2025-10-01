# Sanity Studio Setup Guide

## Quick Start

### 1. Set up Environment Variables
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

### 2. Create a Sanity Project
1. Go to [sanity.io](https://sanity.io)
2. Create a new project
3. Copy your Project ID and Dataset name
4. Add them to your `.env.local` file

### 3. Run the Studio
```bash
npm run studio
```

Then visit: `http://localhost:3333/studio`

## Alternative: Use Sanity CLI

If you prefer to use the Sanity CLI:

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Initialize studio (if not already done)
sanity init

# Start studio
sanity start
```

## Content Types Available

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

## Troubleshooting

### "Tool not found: studio"
- Make sure you have the correct packages installed
- Check that your environment variables are set
- Try running `npm run studio` instead

### Studio not loading
- Check your Project ID and Dataset in `.env.local`
- Make sure the Sanity project exists
- Check the browser console for errors

### No content showing
- The studio will work even without content
- Add some sample data to test
- Check the Vision tool for GROQ queries
