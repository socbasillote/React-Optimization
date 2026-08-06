import { ChevronsUpDown, LogOut, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";
import { useLogout } from "@/features/auth/hooks/useLogout";

export default function UserMenu() {
  const { data } = useGetCurrentUserQuery();
  const { logout } = useLogout();

  const user = data?.data;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {user?.firstName?.charAt(0) ?? "U"}
            </div>

            <div className="grid flex-1 text-left">
              <span className="truncate font-medium">
                {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>

            <ChevronsUpDown className="ml-auto h-4 w-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
