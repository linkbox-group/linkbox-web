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

interface AddDialogProps {
  onAdd: (data: { link: string; title?: string; tags?: string[] }) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddDialog: React.FC<AddDialogProps> = ({ onAdd,open,setOpen }) => {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = () => {
    if (!link) return;

    onAdd({
      link,
      title: title || undefined,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : undefined,
    });

    // 重置表单
    setLink("");
    setTitle("");
    setTags("");
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>添加新链接</AlertDialogTitle>
          <AlertDialogDescription>
            请输入链接信息，标题和标签为选填项
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="link" className="text-sm font-medium">
              链接地址 *
            </label>
            <input
              id="link"
              value={link}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLink(e.target.value)
              }
              placeholder="请输入链接地址"
              required
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
          <AlertDialogCancel onClick={() => setOpen(false)}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>添加</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddDialog;
