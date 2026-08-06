import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatCard({
  title,
  value,
  icon: Icon,
  loading = false,
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-2">
          {loading ? (
            <>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">{title}</p>

              <p className="text-3xl font-bold">{value}</p>
            </>
          )}
        </div>

        {!loading && Icon && <Icon className="h-8 w-8 text-muted-foreground" />}
      </CardContent>
    </Card>
  );
}
