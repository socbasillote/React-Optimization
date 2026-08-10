import { useState } from "react";
import { toast } from "sonner";

import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import useDebounce from "@/hooks/useDebounce";

import { useDeleteUserMutation, useGetUsersQuery } from "../api/userApi";

import UserTable from "../components/UserTable";
import UserDialog from "../components/UserDialog";
import UserStatusDialog from "../components/UserStatusDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function UserPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetUsersQuery({
    page,
    search: debouncedSearch,
  });

  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const users = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  const handleEditStatus = (user) => {
    setSelectedUser(user);
    setStatusDialogOpen(true);
  };

  const handleDeleteRequest = (user) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser._id).unwrap();

      toast.success("User deleted successfully.");

      setDeleteOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <SearchToolbar
        value={search}
        onChange={handleSearch}
        placeholder="Search users..."
      />

      <UserTable
        users={users}
        loading={isLoading}
        onEditRole={handleEditRole}
        onEditStatus={handleEditStatus}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <UserDialog
        open={roleDialogOpen}
        onOpenChange={(open) => {
          setRoleDialogOpen(open);

          if (!open) {
            setSelectedUser(null);
          }
        }}
        user={selectedUser}
      />

      <UserStatusDialog
        open={statusDialogOpen}
        onOpenChange={(open) => {
          setStatusDialogOpen(open);

          if (!open) {
            setSelectedUser(null);
          }
        }}
        user={selectedUser}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete User"
        description={`Are you sure you want to delete "${selectedUser?.firstName ?? ""} ${selectedUser?.lastName ?? ""}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
