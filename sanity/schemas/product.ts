import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(10).max(500),
    }),
    defineField({
      name: 'price',
      title: 'Price (LKR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: { type: 'category' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility.',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'variants',
      title: 'Product Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Variant Name',
              type: 'string',
            },
            {
              name: 'price',
              title: 'Price (LKR)',
              type: 'number',
            },
            {
              name: 'inStock',
              title: 'In Stock',
              type: 'boolean',
              initialValue: true,
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.name',
      media: 'images.0',
    },
  },
})

