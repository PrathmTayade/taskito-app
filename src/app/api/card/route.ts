import {
  CreateCard,
  CreateList,
  UpdateCardOrder,
} from "@/actions/action-schema";
import { db } from "@/lib/db";
import { ListWithCards } from "@/lib/types";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import { list } from "postcss";
import { z } from "zod";

// todo fix
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

// Create Card
export async function POST(req: Request) {
  const { orgId } = auth();
  if (!orgId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { title, listId } = CreateCard.parse(body);
  try {
    const board = await db.taskApp_List.findUnique({
      where: {
        id: listId,
        board: {
          orgId,
        },
      },
    });

    if (!board) {
      return {
        error: "Board not found",
      };
    }
    // Get previous order of lists
    const lastCard = await db.taskApp_Card.findFirst({
      where: { listId: listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    const card = await db.taskApp_Card.create({
      data: {
        title: title,
        listId: listId,
        order: newOrder,
      },
    });

    return Response.json(card);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Could not create a List", { status: 500 });
  }
}

// Update order of the card
export async function PUT(req: Request) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }
  const body = await req.json();

  const { items } = UpdateCardOrder.parse(body);
 

  try {
    const transaction = items.map((card) =>
      db.taskApp_Card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId,
            },
          },
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      })
    );

   const updatedCards = await db.$transaction(transaction);
   return Response.json(updatedCards)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Could not update the cards", { status: 500 });
  }
}
