import DashboardHeader from "../components/DashboardHeader";
import QuickActions from "../components/QuickActions";
import RecentAnnouncements from "../components/RecentAnnouncement";
import StatsGrid from "../components/StatsGrid";

export default function DashboardPage() {
  return (
    <>
      <div className="space-y-8">
        <DashboardHeader />

        <StatsGrid />

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentAnnouncements />

          <QuickActions />
        </div>
      </div>
    </>
  );
}
