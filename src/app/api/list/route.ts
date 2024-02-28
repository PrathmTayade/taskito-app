import { CreateList } from "@/actions/action-schema";
import { db } from "@/lib/db";
import { ListWithCards } from "@/lib/types";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import { list } from "postcss";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { orgId } = auth();
  if (!orgId) {
    return new Response("orgId required");
  }
  const boardId = req.nextUrl.searchParams.get("boardId");
  if (!boardId) {
    return new Response("boardId required");
  }
  try {
    const lists: ListWithCards[] = await db.taskApp_List.findMany({
      where: {
        boardId: boardId,
        board: {
          orgId,
        },
      },
      include: {
        cards: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });
    console.log("list", lists);
    return Response.json({ lists: lists });
  } catch (error) {}
}

export async function POST(req: Request) {
  const { orgId } = auth();
  if (!orgId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { title, boardId } = CreateList.parse(body);
  try {
    const board = await db.taskApp_Board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!board) {
      return {
        error: "Board not found",
      };
    }
    // Get previous order of lists
    const lastList = await db.taskApp_List.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    const list = await db.taskApp_List.create({
      data: {
        title: title,
        boardId: boardId,
        order: newOrder,
      },
    });

    return Response.json(list);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Could not create a List", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { orgId } = auth();
  if (!orgId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const listId = searchParams.get("listId");

  try {
    // check if board exists
    const List = await db.taskApp_List.findFirst({
      where: {
        id: listId as string,
        boardId: searchParams.get("boardId") as string,
      },
    });

    if (!List) {
      return new Response("List does not exist", { status: 404 });
    }

    // delete board
    await db.taskApp_List.delete({
      where: {
        id: listId as string,
        boardId: searchParams.get("boardId") as string,
      },
    });

    return new Response("List deleted successfully", { status: 200 });
  } catch (error) {}
}
