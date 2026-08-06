import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Plus, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const actions = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: GraduationCap,
    to: "/app/dashboard",
    enabled: true,
  },
  {
    id: "students",
    label: "Students",
    icon: Plus,
    to: "/app/students",
    enabled: false,
  },
  {
    id: "faculty",
    label: "Faculty",
    icon: Users,
    to: "/app/faculty",
    enabled: false,
  },
  {
    id: "subjects",
    label: "Subjects",
    icon: BookOpen,
    to: "/app/subjects",
    enabled: false,
  },
];

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          if (!action.enabled) {
            return (
              <Button
                key={action.label}
                variant="outline"
                disabled
                className="justify-start"
              >
                <Icon className="h-4 w-4" />
                <span>{action.label}</span>
              </Button>
            );
          }

          return (
            <Link
              key={action.label}
              to={action.to}
              className={cn(buttonVariants(), "justify-start")}
            >
              <Icon className="h-4 w-4" />
              <span>{action.label}</span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
