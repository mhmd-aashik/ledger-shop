import { defineType, defineField } from "sanity";

export const category = defineType({
  name: "category",
  title: "Product Category",
  type: "document",
  icon: () => "📂",
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(50),
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
      name: "description",
      title: "Category Description",
      type: "text",
      rows: 3,
      description: "Brief description of this category",
    }),
    defineField({
      name: "image",
      title: "Category Image",
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
    }),
    defineField({
      name: "parentCategory",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Optional parent category for subcategories",
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Whether this category is currently active",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Order in which this category appears",
      validation: (Rule) => Rule.min(0),
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
      rows: 2,
      description: "Description for search engines",
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "image",
      isActive: "isActive",
    },
    prepare(selection) {
      const { title, subtitle, isActive } = selection;
      const activeText = isActive ? "" : " (Inactive)";
      
      return {
        title: `${title}${activeText}`,
        subtitle: subtitle || "No description",
        media: selection.media,
      };
    },
  },
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Active First",
      name: "activeFirst",
      by: [{ field: "isActive", direction: "desc" }],
    },
  ],
});
