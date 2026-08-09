import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";
import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import useDebounce from "@/hooks/useDebounce";

import {
  useDeleteAcademicTermMutation,
  useGetAcademicTermsQuery,
} from "../api/academicTermApi";

import AcademicTermTable from "../components/AcademicTermTable";
import AcademicTermDialog from "../components/AcademicTermDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function AcademicTermPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedAcademicTerm, setSelectedAcademicTerm] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetAcademicTermsQuery({
    page,
    search: debouncedSearch,
  });

  const [deleteAcademicTerm, { isLoading: deleting }] =
    useDeleteAcademicTermMutation();

  const academicTerms = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedAcademicTerm(null);
    setDialogOpen(true);
  };

  const handleEdit = (academicTerm) => {
    setSelectedAcademicTerm(academicTerm);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (academicTerm) => {
    setSelectedAcademicTerm(academicTerm);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAcademicTerm) return;

    try {
      await deleteAcademicTerm(selectedAcademicTerm._id).unwrap();

      toast.success("Academic term deleted successfully.");

      setDeleteOpen(false);
      setSelectedAcademicTerm(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Academic Terms" description="Manage academic terms." />

      <SearchToolbar
        value={search}
        onChange={handleSearch}
        placeholder="Search academic terms..."
      >
        <Button onClick={handleCreate}>New Academic Term</Button>
      </SearchToolbar>

      <AcademicTermTable
        academicTerms={academicTerms}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AcademicTermDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedAcademicTerm(null);
          }
        }}
        academicTerm={selectedAcademicTerm}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Academic Term"
        description={`Are you sure you want to delete "${selectedAcademicTerm?.name}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
