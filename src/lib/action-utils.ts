"use server";

import { revalidatePath } from "next/cache";

export const revalidatePathFromServer = (
  path: string,
  type?: "layout" | "page"
) => {
  console.log("revalidated Path", path);
  revalidatePath(path, type);
};
