import { useLocation } from "react-router-dom";

import { pageTitles } from "@/constants/page-titles";

export default function usePageTitle() {
  const { pathname } = useLocation();

  return pageTitles[pathname] ?? "University CMS";
}
