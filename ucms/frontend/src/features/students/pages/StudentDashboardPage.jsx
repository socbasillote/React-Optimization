import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Megaphone,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";

import { useGetClassSchedulesQuery } from "@/features/academic/class-schedule/api/classScheduleApi";
import { useGetAttendancesQuery } from "@/features/academic/attendance/api/attendanceApi";
import { useGetGradesQuery } from "@/features/academic/grade/api/gradeApi";
import { useGetAssignmentsQuery } from "@/features/academic/assignment/api/assignmentApi";
import { useGetQuizzesQuery } from "@/features/academic/quiz/api/quizApi";
import { useGetAnnouncementsQuery } from "@/features/academic/announcement/api/announcementApi";

export default function StudentDashboardPage() {
  const { data: currentUserData } = useGetCurrentUserQuery();

  const user = currentUserData?.data;

  const { data: scheduleData, isLoading: schedulesLoading } =
    useGetClassSchedulesQuery({
      page: 1,
      limit: 100,
    });

  const { data: attendanceData, isLoading: attendanceLoading } =
    useGetAttendancesQuery({
      page: 1,
      limit: 10,
    });

  const { data: gradeData, isLoading: gradesLoading } = useGetGradesQuery({
    page: 1,
    limit: 100,
  });

  const { data: assignmentData, isLoading: assignmentsLoading } =
    useGetAssignmentsQuery({
      page: 1,
      limit: 100,
    });

  const { data: quizData, isLoading: quizzesLoading } = useGetQuizzesQuery({
    page: 1,
    limit: 100,
  });

  const { data: announcementData, isLoading: announcementsLoading } =
    useGetAnnouncementsQuery({
      page: 1,
      limit: 5,
    });

  const schedules = scheduleData?.data ?? [];
  const attendances = attendanceData?.data ?? [];
  const grades = gradeData?.data ?? [];
  const assignments = assignmentData?.data ?? [];
  const quizzes = quizData?.data ?? [];
  const announcements = announcementData?.data ?? [];

  const isLoading =
    schedulesLoading ||
    attendanceLoading ||
    gradesLoading ||
    assignmentsLoading ||
    quizzesLoading ||
    announcementsLoading;

  const firstName = user?.firstName ?? "Student";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {firstName}
        </h1>

        <p className="text-sm text-muted-foreground">
          Here's an overview of your academic activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StudentStatCard
          title="My Classes"
          value={schedules.length}
          icon={CalendarDays}
          loading={isLoading}
        />

        <StudentStatCard
          title="Attendance Records"
          value={attendances.length}
          icon={ClipboardCheck}
          loading={isLoading}
        />

        <StudentStatCard
          title="Grades"
          value={grades.length}
          icon={GraduationCap}
          loading={isLoading}
        />

        <StudentStatCard
          title="Assignments"
          value={assignments.length}
          icon={FileText}
          loading={isLoading}
        />

        <StudentStatCard
          title="Quizzes"
          value={quizzes.length}
          icon={BookOpen}
          loading={isLoading}
        />

        <StudentStatCard
          title="Announcements"
          value={announcements.length}
          icon={Megaphone}
          loading={isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
          </CardHeader>

          <CardContent>
            {schedules.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No class schedules found.
              </p>
            ) : (
              <div className="space-y-4">
                {schedules.slice(0, 5).map((schedule) => {
                  const subject =
                    schedule?.courseOffering?.curriculumSubject?.subject;

                  return (
                    <div
                      key={schedule._id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">
                          {subject?.code ?? "Unknown subject"}
                        </p>

                        <p className="truncate text-sm text-muted-foreground">
                          {subject?.title ?? "Subject information unavailable"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-medium">{schedule.day}</p>

                        <p className="text-xs text-muted-foreground">
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>

          <CardContent>
            {announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No announcements found.
              </p>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement._id} className="space-y-1">
                    <p className="font-medium">{announcement.title}</p>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {announcement.content}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {announcement.publishedAt
                        ? new Date(announcement.publishedAt).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StudentStatCard({ title, value, icon: Icon, loading }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>

        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="h-8 w-16 animate-pulse rounded bg-muted" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
