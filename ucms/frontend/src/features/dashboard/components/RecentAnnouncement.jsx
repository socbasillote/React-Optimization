import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { useGetAnnouncementsQuery } from "@/features/academic/announcement/api/announcementApi";

export default function RecentAnnouncements() {
  const { data, isLoading } = useGetAnnouncementsQuery({
    limit: 5,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const announcements = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Announcements</CardTitle>

        <Link
          to="/app/announcements"
          className="text-sm text-primary hover:underline"
        >
          View All
        </Link>
      </CardHeader>

      <CardContent>
        {announcements.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No announcements available.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="space-y-1 border-b pb-3 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{announcement.title}</h3>

                    <span className="text-xs text-muted-foreground">
                      {new Date(announcement.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {announcement.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
