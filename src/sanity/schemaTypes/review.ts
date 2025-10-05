import { defineType, defineField } from "sanity";

export const review = defineType({
  name: "review",
  title: "Customer Review",
  type: "document",
  icon: () => "⭐",
  fields: [
    defineField({
      name: "name",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(50),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "City, Country (e.g., New York, USA)",
    }),
    defineField({
      name: "description",
      title: "Review Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(500),
    }),
    defineField({
      name: "rating",
      title: "Star Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
      options: {
        list: [
          { title: "1 Star", value: 1 },
          { title: "2 Stars", value: 2 },
          { title: "3 Stars", value: 3 },
          { title: "4 Stars", value: 4 },
          { title: "5 Stars", value: 5 },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "image",
      title: "Customer Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "image",
      rating: "rating",
      location: "location",
    },
    prepare(selection) {
      const { title, subtitle, rating, location } = selection;
      const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
      const locationText = location ? ` • ${location}` : "";

      return {
        title: `${title} (${stars})`,
        subtitle: `${subtitle?.substring(0, 80)}...${locationText}`,
        media: selection.media,
      };
    },
  },
  orderings: [
    {
      title: "Highest Rating",
      name: "ratingDesc",
      by: [{ field: "rating", direction: "desc" }],
    },
    {
      title: "Lowest Rating",
      name: "ratingAsc",
      by: [{ field: "rating", direction: "asc" }],
    },
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
  ],
});


// sanity query get all reviews
// export const getReviews = async () => {
//   const reviews = await client.fetch(`*[_type == "review"]`);
//   return reviews;
// };