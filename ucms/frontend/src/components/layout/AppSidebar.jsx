import { Sidebar, SidebarFooter } from "@/components/ui/sidebar";

import AppLogo from "./AppLogo";
import AppNavigation from "./AppNavigation";
import UserMenu from "./UserMenu";

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <AppLogo />

      <AppNavigation />

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
