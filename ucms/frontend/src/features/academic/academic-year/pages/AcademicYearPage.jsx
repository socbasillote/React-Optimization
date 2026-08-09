import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";
import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import useDebounce from "@/hooks/useDebounce";

import {
  useDeleteAcademicYearMutation,
  useGetAcademicYearsQuery,
} from "../api/academicYearApi";

import AcademicYearTable from "../components/AcademicYearTable";
import AcademicYearDialog from "../components/AcademicYearDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function AcademicYearPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetAcademicYearsQuery({
    page,
    search: debouncedSearch,
  });

  const [deleteAcademicYear, { isLoading: deleting }] =
    useDeleteAcademicYearMutation();

  const academicYears = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedAcademicYear(null);
    setDialogOpen(true);
  };

  const handleEdit = (academicYear) => {
    setSelectedAcademicYear(academicYear);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (academicYear) => {
    setSelectedAcademicYear(academicYear);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAcademicYear) return;

    try {
      await deleteAcademicYear(selectedAcademicYear._id).unwrap();

      toast.success("Academic year deleted successfully.");

      setDeleteOpen(false);
      setSelectedAcademicYear(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Academic Years" description="Manage academic years." />

      <SearchToolbar
        value={search}
        onChange={handleSearch}
        placeholder="Search academic years..."
      >
        <Button onClick={handleCreate}>New Academic Year</Button>
      </SearchToolbar>

      <AcademicYearTable
        academicYears={academicYears}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AcademicYearDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedAcademicYear(null);
          }
        }}
        academicYear={selectedAcademicYear}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Academic Year"
        description={`Are you sure you want to delete "${selectedAcademicYear?.name}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
