import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";

import { navigation } from "@/constants/navigation";

import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";

import NavigationItem from "./NavigationItem";
import NavigationGroup from "./NavigationGroup";

export default function AppNavigation() {
  const { data, isLoading } = useGetCurrentUserQuery();

  const user = data?.data;

  const role = user?.role;

  if (isLoading || !role) {
    return (
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    );
  }

  const filteredNavigation = navigation.filter((item) =>
    item.roles?.includes(role),
  );

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {filteredNavigation.map((item) =>
              item.items ? (
                <NavigationGroup key={item.title} item={item} />
              ) : (
                <NavigationItem key={item.title} item={item} />
              ),
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
