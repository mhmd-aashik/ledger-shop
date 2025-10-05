import { type SchemaTypeDefinition } from "sanity";
import { review } from "./review";
import { carousel } from "./carousel";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [review, carousel],
};
