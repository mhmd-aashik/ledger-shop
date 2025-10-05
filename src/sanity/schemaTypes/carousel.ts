import { defineType, defineField } from "sanity";

export const carousel = defineType({
  name: "carousel",
  title: "Carousel Image",
  type: "document",
  icon: () => "🎠",
  fields: [
    defineField({
      name: "title",
      title: "Image Title",
      type: "string",
      description: "Title for this carousel image",
      validation: (Rule) => Rule.required().min(3).max(50),
    }),
    defineField({
      name: "image",
      title: "Carousel Image",
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order in which this image appears in the carousel",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "Subtitle for this carousel image",
      validation: (Rule) => Rule.max(75),
    }),
    defineField({
      name: "cta",
      title: "Call to Action Text",
      type: "string",
      description: "Button text for the call to action",
      validation: (Rule) => Rule.max(30),
    }),
    defineField({
      name: "ctaLink",
      title: "Call to Action Link",
      type: "string",
      description: "URL or path for the button (e.g., /products, /about)",
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: "isActive",
      title: "Active Image",
      type: "boolean",
      description: "Whether this image is currently displayed",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "order",
      media: "image",
      isActive: "isActive",
    },
    prepare(selection) {
      const { title, subtitle, isActive } = selection;
      const activeText = isActive ? " (Active)" : "";
      return {
        title: `${title}${activeText}`,
        subtitle: `Order: ${subtitle}`,
        media: selection.media,
      };
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Active First",
      name: "activeFirst",
      by: [{ field: "isActive", direction: "desc" }],
    },
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
