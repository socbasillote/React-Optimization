import { Badge } from "@/components/ui/badge";

const variants = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  PENDING: "outline",
  DRAFT: "outline",
  PUBLISHED: "default",
  ARCHIVED: "destructive",
};

const labels = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PENDING: "Pending",
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export default function StatusBadge({ status }) {
  return (
    <Badge variant={variants[status] ?? "outline"}>
      {labels[status] ?? status}
    </Badge>
  );
}
