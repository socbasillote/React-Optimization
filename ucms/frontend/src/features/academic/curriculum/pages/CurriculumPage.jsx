import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";
import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import useDebounce from "@/hooks/useDebounce";

import {
  useDeleteCurriculumMutation,
  useGetCurriculaQuery,
} from "../api/curriculumApi";

import CurriculumTable from "../components/CurriculumTable";
import CurriculumDialog from "../components/CurriculumDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function CurriculumPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedCurriculum, setSelectedCurriculum] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetCurriculaQuery({
    page,
    search: debouncedSearch,
  });

  const [deleteCurriculum, { isLoading: deleting }] =
    useDeleteCurriculumMutation();

  const curricula = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedCurriculum(null);
    setDialogOpen(true);
  };

  const handleEdit = (curriculum) => {
    setSelectedCurriculum(curriculum);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (curriculum) => {
    setSelectedCurriculum(curriculum);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCurriculum) return;

    try {
      await deleteCurriculum(selectedCurriculum._id).unwrap();

      toast.success("Curriculum deleted successfully.");

      setDeleteOpen(false);
      setSelectedCurriculum(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
  console.log("test");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculums"
        description="Manage program curriculums."
      />

      <SearchToolbar
        value={search}
        onChange={handleSearch}
        placeholder="Search curriculums..."
      >
        <Button onClick={handleCreate}>New Curriculum</Button>
      </SearchToolbar>

      <CurriculumTable
        curricula={curricula}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CurriculumDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedCurriculum(null);
          }
        }}
        curriculum={selectedCurriculum}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Curriculum"
        description={`Are you sure you want to delete "${selectedCurriculum?.name}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
