import { SidebarTrigger } from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";

import Breadcrumbs from "./Breadcrumbs";

import usePageTitle from "@/hooks/use-page-title";

export default function AppHeader() {
  const title = usePageTitle();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />

      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumbs />
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}
