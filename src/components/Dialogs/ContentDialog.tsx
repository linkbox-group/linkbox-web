import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { X, RefreshCw, ChevronDown, Link, FileText } from "lucide-react";
import debounce from "lodash/debounce";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";

interface ContentDialogProps {
  mode: "add" | "edit";
  content?: Item;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

const ContentTypeSelector = ({
  value,
  onChange,
  disabled = false,
}: {
  value: 1 | 2;
  onChange: (value: 1 | 2) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        className={`w-full justify-between transition-all duration-200 ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700"
            : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          {value === 1 ? (
            <>
              <Link className="h-4 w-4 text-blue-500 transition-transform duration-200 hover:scale-110" />
              <span>链接</span>
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 text-green-500 transition-transform duration-200 hover:scale-110" />
              <span>笔记</span>
            </>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180 text-blue-500" : ""
          }`}
        />
      </Button>

      <div
        className={`absolute top-full left-0 z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg transition-all duration-200 ease-in-out transform origin-top ${
          isOpen
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
            value === 1
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : ""
          }`}
          onClick={() => {
            onChange(1);
            setIsOpen(false);
          }}
        >
          <Link
            className={`h-4 w-4 ${
              value === 1 ? "text-blue-500" : ""
            } transition-transform duration-200`}
          />
          <span className="transition-transform duration-200 hover:translate-x-0.5">
            链接
          </span>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
            value === 2
              ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              : ""
          }`}
          onClick={() => {
            onChange(2);
            setIsOpen(false);
          }}
        >
          <FileText
            className={`h-4 w-4 ${
              value === 2 ? "text-green-500" : ""
            } transition-transform duration-200`}
          />
          <span className="transition-transform duration-200 hover:translate-x-0.5">
            笔记
          </span>
        </div>
      </div>
    </div>
  );
};

const ContentDialog: React.FC<ContentDialogProps> = ({
  mode,
  content,
  open,
  setOpen,
  onSuccess,
}) => {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [contentType, setContentType] = useState<1 | 2>(1);
  const { user } = useUserStore();
  const { currentOrganizationId } = useAppStore();
  const navigate = useNavigate();
  // 获取元信息的函数
  const fetchMetaInfo = async (url: string) => {
    // 如果已经有标题或正在获取，则不执行
    if ((title || isFetchingTitle) && mode !== "edit") return;

    try {
      setIsFetchingTitle(true);
      const maxRetries = 3;
      let retryCount = 0;

      const tryFetch = async (): Promise<any> => {
        try {
          const response = await fetch(`/meta?url=${encodeURIComponent(url)}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying... (${retryCount}/${maxRetries})`);
            await new Promise((resolve) =>
              setTimeout(resolve, Math.pow(2, retryCount) * 1000)
            );
            return tryFetch();
          }
          throw error;
        }
      };

      const data = await tryFetch();
      if (data.title && !title) {
        setTitle(data.title);
      }
      if (mode === "edit" && data.title) {
        setTitle(data.title);
      }
    } catch (error) {
      console.error("获取元信息失败:", error);
      toast.error("获取元信息失败，请稍后重试");
    } finally {
      setIsFetchingTitle(false);
    }
  };

  // 使用 useCallback 和 debounce 创建防抖函数
  const debouncedFetchMeta = useCallback(
    debounce((url: string) => {
      if (url && url.startsWith("http")) {
        fetchMetaInfo(url);
      }
    }, 1000),
    []
  );

  // 处理链接输入变化
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLink = e.target.value;
    setLink(newLink);
    if (mode === "add") {
      debouncedFetchMeta(newLink);
    }
  };

  // 当对话框打开或内容变化时，更新表单
  useEffect(() => {
    if (mode === "edit" && content) {
      setLink(content.url || "");
      setTitle(content.title);
      setTags(
        content.tag_names
          ?.map((tag) => tag.trim().replace(/[,，]/g, ""))
          .filter(Boolean) || []
      );
      setNoteContent(content.note || "");
      // 根据内容类型设置 contentType
      setContentType(content.type === "LINK" ? 1 : 2);
    } else {
      // 添加模式，重置表单
      setLink("");
      setTitle("");
      setTags([]);
      setTagInput("");
      setNoteContent("");
      setContentType(content?.type === "LINK" ? 1 : 2);
    }
  }, [mode, content, open]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (contentType === 1 && !link) {
      toast.error("请输入链接地址");
      return;
    }

    if (contentType === 2 && !title) {
      toast.error("请输入笔记标题");
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
        // 创建内容项
        await itemService.create({
          type: contentType, // 1: 链接, 2: 笔记
          url: contentType === 1 ? link : "",
          title: title || (contentType === 1 ? link : "未命名笔记"),
          description: "",
          organization_id: currentOrganizationId || "0",
          note: contentType === 2 ? noteContent : "",
          tags: tags,
        });
      } else if (mode === "edit" && content) {
        // 编辑模式 - 更新基本信息
        await itemService.update(content.id, {
          user_id: user?.id || "",
          title: title,
          description: content.description,
          thumbnail_url: content.thumbnail_url,
          tags: tags,
          organization_id: content.organization_id,
        });

        // 如果是笔记类型并且笔记内容有变化
        // 使用项目中的 API 请求模式进行更新
        if (contentType === 2 && content.note !== noteContent) {
          try {
            // 使用 itemService 提供的方法来更新笔记内容
            await itemService.updateNoteContent(content.id, {
              note: noteContent,
            });
          } catch (error) {
            console.error("更新笔记内容失败:", error);
            toast.error("笔记内容更新失败，请稍后重试");
            // 继续执行，不要因为更新笔记内容失败而阻止整个流程
          }
        }
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
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto sm:max-w-[600px] w-[95vw] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            {mode === "add"
              ? contentType === 1
                ? "添加新链接"
                : "添加新笔记"
              : contentType === 1
              ? "编辑链接"
              : "编辑笔记"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            {mode === "add"
              ? contentType === 1
                ? "请输入链接信息，标题和标签为选填项"
                : "请填写笔记信息，使用Markdown编辑内容"
              : contentType === 1
              ? "修改链接信息"
              : "修改笔记信息"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 内容类型选择 */}
          <div className="grid gap-2">
            <label
              htmlFor="content-type"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              内容类型
            </label>
            <ContentTypeSelector
              value={contentType}
              onChange={setContentType}
              disabled={mode === "edit"} // 编辑模式下不允许修改类型
            />
          </div>

          {contentType === 1 && (
            <div className="grid gap-2">
              <label
                htmlFor="link"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                链接地址 {mode === "add" ? "*" : ""}
              </label>
              <input
                id="link"
                value={link}
                onChange={handleLinkChange}
                placeholder="请输入链接地址"
                required={mode === "add"}
                disabled={mode === "edit"}
                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="title"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                标题{contentType === 2 && "*"}
              </label>
              {contentType === 1 && mode === "edit" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchMetaInfo(link)}
                  disabled={isFetchingTitle || !link}
                  className="h-8 px-2 text-xs"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-1 ${
                      isFetchingTitle ? "animate-spin" : ""
                    }`}
                  />
                  获取标题
                </Button>
              )}
            </div>
            <input
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              onFocus={() => contentType === 1 && setIsFetchingTitle(true)}
              placeholder={
                contentType === 1
                  ? isFetchingTitle
                    ? "正在获取标题..."
                    : "请输入标题（选填）"
                  : "请输入笔记标题"
              }
              required={contentType === 2}
              className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {contentType === 2 && (
            <div className="grid gap-2">
              <label
                htmlFor="note-content"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                笔记内容
              </label>
              <div className="border border-gray-200 dark:border-gray-600 rounded-md w-full overflow-hidden">
                <MdEditor
                  modelValue={noteContent}
                  onChange={setNoteContent}
                  language="zh-CN"
                  preview={true}
                  previewTheme="github"
                  className="!border-none"
                  toolbars={[
                    "bold",
                    "underline",
                    "italic",
                    "-",
                    "title",
                    "strikeThrough",
                    "sub",
                    "sup",
                    "quote",
                    "unorderedList",
                    "orderedList",
                    "task",
                    "-",
                    "codeRow",
                    "code",
                    "link",
                    "image",
                    "table",
                    "mermaid",
                    "katex",
                    "-",
                    "revoke",
                    "next",
                    "save",
                    "=",
                    "pageFullscreen",
                    "fullscreen",
                    "preview",
                    "htmlPreview",
                    "catalog",
                  ]}
                  style={{
                    height: "400px",
                  }}
                  theme={
                    document.documentElement.classList.contains("dark")
                      ? "dark"
                      : "light"
                  }
                  onSave={() => {
                    handleSubmit();
                  }}
                  placeholder="在此输入Markdown内容..."
                />
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <label
              htmlFor="tags"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              标签
            </label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-md text-sm"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="输入标签后按回车添加"
                className="flex-1 min-w-[120px] h-8 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
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
            {loading
              ? mode === "add"
                ? "添加中..."
                : "更新中..."
              : mode === "add"
              ? "添加"
              : "更新"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDialog;
