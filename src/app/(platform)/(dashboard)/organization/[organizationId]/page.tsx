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
  console.log(user);

  return (
    <div>
      <div>OrganizationPage</div>
      <div>{params.organizationId}</div>
      <div>{user?.username}</div>
      <div>{userId}</div>
    </div>
  );
};

export default OrganizationPage;
