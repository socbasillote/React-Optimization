import { Plus, Users, BookOpen } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-3">
        <Button>
          <Plus />
          New Student
        </Button>

        <Button variant="secondary">
          <Users />
          Faculty
        </Button>

        <Button variant="secondary">
          <BookOpen />
          Subjects
        </Button>
      </CardContent>
    </Card>
  );
}
