import { useMatches } from "react-router-dom";

export default function usePageMeta() {
  const matches = useMatches();

  const current = matches.at(-1);

  return (
    current?.handle ?? {
      title: "University CMS",
      breadcrumb: [],
    }
  );
}
