import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import BoardList from "./_components/board-list";
import OrgInfo from "./_components/org-info";
interface OrganizationPageProps {
  params: {
    organizationId: string;
  };
}

const OrganizationPage = async ({ params }: OrganizationPageProps) => {
  const boards = await db.taskApp_Board.findMany({
    where: { orgId: params.organizationId },
  });

  // const handleSubmit = async (data: FormData) => {
  //   "use server";
  //   const title = data.get("title") as string;
  //   const rawData = {
  //     title: title,
  //     orgId: params.organizationId,
  //     imageId: title + params.organizationId,
  //   };
  //   createBoard(rawData);
  //   revalidatePath("/organization/" + params.organizationId);
  // };

  return (
    <div>
      <OrgInfo />
      <Separator className="my-4" />
      <BoardList boards={boards} />
    </div>
  );
};

export default OrganizationPage;
