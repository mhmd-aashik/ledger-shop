import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";

// Import schemas
import product from "./schemas/product";
import category from "./schemas/category";
import heroSlide from "./schemas/heroSlide";

export default defineConfig({
  name: "leadher-shop",
  title: "LeadHer Shop CMS",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [deskTool(), visionTool()],

  schema: {
    types: [product, category, heroSlide],
  },
});
