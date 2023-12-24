import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";

interface NavItemProps {
  key: string;
  isActive: boolean;
  isExpanded: boolean;
  organization: Organization;
  onExpand: (id: string) => void;
}

export type Organization = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
};

const NavItem: FC<NavItemProps> = ({}) => {
  const router = useRouter();
  const pathname = usePathname();
  
  return <div>NavItem</div>;
};

export default NavItem;
