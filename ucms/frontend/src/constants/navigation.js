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
  // =========================
  // DASHBOARD
  // =========================

  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT"],
  },

  // =========================
  // ADMIN / ORGANIZATION
  // =========================

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

  // =========================
  // PEOPLE
  // =========================

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

  // =========================
  // ACADEMIC MANAGEMENT
  // =========================

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
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY"],
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
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT"],
  },

  {
    title: "Grades",
    url: "/app/grades",
    icon: Award,
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT"],
  },

  {
    title: "Assignments",
    url: "/app/assignments",
    icon: FileText,
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT"],
  },

  {
    title: "Assignment Submissions",
    url: "/app/assignment-submissions",
    icon: ClipboardList,
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY"],
  },

  {
    title: "Quizzes",
    url: "/app/quizzes",
    icon: ClipboardPen,
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT"],
  },
  {
    title: "Quizzes Submissions",
    url: "/app/quiz-submissions",
    icon: ClipboardList,
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY"],
  },

  {
    title: "Announcements",
    url: "/app/announcements",
    icon: Megaphone,
    roles: ["SUPER_ADMIN", "ADMIN", "FACULTY", "STUDENT"],
  },
];
