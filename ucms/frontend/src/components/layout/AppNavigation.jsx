import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";

import { navigation } from "@/constants/navigation";

import NavigationItem from "./NavigationItem";
import NavigationGroup from "./NavigationGroup";

export default function AppNavigation() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navigation.map((item) =>
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
