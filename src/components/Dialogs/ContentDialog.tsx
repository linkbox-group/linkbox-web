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
import { itemService, Item } from "@/services/items";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";

interface ContentDialogProps {
  mode: "add" | "edit";
  content?: Item;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

const ContentDialog: React.FC<ContentDialogProps> = ({
  mode,
  content,
  open,
  setOpen,
  onSuccess,
}) => {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();
  const navigate = useNavigate();
  // 当对话框打开或内容变化时，更新表单
  useEffect(() => {
    if (mode === "edit" && content) {
      setLink(content.url);
      setTitle(content.title);
      setTags(content.tags?.join(", ") || "");
    } else {
      // 添加模式，重置表单
      setLink("");
      setTitle("");
      setTags("");
    }
  }, [mode, content, open]);

  const handleSubmit = async () => {
    if (!link) {
      toast.error("请输入链接地址");
      return;
    }

    if (!user?.id) {
      toast.error("请先登录");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);

      if (mode === "add") {
        // 创建内容项
        await itemService.create({
          type: 1,
          url: link,
          title: title || link,
          description: "",
          organization_id: user?.id || "",
          note: "",
        });
      } else if (mode === "edit" && content) {
        // 编辑模式
        await itemService.update(content.id, {
          user_id: user?.id || "",
          title: title,
          description: content.description,
          thumbnail_url: content.thumbnail_url,
          tags: content.tags || [],
          organization_ids: content.organization_ids || [],
        });
      }

      // 关闭对话框并刷新列表
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast.error(mode === "add" ? "添加失败" : "更新失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            {mode === "add" ? "添加新链接" : "编辑链接"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            {mode === "add"
              ? "请输入链接信息，标题和标签为选填项"
              : "修改链接信息"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="link" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              链接地址 {mode === "add" ? "*" : ""}
            </label>
            <input
              id="link"
              value={link}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLink(e.target.value)
              }
              placeholder="请输入链接地址"
              required={mode === "add"}
              disabled={mode === "edit"}
              className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              标题
            </label>
            <input
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="请输入标题（选填）"
              className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="tags" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              标签
            </label>
            <input
              id="tags"
              value={tags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTags(e.target.value)
              }
              placeholder="请输入标签，用逗号分隔（选填）"
              className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            {loading ? (mode === "add" ? "添加中..." : "更新中...") : mode === "add" ? "添加" : "更新"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDialog; 