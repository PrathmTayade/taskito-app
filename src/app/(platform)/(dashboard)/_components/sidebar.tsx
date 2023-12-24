"use client";

import React, { use } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import NavItem, { Organization } from "./nav-item";

interface SidebarProps {
  storageKey?: string;
}

const Sidebar = ({ storageKey = "t-sidebar-state" }: SidebarProps) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  const { organization: activeOrganization, isLoaded: isOrganizationLoaded } =
    useOrganization();

  const { isLoaded: isOrganizationListLoaded, userMemberships } =
    useOrganizationList({ userMemberships: { infinite: true } });

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) acc.push(key);
      return acc;
    },
    []
  );

  if (
    !isOrganizationLoaded ||
    !isOrganizationListLoaded ||
    userMemberships.isLoading
  ) {
    return (
      <>
        <Skeleton />
      </>
    );
  }
  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto"
        >
          <Link href="/select-org">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {userMemberships.data?.map(({ organization }) => (
          <NavItem
            key={organization.id}
            isActive={organization.id === activeOrganization?.id}
            isExpanded={expanded[organization.id]}
            organization={organization as Organization}
            onExpand={function (id: string): void {}}
          />
        ))}
      </Accordion>
    </>
  );
};

export default Sidebar;
