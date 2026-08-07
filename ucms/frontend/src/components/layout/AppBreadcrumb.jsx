import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Link, useMatches } from "react-router-dom";

export default function AppBreadcrumb() {
  const matches = useMatches();

  const breadcrumbs = matches.filter((match) => match.handle?.breadcrumb);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((match, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <BreadcrumbItem key={match.pathname}>
              {isLast ? (
                <BreadcrumbPage>{match.handle.breadcrumb}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={match.pathname}>{match.handle.breadcrumb}</Link>
                  </BreadcrumbLink>

                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
