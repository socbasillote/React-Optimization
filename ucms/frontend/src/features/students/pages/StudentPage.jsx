import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import useDebounce from "@/hooks/useDebounce";

import {
  useDeleteStudentMutation,
  useGetStudentsQuery,
} from "../api/studentApi";

import StudentTable from "../components/StudentTable";
import StudentDialog from "../components/StudentDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function StudentPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetStudentsQuery({
    page,
    search: debouncedSearch,
  });

  const [deleteStudent, { isLoading: deleting }] = useDeleteStudentMutation();

  const students = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedStudent(null);
    setDialogOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (student) => {
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;

    try {
      await deleteStudent(selectedStudent._id).unwrap();

      toast.success("Student deleted successfully.");

      setDeleteOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-5">
      <SearchToolbar
        value={search}
        onChange={handleSearch}
        placeholder="Search students..."
      >
        <Button onClick={handleCreate}>New Student</Button>
      </SearchToolbar>

      <StudentTable
        students={students}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <StudentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedStudent(null);
          }
        }}
        student={selectedStudent}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Student"
        description={`Are you sure you want to delete "${selectedStudent?.studentNumber}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
