import { useGetCurrentUserQuery } from "@/features/auth/api";

export default function DashboardHeader() {
  const { data } = useGetCurrentUserQuery();

  const user = data?.data;

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold">
        {greeting}, {user?.firstName ?? "User"}!
      </h1>

      <p className="text-muted-foreground">Welcome back to University CMS.</p>
    </div>
  );
}
