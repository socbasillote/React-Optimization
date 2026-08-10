import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";
import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import useDebounce from "@/hooks/useDebounce";

import {
  useDeleteFacultyMutation,
  useGetFacultiesQuery,
} from "../api/facultyApi";

import FacultyTable from "../components/FacultyTable";
import FacultyDialog from "../components/FacultyDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function FacultyPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetFacultiesQuery({
    page,
    search: debouncedSearch,
  });

  const [deleteFaculty, { isLoading: deleting }] = useDeleteFacultyMutation();

  const faculties = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedFaculty(null);
    setDialogOpen(true);
  };

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (faculty) => {
    setSelectedFaculty(faculty);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedFaculty) return;

    try {
      await deleteFaculty(selectedFaculty._id).unwrap();

      toast.success("Faculty deleted successfully.");

      setDeleteOpen(false);
      setSelectedFaculty(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Faculty" description="Manage faculty members." />

      <SearchToolbar
        value={search}
        onChange={handleSearch}
        placeholder="Search faculty..."
      >
        <Button onClick={handleCreate}>New Faculty</Button>
      </SearchToolbar>

      <FacultyTable
        faculties={faculties}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <FacultyDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedFaculty(null);
          }
        }}
        faculty={selectedFaculty}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Faculty"
        description={`Are you sure you want to delete "${selectedFaculty?.user?.firstName ?? ""} ${selectedFaculty?.user?.lastName ?? ""}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
