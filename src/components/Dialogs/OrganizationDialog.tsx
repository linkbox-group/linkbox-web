import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { organizationService } from "@/services/organization";
import { toast } from "sonner";

interface OrganizationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  parentCode: string;
}

const OrganizationDialog: React.FC<OrganizationDialogProps> = ({
  open,
  setOpen,
  onSuccess,
  parentCode,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name) {
      toast.error("请输入收藏集名称");
      return;
    }

    try {
      setLoading(true);
      await organizationService.create({
        name,
        parent_code: parentCode,
        description,
        sort_order: sortOrder,
      });

      toast.success("创建成功");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("创建失败:", error);
      toast.error("创建失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
            创建收藏集
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            请输入收藏集信息，描述和排序为选填项
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              名称 *
            </label>
            <input
              id="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="请输入收藏集名称"
              required
              className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              描述
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="请输入收藏集描述"
              className="flex min-h-[80px] w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="sortOrder" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              排序
            </label>
            <input
              id="sortOrder"
              type="number"
              value={sortOrder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSortOrder(Number(e.target.value))}
              min={1}
              className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={() => setOpen(false)} 
            disabled={loading}
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            取消
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            {loading ? "创建中..." : "创建"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrganizationDialog; 