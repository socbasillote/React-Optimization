import { BookOpen, Building2, GraduationCap, Users } from "lucide-react";

import StatCard from "./StatCard";

const stats = [
  {
    title: "Students",
    value: "0",
    icon: GraduationCap,
  },
  {
    title: "Faculty",
    value: "0",
    icon: Users,
  },
  {
    title: "Programs",
    value: "0",
    icon: BookOpen,
  },
  {
    title: "Campuses",
    value: "0",
    icon: Building2,
  },
];

export default function StatsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
