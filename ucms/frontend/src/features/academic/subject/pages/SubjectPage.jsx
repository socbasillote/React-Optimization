import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";
import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import useDebounce from "@/hooks/useDebounce";

import {
  useDeleteSubjectMutation,
  useGetSubjectsQuery,
} from "../api/subjectApi";

import SubjectTable from "../components/SubjectTable";
import SubjectDialog from "../components/SubjectDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function SubjectPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetSubjectsQuery({
    page,
    search: debouncedSearch,
  });

  const [deleteSubject, { isLoading: deleting }] = useDeleteSubjectMutation();

  const subjects = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedSubject(null);
    setDialogOpen(true);
  };

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (subject) => {
    setSelectedSubject(subject);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSubject) return;

    try {
      await deleteSubject(selectedSubject._id).unwrap();

      toast.success("Subject deleted successfully.");

      setDeleteOpen(false);
      setSelectedSubject(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Subjects" description="Manage academic subjects." />

      <SearchToolbar
        value={search}
        onChange={handleSearch}
        placeholder="Search subjects..."
      >
        <Button onClick={handleCreate}>New Subject</Button>
      </SearchToolbar>

      <SubjectTable
        subjects={subjects}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <SubjectDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedSubject(null);
          }
        }}
        subject={selectedSubject}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Subject"
        description={`Are you sure you want to delete "${selectedSubject?.code} - ${selectedSubject?.title}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
