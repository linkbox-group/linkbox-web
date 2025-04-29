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
import { tagService, Tag } from "@/services/tags";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

interface TagDialogProps {
  mode: "add" | "edit";
  tag?: Tag;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

const TagDialog: React.FC<TagDialogProps> = ({
  mode,
  tag,
  open,
  setOpen,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#7CC6FF");
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    if (mode === "edit" && tag) {
      setName(tag.name);
      setDescription(tag.description || "");
      setColor(tag.color || "#7CC6FF");
    } else {
      setName("");
      setDescription("");
      setColor("#7CC6FF");
    }
  }, [mode, tag, open]);

  const handleSubmit = async () => {
    if (!name) {
      toast.error("请输入标签名称");
      return;
    }

    if (!user?.id) {
      toast.error("请先登录");
      return;
    }

    try {
      setLoading(true);

      if (mode === "add") {
        await tagService.createTag({
          user_id: user.id,
          name,
          description,
          color,
        });
      } else if (mode === "edit" && tag) {
        await tagService.updateTag(tag.id, {
          user_id: user.id,
          name,
          description,
          color,
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
            {mode === "add" ? "创建新标签" : "编辑标签"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            {mode === "add" ? "请输入标签信息，描述为选填项" : "修改标签信息"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              标签名称 *
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入标签名称"
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
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入标签描述（选填）"
              className="flex min-h-[80px] w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="color" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              颜色
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer p-0"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">{color}</span>
            </div>
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

export default TagDialog; 