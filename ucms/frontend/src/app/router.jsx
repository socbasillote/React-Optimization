import { createBrowserRouter, Navigate } from "react-router-dom";

import GuestLayout from "@/layouts/GuestLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { AppLayout } from "@/components/layout";
import CampusPage from "@/features/organization/campus/pages/CampusPage";
import CollegePage from "@/features/organization/college/page/CollegePage";
import DepartmentPage from "@/features/organization/department/pages/DepartmentPage";
import ProgramPage from "@/features/organization/program/pages/ProgramPage";
import AcademicYearPage from "@/features/academic/academic-year/pages/AcademicYearPage";
import AcademicTermPage from "@/features/academic/academic-term/pages/AcademicTermPage";
import CurriculumPage from "@/features/academic/curriculum/pages/CurriculumPage";
import SubjectPage from "@/features/academic/subject/pages/SubjectPage";
import CurriculumSubjectPage from "@/features/academic/curriculum-subject/pages/CurriculumSubjectPage";
import SectionPage from "@/features/academic/section/pages/SectionPage";
import FacultyPage from "@/features/faculty/pages/FacultyPage";
import CourseOfferingPage from "@/features/academic/course-offering/pages/CourseOfferingPage";
import UserPage from "@/features/users/pages/UserPage";
import StudentPage from "@/features/students/pages/StudentPage";

const router = createBrowserRouter([
  {
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  {
    path: "/app",
    element: <ProtectedLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
            handle: {
              title: "Dashboard",
              breadcrumb: [{ label: "Dashboard" }],
            },
          },
          {
            path: "campuses",
            element: <CampusPage />,
            handle: {
              title: "Campuses",
              breadcrumb: [{ label: "Campuses" }],
            },
          },
          {
            path: "colleges",
            element: <CollegePage />,
            handle: {
              title: "Colleges",
              breadcrumb: [{ label: "Colleges" }],
            },
          },
          {
            path: "departments",
            element: <DepartmentPage />,
            handle: {
              title: "Departments",
              breadcrumb: [{ label: "Departments" }],
            },
          },
          {
            path: "programs",
            element: <ProgramPage />,
            handle: {
              title: "Programs",
              breadcrumb: [{ label: "Programs" }],
            },
          },
          {
            path: "academic-years",
            element: <AcademicYearPage />,
            handle: {
              title: "Academic Years",
              breadcrumb: [{ label: "Academic Years" }],
            },
          },
          {
            path: "academic-terms",
            element: <AcademicTermPage />,
            handle: {
              title: "Academic Terms",
              breadcrumb: [{ label: "Academic Terms" }],
            },
          },
          {
            path: "academic-curriculum",
            element: <CurriculumPage />,
            handle: {
              title: "Curriculums",
              breadcrumb: [{ label: "Curriculums" }],
            },
          },
          {
            path: "subjects",
            element: <SubjectPage />,
            handle: {
              title: "Subjects",
              breadcrumb: [{ label: "Subjects" }],
            },
          },
          {
            path: "curriculum-subjects",
            element: <CurriculumSubjectPage />,
            handle: {
              title: "Curriculum Subjects",
              breadcrumb: [{ label: "Curriculum Subjects" }],
            },
          },
          {
            path: "sections",
            element: <SectionPage />,
            handle: {
              title: "Sections",
              breadcrumb: [{ label: "Sections" }],
            },
          },
          {
            path: "faculty",
            element: <FacultyPage />,
            handle: {
              title: "Faculty",
              breadcrumb: [{ label: "Faculty" }],
            },
          },
          {
            path: "course-offerings",
            element: <CourseOfferingPage />,
            handle: {
              title: "Course Offerings",
              breadcrumb: [{ label: "Course Offerings" }],
            },
          },
          {
            path: "users",
            element: <UserPage />,
            handle: {
              title: "Users",
              breadcrumb: [{ label: "Users" }],
            },
          },
          {
            path: "students",
            element: <StudentPage />,
            handle: {
              title: "Students",
              breadcrumb: [{ label: "Students" }],
            },
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
