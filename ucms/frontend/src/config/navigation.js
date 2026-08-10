import {
  BookOpen,
  Building2,
  GraduationCap,
  LayoutDashboard,
  School,
  Users,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Organization",
    icon: Building2,
    items: [
      {
        title: "Campuses",
        url: "/app/campuses",
      },
      {
        title: "Buildings",
        url: "/app/buildings",
      },
      {
        title: "Rooms",
        url: "/app/rooms",
      },
      {
        title: "Departments",
        url: "/app/departments",
      },
    ],
  },

  {
    title: "Academics",
    icon: BookOpen,
    items: [
      {
        title: "Programs",
        url: "/app/programs",
      },
      {
        title: "Curricula",
        url: "/app/academic-curricula",
      },
      {
        title: "Subjects",
        url: "/app/subjects",
      },
      {
        title: "Course Offerings",
        url: "/app/course-offerings",
      },
      {
        title: "Announcements",
        url: "/app/announcements",
      },
    ],
  },

  {
    title: "People",
    icon: Users,
    items: [
      {
        title: "Students",
        url: "/app/students",
      },
      {
        title: "Faculty",
        url: "/app/faculty",
      },
    ],
  },

  {
    title: "Enrollment",
    icon: School,
    items: [
      {
        title: "Enrollments",
        url: "/app/enrollments",
      },
      {
        title: "Class Schedules",
        url: "/app/class-schedules",
      },
    ],
  },

  {
    title: "Learning",
    icon: GraduationCap,
    items: [
      {
        title: "Attendance",
        url: "/app/attendance",
      },
      {
        title: "Assignments",
        url: "/app/assignments",
      },
      {
        title: "Quizzes",
        url: "/app/quizzes",
      },
      {
        title: "Grades",
        url: "/app/grades",
      },
    ],
  },
];
