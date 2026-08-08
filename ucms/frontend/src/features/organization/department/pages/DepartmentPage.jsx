import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";
import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import useDebounce from "@/hooks/useDebounce";

import {
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
} from "../api/departmentApi";

import DepartmentTable from "../components/DepartmentTable";
import DepartmentDialog from "../components/DepartmentDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function DepartmentPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetDepartmentsQuery({
    page,
    search: debouncedSearch,
  });

  const [deleteDepartment, { isLoading: deleting }] =
    useDeleteDepartmentMutation();

  const departments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedDepartment(null);
    setDialogOpen(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (department) => {
    setSelectedDepartment(department);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedDepartment) return;

    try {
      await deleteDepartment(selectedDepartment._id).unwrap();

      toast.success("Department deleted successfully.");

      setDeleteOpen(false);
      setSelectedDepartment(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Manage academic departments."
      />

      <SearchToolbar
        value={search}
        onChange={handleSearch}
        placeholder="Search departments..."
      >
        <Button onClick={handleCreate}>New Department</Button>
      </SearchToolbar>

      <DepartmentTable
        departments={departments}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <DepartmentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedDepartment(null);
          }
        }}
        department={selectedDepartment}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Department"
        description={`Are you sure you want to delete "${selectedDepartment?.name}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
