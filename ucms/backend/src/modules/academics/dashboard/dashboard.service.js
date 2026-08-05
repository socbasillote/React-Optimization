import ApiError from "../../../utils/ApiError.js";
import { ROLES } from "../../../constants/roles.js";

import Student from "../../students/student.model.js";
import Faculty from "../../faculty/faculty.model.js";

import AcademicYear from "../academic-year/academicYear.model.js";
import AcademicTerm from "../academic-term/academicTerm.model.js";

import Enrollment from "../enrollment/enrollment.model.js";
import CourseOffering from "../course-offering/courseOffering.model.js";

import Assignment from "../assignment/assignment.model.js";
import AssignmentSubmission from "../assignment-submission/assignmentSubmission.model.js";

import Quiz from "../quiz/quiz.model.js";
import QuizSubmission from "../quiz-submission/quizSubmission.model.js";

import Announcement from "../announcement/announcement.model.js";

import Attendance from "../attendance/attendance.model.js";
import Grade from "../grade/grade.model.js";

import User from "../../users/user.model.js";

import Campus from "../../organization/campus/campus.model.js";
import College from "../../organization/college/college.model.js";
import Department from "../../organization/department/department.model.js";
import Program from "../../organization/program/program.model.js";
import Subject from "../subject/subject.model.js";
import Curriculum from "../curriculum/curriculum.model.js";
import Section from "../section/section.model.js";

const getStudentDashboard = async (userId) => {
  const student = await Student.findOne({
    user: userId,
  }).populate("user");

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  const enrollments = await Enrollment.find({
    student: student._id,
  }).populate("courseOffering");

  const enrollmentIds = enrollments.map((e) => e._id);

  const courseOfferingIds = enrollments.map((e) => e.courseOffering._id);

  const [
    academicYear,
    academicTerm,
    assignments,
    assignmentSubmissions,
    quizzes,
    quizSubmissions,
    announcements,
    attendance,
    grades,
  ] = await Promise.all([
    AcademicYear.findOne({ isCurrent: true }),

    AcademicTerm.findOne({ isCurrent: true }),

    Assignment.find({
      courseOffering: {
        $in: courseOfferingIds,
      },
    }),

    AssignmentSubmission.find({
      enrollment: {
        $in: enrollmentIds,
      },
    }),

    Quiz.find({
      courseOffering: {
        $in: courseOfferingIds,
      },
    }),

    QuizSubmission.find({
      enrollment: {
        $in: enrollmentIds,
      },
    }),

    Announcement.find({
      courseOffering: {
        $in: courseOfferingIds,
      },
    })
      .sort({ publishedAt: -1 })
      .limit(5),

    Attendance.find({
      enrollment: {
        $in: enrollmentIds,
      },
    }),

    Grade.find({
      enrollment: {
        $in: enrollmentIds,
      },
    }),
  ]);

  return {
    profile: student,

    currentAcademicYear: academicYear,

    currentAcademicTerm: academicTerm,

    enrolledCourses: enrollments,

    pendingAssignments: assignments.filter(
      (assignment) =>
        !assignmentSubmissions.some(
          (submission) =>
            submission.assignment.toString() === assignment._id.toString(),
        ),
    ),

    pendingQuizzes: quizzes.filter(
      (quiz) =>
        !quizSubmissions.some(
          (submission) => submission.quiz.toString() === quiz._id.toString(),
        ),
    ),

    recentAnnouncements: announcements,

    attendanceSummary: {
      total: attendance.length,
    },

    gradeSummary: grades,
  };
};

const getFacultyDashboard = async (userId) => {
  const faculty = await Faculty.findOne({
    user: userId,
  });

  if (!faculty) {
    throw new ApiError(404, "Faculty not found.");
  }

  const courseOfferings = await CourseOffering.find({
    faculty: faculty._id,
  });

  const courseOfferingIds = courseOfferings.map((c) => c._id);

  const [
    assignmentSubmissions,
    quizSubmissions,
    announcements,
    enrollmentCount,
  ] = await Promise.all([
    AssignmentSubmission.countDocuments(),

    QuizSubmission.countDocuments(),

    Announcement.find({
      courseOffering: {
        $in: courseOfferingIds,
      },
    })
      .sort({
        publishedAt: -1,
      })
      .limit(5),

    Enrollment.countDocuments({
      courseOffering: {
        $in: courseOfferingIds,
      },
    }),
  ]);

  return {
    assignedCourses: courseOfferings,

    pendingAssignmentSubmissions: assignmentSubmissions,

    pendingQuizSubmissions: quizSubmissions,

    recentAnnouncements: announcements,

    studentCount: enrollmentCount,
  };
};

const getAdminDashboard = async () => {
  const [
    students,
    faculty,
    courseOfferings,
    enrollments,
    academicYear,
    academicTerm,
    announcements,
  ] = await Promise.all([
    Student.countDocuments(),

    Faculty.countDocuments(),

    CourseOffering.countDocuments(),

    Enrollment.countDocuments(),

    AcademicYear.findOne({
      isCurrent: true,
    }),

    AcademicTerm.findOne({
      isCurrent: true,
    }),

    Announcement.find()
      .sort({
        publishedAt: -1,
      })
      .limit(5),
  ]);

  return {
    statistics: {
      students,
      faculty,
      courseOfferings,
      enrollments,
    },

    currentAcademicYear: academicYear,

    currentAcademicTerm: academicTerm,

    recentAnnouncements: announcements,
  };
};

const getSuperAdminDashboard = async () => {
  const [
    campuses,
    colleges,
    departments,
    programs,
    subjects,
    curriculums,
    sections,
    courseOfferings,
    students,
    faculty,
    admins,
  ] = await Promise.all([
    Campus.countDocuments(),
    College.countDocuments(),
    Department.countDocuments(),
    Program.countDocuments(),
    Subject.countDocuments(),
    Curriculum.countDocuments(),
    Section.countDocuments(),
    CourseOffering.countDocuments(),
    Student.countDocuments(),
    Faculty.countDocuments(),
    User.countDocuments({
      role: ROLES.ADMIN,
    }),
  ]);

  return {
    organization: {
      campuses,
      colleges,
      departments,
      programs,
    },

    academics: {
      subjects,
      curriculums,
      sections,
      courseOfferings,
    },

    users: {
      admins,
      faculty,
      students,
    },
  };
};

export const getDashboard = async (user) => {
  switch (user.role) {
    case ROLES.STUDENT:
      return getStudentDashboard(user.id);

    case ROLES.FACULTY:
      return getFacultyDashboard(user.id);

    case ROLES.ADMIN:
      return getAdminDashboard();

    case ROLES.SUPER_ADMIN:
      return getSuperAdminDashboard();

    default:
      throw new ApiError(403, "Unauthorized.");
  }
};
