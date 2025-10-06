import { defineType, defineField } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: () => "🛍️",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      options: {
        list: [
          { title: "LKR (Sri Lankan Rupees)", value: "LKR" },
          { title: "USD (US Dollars)", value: "USD" },
          { title: "EUR (Euros)", value: "EUR" },
        ],
        layout: "radio",
      },
      initialValue: "LKR",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "originalPrice",
      title: "Original Price",
      type: "number",
      description: "Original price before discount (optional)",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "images",
      title: "Product Images (Max 3)",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
              description: "Important for accessibility",
            },
          ],
        },
      ],
      description:
        "Upload up to 3 product images. First image will be used as the main product image.",
      validation: (Rule) => Rule.required().min(1).max(3),
    }),
    defineField({
      name: "video",
      title: "Product Video",
      type: "file",
      options: {
        accept: "video/*",
      },
      description: "Optional product video (MP4, WebM, etc.)",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Subcategory",
      type: "string",
      description: "Optional subcategory for better organization",
    }),
    defineField({
      name: "description",
      title: "Product Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(20).max(500),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "string",
      description: "Brief description for product cards",
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: "features",
      title: "Product Features",
      type: "array",
      of: [{ type: "string" }],
      description: "Key features and benefits of the product",
      validation: (Rule) => Rule.max(10),
    }),

    defineField({
      name: "weight",
      title: "Weight (grams)",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "Primary color of the product",
    }),
    defineField({
      name: "availableColors",
      title: "Available Colors",
      type: "array",
      of: [{ type: "string" }],
      description: "All available color options",
    }),
    defineField({
      name: "gender",
      title: "Gender",
      type: "string",
      options: {
        list: [
          { title: "Unisex", value: "Unisex" },
          { title: "Men", value: "Men" },
          { title: "Women", value: "Women" },
        ],
        layout: "radio",
      },
      initialValue: "Unisex",
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "stockQuantity",
      title: "Stock Quantity",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "rating",
      title: "Average Rating",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5),
      description: "Average customer rating (0-5)",
    }),
    defineField({
      name: "reviewCount",
      title: "Number of Reviews",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Search tags for the product",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Show this product in featured sections",
      initialValue: false,
    }),
    defineField({
      name: "isNew",
      title: "New Product",
      type: "boolean",
      description: "Mark as new product",
      initialValue: false,
    }),
    defineField({
      name: "isOnSale",
      title: "On Sale",
      type: "boolean",
      description: "Product is currently on sale",
      initialValue: false,
    }),
    defineField({
      name: "saleEndDate",
      title: "Sale End Date",
      type: "datetime",
      description: "When the sale ends (optional)",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Title for search engines",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description: "Description for search engines",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "relatedProducts",
      title: "Related Products",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
      description: "Products related to this one",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "images.0",
      price: "price",
      inStock: "inStock",
      isFeatured: "isFeatured",
    },
    prepare(selection) {
      const { title, subtitle, price, inStock, isFeatured } = selection;
      const stockStatus = inStock ? "In Stock" : "Out of Stock";
      const featuredText = isFeatured ? " ⭐" : "";

      return {
        title: `${title}${featuredText}`,
        subtitle: `${subtitle} • $${price} • ${stockStatus}`,
        media: selection.media,
      };
    },
  },
  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Name Z-A",
      name: "nameDesc",
      by: [{ field: "name", direction: "desc" }],
    },
    {
      title: "Price Low to High",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
    {
      title: "Price High to Low",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
    {
      title: "Rating High to Low",
      name: "ratingDesc",
      by: [{ field: "rating", direction: "desc" }],
    },
    {
      title: "Featured First",
      name: "featuredFirst",
      by: [{ field: "isFeatured", direction: "desc" }],
    },
    {
      title: "Newest First",
      name: "newestFirst",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});
