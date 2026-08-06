import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import usePageMeta from "@/hooks/usePageMeta";

export default function Breadcrumbs() {
  const { breadcrumb } = usePageMeta();

  if (!breadcrumb?.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumb.map((item, index) => (
          <div key={item.label} className="flex items-center">
            <BreadcrumbItem>
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            </BreadcrumbItem>

            {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
