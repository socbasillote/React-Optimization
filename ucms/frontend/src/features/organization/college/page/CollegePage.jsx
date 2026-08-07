import { useState, useEffect } from "react";
import { toast } from "sonner";

import PageHeader from "@/components/common/PageHeader";
import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import { Button } from "@/components/ui/button";

import useDebounce from "@/hooks/useDebounce";

import CollegeTable from "../components/CollegeTable";
import CollegeDialog from "../components/CollegeDialog";

import {
  useDeleteCollegeMutation,
  useGetCollegesQuery,
} from "../api/collegeApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function CollegePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useGetCollegesQuery({
    page,
    search: debouncedSearch,
  });

  const [deleteCollege, { isLoading: deleting }] = useDeleteCollegeMutation();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async () => {
    try {
      await deleteCollege(selectedCollege._id).unwrap();

      toast.success("College deleted successfully.");

      setDeleteOpen(false);
      setSelectedCollege(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Colleges" description="Manage university colleges." />

      <SearchToolbar
        value={search}
        onChange={handleSearchChange}
        placeholder="Search colleges..."
      >
        <Button onClick={() => setDialogOpen(true)}>New College</Button>
      </SearchToolbar>

      <CollegeTable
        colleges={data?.data ?? []}
        loading={isLoading}
        onEdit={(college) => {
          setSelectedCollege(college);
          setDialogOpen(true);
        }}
        onDelete={(college) => {
          setSelectedCollege(college);
          setDeleteOpen(true);
        }}
      />

      <AppPagination
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
      />
      <CollegeDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedCollege(null);
          }
        }}
        college={selectedCollege}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete College"
        description={`Are you sure you want to delete "${selectedCollege?.name}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
