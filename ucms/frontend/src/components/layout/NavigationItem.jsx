import { Link, useLocation } from "react-router-dom";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export default function NavigationItem({ item }) {
  const location = useLocation();

  const isActive = location.pathname === item.url;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link to={item.url}>
          {item.icon && <item.icon />}

          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
