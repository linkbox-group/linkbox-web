import React, { useState, useEffect } from "react";
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
import { contentService, Content } from "@/services/content";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";

interface ContentDialogProps {
  mode: "add" | "edit";
  content?: Content;
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
      setTags(content.tags.join(", "));
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
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      if (mode === "add") {
        // 从URL提取元数据
        const metadata = await contentService.extractMetadata(link);

        // 创建内容项
        await contentService.createContent({
          url: link,
          title: title || metadata.title,
          description: metadata.description,
          image_url: metadata.thumbnail_url,
          tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        });
      } else if (mode === "edit" && content) {
        // 编辑模式
        await contentService.updateContent(content.id, {
          user_id: user.id,
          title: title,
          tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
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
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {mode === "add" ? "添加新链接" : "编辑链接"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {mode === "add"
              ? "请输入链接信息，标题和标签为选填项"
              : "修改链接信息"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="link" className="text-sm font-medium">
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              标题
            </label>
            <input
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="请输入标题（选填）"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="tags" className="text-sm font-medium">
              标签
            </label>
            <input
              id="tags"
              value={tags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTags(e.target.value)
              }
              placeholder="请输入标签，用逗号分隔（选填）"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)} disabled={loading}>
            取消
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={loading}>
            {loading ? (mode === "add" ? "添加中..." : "更新中...") : mode === "add" ? "添加" : "更新"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ContentDialog; 