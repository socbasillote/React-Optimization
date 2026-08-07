import { useEffect, useState } from "react";

import CampusTable from "../components/CampusTable";

import useDebounce from "@/hooks/useDebounce";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useGetCampusesQuery, useDeleteCampusMutation } from "../api/campusApi";

import AppPagination from "@/components/common/AppPagination";

import CampusDialog from "../components/CampusDialog";

import { toast } from "sonner";

import { getErrorMessage } from "@/lib/getErrorMessage";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import { Plus } from "lucide-react";
import SearchToolbar from "@/components/common/SearchToolbar";

export default function CampusPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(null);

  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useGetCampusesQuery({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const [deleteCampus, { isLoading: deleting }] = useDeleteCampusMutation();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async () => {
    try {
      await deleteCampus(selectedCampus._id).unwrap();

      toast.success("Campus deleted successfully.");

      setDeleteOpen(false);
      setSelectedCampus(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Campuses" description="Manage university campuses.">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Campus
        </Button>
      </PageHeader>

      <SearchToolbar
        value={search}
        onChange={handleSearchChange}
        placeholder="Search campuses..."
      />

      <CampusTable
        campuses={data?.data ?? []}
        loading={isLoading}
        onEdit={(campus) => {
          setSelectedCampus(campus);
          setDialogOpen(true);
        }}
        onDelete={(campus) => {
          setSelectedCampus(campus);
          setDeleteOpen(true);
        }}
      />

      <AppPagination
        page={data?.meta?.page ?? 1}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
      />
      <CampusDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedCampus(null);
          }
        }}
        campus={selectedCampus}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Campus"
        description={`Are you sure you want to delete "${selectedCampus?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
