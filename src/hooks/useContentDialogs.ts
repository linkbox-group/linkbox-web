import { useState } from "react";
import { Item } from "@/services/items";
import { itemService } from "@/services/items";
import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";

export const useContentDialogs = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Item | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const { items, deleteItem } = useAppStore();

  const handleEdit = (id: string | number) => {
    const cardItem = items.find((item) => item.id === id);
    if (cardItem) {
      const item: Item = {
        id: cardItem.id.toString(),
        user_id: cardItem.user_id,
        type: cardItem.type,
        title: cardItem.title,
        description: cardItem.description,
        url: cardItem.url,
        thumbnail_url: cardItem.thumbnail_url,
        tag_names: cardItem.tags,
        tags: cardItem.tags,
        organization_id: cardItem.organization_id,
        organization_path: cardItem.organization_path,
        deleted_at: cardItem.deleted_at,
        note: cardItem.note,
        created_at: cardItem.created_at,
        updated_at: cardItem.updated_at,
      };
      setSelectedContent(item);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: string | number) => {
    const cardItem = items.find((item) => item.id === id);
    if (cardItem) {
      const item: Item = {
        id: cardItem.id.toString(),
        user_id: cardItem.user_id,
        type: cardItem.type,
        title: cardItem.title,
        description: cardItem.description,
        url: cardItem.url,
        thumbnail_url: cardItem.thumbnail_url,
        tag_names: cardItem.tags,
        tags: cardItem.tags,
        organization_id: cardItem.organization_id,
        organization_path: cardItem.organization_path,
        deleted_at: cardItem.deleted_at,
        note: cardItem.note,
        created_at: cardItem.created_at,
        updated_at: cardItem.updated_at,
      };
      setItemToDelete(item);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await itemService.delete(itemToDelete.id.toString());
      deleteItem(itemToDelete.id);
      toast.success("删除成功");
    } catch (error) {
      console.error("删除失败:", error);
      toast.error("删除失败");
    }
  };

  return {
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedContent,
    deleteDialogOpen,
    setDeleteDialogOpen,
    itemToDelete,
    handleEdit,
    handleDelete,
    handleDeleteConfirm,
  };
}; 