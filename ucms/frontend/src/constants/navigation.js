import {
  LayoutDashboard,
  Building2,
  CalendarRange,
  GraduationCap,
  Users,
  BookOpen,
  ClipboardList,
  CalendarDays,
  ClipboardCheck,
  Award,
  FileText,
  ClipboardPen,
  Megaphone,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT"],
  },

  {
    title: "Organization",
    icon: Building2,
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        title: "Campuses",
        url: "/app/campuses",
      },
      {
        title: "Colleges",
        url: "/app/colleges",
      },
      {
        title: "Departments",
        url: "/app/departments",
      },
      {
        title: "Programs",
        url: "/app/programs",
      },
    ],
  },

  {
    title: "Academic Structure",
    icon: CalendarRange,
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        title: "Academic Years",
        url: "/app/academic-years",
      },
      {
        title: "Academic Terms",
        url: "/app/academic-terms",
      },
      {
        title: "Curriculums",
        url: "/app/academic-curriculum",
      },
      {
        title: "Subjects",
        url: "/app/subjects",
      },
      {
        title: "Curriculum Subjects",
        url: "/app/curriculum-subjects",
      },
      {
        title: "Sections",
        url: "/app/sections",
      },
    ],
  },

  {
    title: "Students",
    url: "/app/students",
    icon: GraduationCap,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },

  {
    title: "Faculty",
    url: "/app/faculty",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },

  {
    title: "Course Offerings",
    url: "/app/course-offerings",
    icon: BookOpen,
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY"],
  },

  {
    title: "Enrollment",
    url: "/app/enrollments",
    icon: ClipboardList,
    roles: ["SUPER_ADMIN", "ADMIN", "STUDENT"],
  },

  {
    title: "Class Schedule",
    url: "/app/class-schedules",
    icon: CalendarDays,
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT"],
  },

  {
    title: "Attendance",
    url: "/app/attendance",
    icon: ClipboardCheck,
    roles: ["FACULTY", "STUDENT"],
  },

  {
    title: "Grades",
    url: "/app/grades",
    icon: Award,
    roles: ["FACULTY", "STUDENT"],
  },

  {
    title: "Assignments",
    url: "/app/assignments",
    icon: FileText,
    roles: ["FACULTY", "STUDENT"],
  },

  {
    title: "Quizzes",
    url: "/app/quizzes",
    icon: ClipboardPen,
    roles: ["FACULTY", "STUDENT"],
  },

  {
    title: "Announcements",
    url: "/app/announcements",
    icon: Megaphone,
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT"],
  },
];
