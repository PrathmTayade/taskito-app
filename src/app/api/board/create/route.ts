import { boardFormSchema } from "@/actions/action-schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { orgId } = auth();
    if (!orgId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, image } = boardFormSchema.parse(body);

    const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
      image.split("|");

    // check if board already exists
    const boardExists = await db.taskApp_Board.findFirst({
      where: {
        title,
      },
    });

    if (boardExists) {
      return new Response("Board already exists", { status: 409 });
    }

    // create subreddit and associate it with the user
    const board = await db.taskApp_Board.create({
      data: {
        title,
        orgId,
        imageId,
        imageFullUrl,
        imageLinkHTML,
        imageThumbUrl,
        imageUserName,
      },
    });

    // create audit log
    if (board) {
      await createAuditLog({
        action: ACTION.CREATE,
        entityType: ENTITY_TYPE.BOARD,
        entityId: board.id,
        entityTitle: board.title,
      });
    }
    // await db.subscription.create({
    //   data: {
    //     userId: session.user.id,
    //     subredditId: subreddit.id,
    //   },
    // });

    return new Response(board.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create a board", { status: 500 });
  }
}
export async function GET() {
  return Response.json({ hello: "world" });
}

// todo make delete work and if it does change the route to board only
// export async function DELETE(req: Request) {
//   try {
//     const { orgId } = auth();
//     if (!orgId) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     const body = await req.json();
//     console.log("body", body);

//     const { id: boardId } = body;

//     // check if board exists
//     const boardExists = await db.taskApp_Board.findFirst({
//       where: {
//         id: boardId as string,
//         orgId,
//       },
//     });

//     if (!boardExists) {
//       return new Response("Board does not exist", { status: 404 });
//     }

//     // delete board
//     await db.taskApp_Board.delete({
//       where: {
//         id: boardId as string,
//         orgId,
//       },
//     });

//     return new Response("Board deleted successfully", { status: 200 });
//   } catch (error) {
//     return new Response("Could not delete board", { status: 500 });
//   }
// }
