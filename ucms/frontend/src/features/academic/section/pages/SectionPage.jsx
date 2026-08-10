import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";
import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import {
  useDeleteSectionMutation,
  useGetSectionsQuery,
} from "../api/sectionApi";

import SectionTable from "../components/SectionTable";
import SectionDialog from "../components/SectionDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function SectionPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedSection, setSelectedSection] = useState(null);

  const { data, isLoading } = useGetSectionsQuery({
    page,
  });

  const [deleteSection, { isLoading: deleting }] = useDeleteSectionMutation();

  const sections = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedSection(null);
    setDialogOpen(true);
  };

  const handleEdit = (section) => {
    setSelectedSection(section);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (section) => {
    setSelectedSection(section);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSection) return;

    try {
      await deleteSection(selectedSection._id).unwrap();

      toast.success("Section deleted successfully.");

      setDeleteOpen(false);
      setSelectedSection(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Sections" description="Manage academic sections." />

      <SearchToolbar
        value={search}
        onChange={handleSearch}
        placeholder="Search sections..."
      >
        <Button onClick={handleCreate}>New Section</Button>
      </SearchToolbar>

      <SectionTable
        sections={sections}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <SectionDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedSection(null);
          }
        }}
        section={selectedSection}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Section"
        description={`Are you sure you want to delete "${selectedSection?.name ?? ""}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
