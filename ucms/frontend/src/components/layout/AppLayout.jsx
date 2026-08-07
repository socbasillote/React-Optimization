import { Outlet } from "react-router-dom";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import PageContainer from "./PageContainer";
import AppBreadcrumb from "./AppBreadcrumb";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <AppHeader />
        <AppBreadcrumb />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </SidebarInset>
    </SidebarProvider>
  );
}
