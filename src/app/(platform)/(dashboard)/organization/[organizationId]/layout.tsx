import React from "react";
import OrgControl from "./_components/org-control";
const OrganizationIdPageLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default OrganizationIdPageLayout;
