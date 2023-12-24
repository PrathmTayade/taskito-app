import React from "react";
import { cookies } from "next/headers";
import { Providers } from "@/components/providers";

const PlatformLayout = async ({ children }: { children: React.ReactNode }) => {
  return <Providers >{children}</Providers>;
};

export default PlatformLayout;
