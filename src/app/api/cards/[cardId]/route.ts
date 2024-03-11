import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

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
