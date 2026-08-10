import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";
import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import useDebounce from "@/hooks/useDebounce";

import {
  useDeleteCurriculumSubjectMutation,
  useGetCurriculumSubjectsQuery,
} from "../api/curriculumSubjectApi";

import CurriculumSubjectTable from "../components/CurriculumSubjectTable";
import CurriculumSubjectDialog from "../components/CurriculumSubjectDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function CurriculumSubjectPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedCurriculumSubject, setSelectedCurriculumSubject] =
    useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetCurriculumSubjectsQuery({
    page,
    search: debouncedSearch,
  });

  const [deleteCurriculumSubject, { isLoading: deleting }] =
    useDeleteCurriculumSubjectMutation();

  const curriculumSubjects = data?.data ?? [];

  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedCurriculumSubject(null);
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedCurriculumSubject(item);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (item) => {
    setSelectedCurriculumSubject(item);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCurriculumSubject) return;

    try {
      await deleteCurriculumSubject(selectedCurriculumSubject._id).unwrap();

      toast.success("Curriculum subject deleted successfully.");

      setDeleteOpen(false);
      setSelectedCurriculumSubject(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum Subjects"
        description="Manage subjects assigned to curricula."
      />

      <SearchToolbar
        value={search}
        onChange={handleSearch}
        placeholder="Search curriculum subjects..."
      >
        <Button onClick={handleCreate}>New Curriculum Subject</Button>
      </SearchToolbar>

      <CurriculumSubjectTable
        curriculumSubjects={curriculumSubjects}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CurriculumSubjectDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedCurriculumSubject(null);
          }
        }}
        curriculumSubject={selectedCurriculumSubject}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Curriculum Subject"
        description={`Are you sure you want to remove "${selectedCurriculumSubject?.subject?.code ?? ""}" from "${selectedCurriculumSubject?.curriculum?.name ?? ""}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
