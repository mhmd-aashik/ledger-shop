import { defineField, defineType } from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Hero Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required().min(10).max(200),
    }),
    defineField({
      name: 'images',
      title: 'Hero Images',
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
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'ctaText',
      title: 'Call to Action Text',
      type: 'string',
      initialValue: 'Shop Now',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Call to Action Link',
      type: 'string',
      initialValue: '/products',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'images.0',
    },
  },
})

