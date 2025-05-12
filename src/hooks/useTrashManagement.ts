import { useState } from "react";
import { trashService, TrashItem } from "@/services/trash";
import { toast } from "sonner";

export const useTrashManagement = () => {
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(false);

  const clearTrashItems = () => {
    setTrashItems([]);
  };

  const fetchTrashItems = async () => {
    try {
      setLoading(true);
      const response = await trashService.getList();
      if (response.data?.items) {
        setTrashItems(response.data.items);
      } else {
        setTrashItems([]);
      }
    } catch (error) {
      console.error("获取回收站列表失败:", error);
      toast.error("获取回收站列表失败");
      setTrashItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (id: string) => {
    try {
      await trashService.recovery({ item_id: id });
      toast.success("恢复成功");
      // 重新获取回收站列表
      fetchTrashItems();
    } catch (error) {
      console.error("恢复失败:", error);
      toast.error("恢复失败");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await trashService.delete(id);
      toast.success("删除成功");
      // 重新获取回收站列表
      fetchTrashItems();
    } catch (error) {
      console.error("删除失败:", error);
      toast.error("删除失败");
    }
  };

  return {
    trashItems,
    loading: loading,
    fetchTrashItems,
    clearTrashItems,
    handleRecover,
    handlePermanentDelete,
  };
}; 