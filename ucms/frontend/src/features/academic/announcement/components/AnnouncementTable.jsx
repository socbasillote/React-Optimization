import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
};

const getCourseOfferingId = (announcement) => {
  if (typeof announcement?.courseOffering === "object") {
    return announcement.courseOffering?._id;
  }

  return announcement?.courseOffering;
};

export default function AnnouncementTable({
  announcements = [],
  courseOfferingOptions = [],
  isLoading,
  isDeleting,
  onEdit,
  onDelete,
}) {
  const getCourseLabel = (announcement) => {
    const id = getCourseOfferingId(announcement);

    const option = courseOfferingOptions.find((item) => item.value === id);

    if (option) {
      return option.label;
    }

    return "Course information unavailable";
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Announcement</TableHead>

              <TableHead>Course Offering</TableHead>

              <TableHead>Published</TableHead>

              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Loading announcements...
                </TableCell>
              </TableRow>
            ) : announcements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No announcements found.
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((announcement) => (
                <TableRow key={announcement._id}>
                  <TableCell>
                    <div className="font-medium">{announcement.title}</div>

                    <div className="max-w-[420px] truncate text-xs text-muted-foreground">
                      {announcement.content}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[360px] truncate">
                      {getCourseLabel(announcement)}
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {formatDateTime(announcement.publishedAt)}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={isDeleting}
                        onClick={() => onEdit(announcement)}
                      >
                        <Pencil />

                        <span className="sr-only">Edit announcement</span>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={isDeleting}
                        onClick={() => onDelete(announcement)}
                      >
                        <Trash2 />

                        <span className="sr-only">Delete announcement</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
