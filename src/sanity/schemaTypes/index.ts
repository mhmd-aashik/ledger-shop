import { type SchemaTypeDefinition } from "sanity";
import { review } from "./review";
import { carousel } from "./carousel";
import { product } from "./product";
import { category } from "./category";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [review, carousel, product, category],
};
