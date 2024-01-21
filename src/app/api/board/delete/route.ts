import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { orgId } = auth();
    if (!orgId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id: boardId } = body;

    // check if board exists
    const boardExists = await db.taskApp_Board.findFirst({
      where: {
        id: boardId as string,
        orgId,
      },
    });

    if (!boardExists) {
      return new Response("Board does not exist", { status: 404 });
    }

    // delete board
    await db.taskApp_Board.delete({
      where: {
        id: boardId as string,
        orgId,
      },
    });

    return new Response("Board deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Could not delete board", { status: 500 });
  }
}
