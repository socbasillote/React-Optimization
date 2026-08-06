import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentAnnouncements() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Announcements</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm">
          No announcements available.
        </p>
      </CardContent>
    </Card>
  );
}
