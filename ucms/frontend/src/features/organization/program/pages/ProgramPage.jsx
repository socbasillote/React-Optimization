import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";
import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import useDebounce from "@/hooks/useDebounce";

import {
  useDeleteProgramMutation,
  useGetProgramsQuery,
} from "../api/programApi";

import ProgramTable from "../components/ProgramTable";
import ProgramDialog from "../components/ProgramDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function ProgramPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetProgramsQuery({
    page,
    search: debouncedSearch,
  });

  const [deleteProgram, { isLoading: deleting }] = useDeleteProgramMutation();

  const programs = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedProgram(null);
    setDialogOpen(true);
  };

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (program) => {
    setSelectedProgram(program);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProgram) return;

    try {
      await deleteProgram(selectedProgram._id).unwrap();

      toast.success("Program deleted successfully.");

      setDeleteOpen(false);
      setSelectedProgram(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Programs" description="Manage academic programs." />

      <SearchToolbar
        value={search}
        onChange={handleSearch}
        placeholder="Search programs..."
      >
        <Button onClick={handleCreate}>New Program</Button>
      </SearchToolbar>

      <ProgramTable
        programs={programs}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ProgramDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedProgram(null);
          }
        }}
        program={selectedProgram}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Program"
        description={`Are you sure you want to delete "${selectedProgram?.name}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
