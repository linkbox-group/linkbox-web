import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { organizationService, Organization } from "@/services/organization";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

interface OrganizationDialogProps {
  mode: "add" | "edit";
  organization?: Organization;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
  parentCode: string;
}

const OrganizationDialog: React.FC<OrganizationDialogProps> = ({
  mode,
  organization,
  open,
  setOpen,
  onSuccess,
  parentCode,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    if (mode === "edit" && organization) {
      setName(organization.name);
      setDescription(organization.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [mode, organization, open]);

  const handleSubmit = async () => {
    if (!name) {
      toast.error("请输入收藏集名称");
      return;
    }

    if (!user?.id) {
      toast.error("请先登录");
      return;
    }

    try {
      setLoading(true);

      if (mode === "add") {
        await organizationService.create({
          name,
          description,
          parent_code: parentCode,
          sort_order: 1,
        });
      } else if (mode === "edit" && organization) {
        await organizationService.update({
          id: organization.id,
          name,
          description,
          sort_order: organization.sort_order,
        });
      }

      setOpen(false);
      onSuccess();
    } catch (error) {
      toast.error(mode === "add" ? "创建失败" : "更新失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            {mode === "add" ? "创建新收藏集" : "编辑收藏集"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            {mode === "add"
              ? "请输入收藏集信息，描述为选填项"
              : "修改收藏集信息"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              收藏集名称 *
            </label>
            <input
              id="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
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
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="请输入收藏集描述（选填）"
              className="flex min-h-[80px] w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => setOpen(false)} 
            disabled={loading}
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            取消
          </Button>
          <Button 
            variant="default"
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            {loading ? (mode === "add" ? "创建中..." : "更新中...") : mode === "add" ? "创建" : "更新"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationDialog; 