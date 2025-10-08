import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  title: z
    .string()
    .max(100, "Title must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment must be 1000 characters or less"),
  isPublic: z.boolean().optional().default(true),
});

export const reviewUpdateSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars")
    .optional(),
  title: z.string().max(100, "Title must be 100 characters or less").optional(),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment must be 1000 characters or less")
    .optional(),
  isPublic: z.boolean().optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ReviewUpdateData = z.infer<typeof reviewUpdateSchema>;

// Validation helper functions
export const validateReview = (data: unknown) => {
  try {
    return { success: true, data: reviewSchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ field: "general", message: "Invalid data format" }],
    };
  }
};

export const validateReviewUpdate = (data: unknown) => {
  try {
    return { success: true, data: reviewUpdateSchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ field: "general", message: "Invalid data format" }],
    };
  }
};
