"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const CreateBoard = z.object({
  title: z.string(),
  orgId: z.string(),
  imageId: z.string(),
});

export async function createBoard(data: any) {
  const { title, imageId, orgId } = CreateBoard.parse(data);
  await db.taskApp_Board.create({
    data: {
      title: title,
      orgId: orgId,
      imageId: imageId,
    },
  });
}

export async function getBoards(orgId: string) {
  const boards = await db.taskApp_Board.findMany({
    where: { orgId: orgId },
  });
  return boards
}
