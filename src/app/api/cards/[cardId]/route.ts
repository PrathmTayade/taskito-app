import { UpdateCard } from "@/actions/action-schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!orgId || !userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const cardData = await db.taskApp_Card.findUnique({
      where: {
        id: params.cardId,
        list: { board: { orgId } },
      },
      include: {
        list: { select: { title: true } },
      },
    });

    return new Response(JSON.stringify(cardData), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!orgId || !userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = params.cardId;

    const validatedData = UpdateCard.parse(await req.json());

    const card = await db.taskApp_Card.update({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      data: {
        ...validatedData,
      },
    });
    if (card) {
      await createAuditLog({
        action: ACTION.UPDATE,
        entityType: ENTITY_TYPE.CARD,
        entityId: card.id,
        entityTitle: card.title,
      });
    }
    return Response.json(card, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.issues }, { status: 400 });
    } else {
      return Response.json(err, { status: 500 });
    }
  }
}
