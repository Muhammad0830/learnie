import SideBar from "@/components/header_sidebar/Sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SideBar>{children}</SideBar>
    </div>
  );
};

export default Layout;
