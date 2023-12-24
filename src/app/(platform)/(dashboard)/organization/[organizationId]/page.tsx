import { auth, currentUser } from "@clerk/nextjs";
import React from "react";
interface OrganizationPageProps {
  params: {
    organizationId: string;
  };
}

const OrganizationPage = async ({ params }: OrganizationPageProps) => {
  const user = await currentUser();

  const { userId } = auth();
  return (
    <div>
      <div>
        OrganizationPage
        {params.organizationId}
      </div>
      <div>{user?.firstName}</div>
      <div>{userId}</div>
    </div>
  );
};

export default OrganizationPage;
