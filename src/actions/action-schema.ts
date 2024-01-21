import { z } from "zod";

export const boardFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  image: z
    .string({
      required_error: "Image is required",
      invalid_type_error: "Image is required",
    })
    .min(1, { message: "Please select an image." }),
});
