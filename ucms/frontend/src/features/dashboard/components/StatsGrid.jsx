import { BookOpen, Building2, GraduationCap, Users } from "lucide-react";

import StatCard from "./StatCard";

import { useGetDashboardStatsQuery } from "../api/dashboardApi";

export default function StatsGrid() {
  const { data, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCard key={index} loading />
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Students",
      value: data?.data.students ?? 0,
      icon: GraduationCap,
    },
    {
      title: "Faculty",
      value: data?.data.faculty ?? 0,
      icon: Users,
    },
    {
      title: "Programs",
      value: data?.data.programs ?? 0,
      icon: BookOpen,
    },
    {
      title: "Campuses",
      value: data?.data.campuses ?? 0,
      icon: Building2,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
