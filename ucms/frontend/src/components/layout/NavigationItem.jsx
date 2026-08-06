import { Link, useLocation } from "react-router-dom";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export default function NavigationItem({ item }) {
  const location = useLocation();

  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={location.pathname === item.url}
        render={
          <Link to={item.url} className="flex w-full items-center gap-2" />
        }
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
