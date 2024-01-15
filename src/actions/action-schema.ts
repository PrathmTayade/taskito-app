import { z } from "zod";

export const boardFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  imageId: z.optional(z.string()),
});
