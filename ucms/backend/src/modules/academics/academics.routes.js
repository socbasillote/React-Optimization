import express from "express";

import academicYearRoutes from "./academic-year/academicYear.routes.js";
import academicTermRoutes from "./academic-term/academicTerm.routes.js";
import curriculumRoutes from "./curriculum/curriculum.routes.js";
import subjectRoutes from "./subject/subject.routes.js";
import curriculumSubjectRoutes from "./curriculum-subject/curriculumSubject.routes.js";
import sectionRoutes from "./section/section.routes.js";
import courseOfferingRoutes from "./course-offering/courseOffering.routes.js";
import enrollmentRoutes from "./enrollment/enrollment.routes.js";
import classScheduleRoutes from "./class-schedule/classSchedule.routes.js";
import attendanceRoutes from "./attendance/attendance.routes.js";
import gradeRoutes from "./grade/grade.routes.js";
import assignmentRoutes from "./assignment/assignment.routes.js";
import assignmentSubmissionRoutes from "./assignment-submission/assignmentSubmission.routes.js";
import quizRoutes from "./quiz/quiz.routes.js";
import quizSubmissionRoutes from "./quiz-submission/quizSubmission.routes.js";
import announcementRoutes from "./announcement/announcement.routes.js";
import dashboardRoutes from "./dashboard/dashboard.routes.js";

const router = express.Router();

router.use("/academic-years", academicYearRoutes);
router.use("/academic-terms", academicTermRoutes);
router.use("/curricula", curriculumRoutes);
router.use("/subjects", subjectRoutes);
router.use("/curriculum-subjects", curriculumSubjectRoutes);
router.use("/sections", sectionRoutes);
router.use("/course-offerings", courseOfferingRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/class-schedules", classScheduleRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/grades", gradeRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/assignment-submissions", assignmentSubmissionRoutes);
router.use("/quizzes", quizRoutes);
router.use("/quiz-submissions", quizSubmissionRoutes);
router.use("/announcements", announcementRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
