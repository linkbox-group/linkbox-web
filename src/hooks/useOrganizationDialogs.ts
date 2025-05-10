import { useState } from "react";
import { organizationService } from "@/services/organization";
import { toast } from "sonner";

export const useOrganizationDialogs = () => {
  const [organizationDialogOpen, setOrganizationDialogOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<any>(null);
  const [deleteOrganizationDialogOpen, setDeleteOrganizationDialogOpen] = useState(false);

  const handleAddOrganization = () => {
    setOrganizationDialogOpen(true);
  };

  const handleDeleteOrganization = (organization: any) => {
    setOrganizationToDelete(organization);
    setDeleteOrganizationDialogOpen(true);
  };

  const handleDeleteOrganizationConfirm = async () => {
    if (!organizationToDelete) return;

    try {
      await organizationService.delete(organizationToDelete.id);
      toast.success("删除成功");
      // 重新获取组织列表
      const sidebar = document.querySelector('[data-testid="sidebar"]');
      if (sidebar) {
        const event = new CustomEvent("refreshOrganizations");
        sidebar.dispatchEvent(event);
      }
    } catch (error) {
      console.error("删除失败:", error);
      toast.error("删除失败");
    } finally {
      setDeleteOrganizationDialogOpen(false);
      setOrganizationToDelete(null);
    }
  };

  return {
    organizationDialogOpen,
    setOrganizationDialogOpen,
    deleteOrganizationDialogOpen,
    setDeleteOrganizationDialogOpen,
    organizationToDelete,
    handleAddOrganization,
    handleDeleteOrganization,
    handleDeleteOrganizationConfirm,
  };
}; 