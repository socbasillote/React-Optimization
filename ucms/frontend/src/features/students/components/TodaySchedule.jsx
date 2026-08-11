import { CalendarDays } from "lucide-react";

const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

function getCourseName(schedule) {
  const subject = schedule?.courseOffering?.curriculumSubject?.subject;

  return subject
    ? `${subject.code ?? ""} ${subject.title ?? ""}`.trim()
    : "Course unavailable";
}

export default function TodaySchedule({ schedules = [], isLoading }) {
  const today = DAYS[new Date().getDay()];

  const todaySchedules = schedules.filter((schedule) => schedule.day === today);

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center gap-2 border-b p-5">
        <CalendarDays className="size-5 text-muted-foreground" />

        <div>
          <h2 className="font-semibold">Today's Classes</h2>

          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
      </div>

      <div className="divide-y">
        {isLoading ? (
          <div className="p-5 text-sm text-muted-foreground">
            Loading schedule...
          </div>
        ) : todaySchedules.length === 0 ? (
          <div className="p-5 text-sm text-muted-foreground">
            No classes scheduled today.
          </div>
        ) : (
          todaySchedules.map((schedule) => (
            <div key={schedule._id} className="p-5">
              <p className="font-medium">{getCourseName(schedule)}</p>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>
                  {schedule.startTime} – {schedule.endTime}
                </span>

                <span>Room {schedule.room}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
