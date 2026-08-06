import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ title, value, icon: Icon }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{title}</p>

          <p className="text-3xl font-bold">{value}</p>
        </div>

        {Icon && <Icon className="text-muted-foreground h-8 w-8" />}
      </CardContent>
    </Card>
  );
}
