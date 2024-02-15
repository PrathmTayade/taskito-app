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

export const CreateList = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title is too short",
    }),
  boardId: z.string(),
});

export const CreateCard = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title is too short",
    }),
  boardId: z.string(),
  listId: z.string(),
});
