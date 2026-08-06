import Student from "../students/student.model.js";
import User from "../users/user.model.js";
import Program from "../organization/program/program.model.js";
import Campus from "../organization/campus/campus.model.js";

export const getStatistics = async () => {
  const [students, faculty, programs, campuses] = await Promise.all([
    Student.countDocuments(),
    User.countDocuments({
      role: "FACULTY",
    }),
    Program.countDocuments(),
    Campus.countDocuments(),
  ]);

  return {
    students,
    faculty,
    programs,
    campuses,
  };
};
