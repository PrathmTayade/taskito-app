"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { boardFormSchema } from "./action-schema";

export async function createBoard(data: z.infer<typeof boardFormSchema>) {
  const { orgId } = auth();
  const { title, imageId } = boardFormSchema.parse(data);

  await db.taskApp_Board.create({
    data: {
      title: title,
    orgId: orgId as string,
      imageId: imageId as string,
    },
  });
}

export async function getBoards(orgId: string) {
  const boards = await db.taskApp_Board.findMany({
    where: { orgId: orgId },
  });
  return boards;
}
