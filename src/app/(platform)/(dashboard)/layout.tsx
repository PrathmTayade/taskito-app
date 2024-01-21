import React from "react";
import Navbar from "./_components/navbar";
import { Toaster } from "@/components/ui/sonner";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <Toaster richColors />
      {children}
    </div>
  );
};

export default DashboardLayout;
