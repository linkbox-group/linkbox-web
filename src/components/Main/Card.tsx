import React from "react";
import { Edit2, Trash2, Link, FileText } from "lucide-react";
import Ripples from "react-ripples";

interface CardProps {
  title: string;
  favoriteTime: string;
  tags: string[];
  tag_names: string[];
  folderPath: string;
  link: string;
  type?: "LINK" | "NOTE";
  note?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  favoriteTime,
  tags,
  tag_names,
  folderPath,
  link,
  type = "LINK",
  note,
  onEdit,
  onDelete,
}) => {
  const isNote = type === "NOTE";

  const handleButtonClick = (e: React.MouseEvent, callback?: () => void) => {
    e.stopPropagation(); // 阻止事件冒泡
    callback?.();
  };

  return (
    <div
      onClick={() => !isNote && window.open(link, "_blank")}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow w-full max-w-[20rem] ${
        isNote ? "cursor-default" : "cursor-pointer"
      }`}
    >
      {/* 标题和操作按钮 */}
      <div className="flex justify-between items-start mb-2 w-full">
        <div className="flex items-center gap-2 flex-1 min-h-0">
          {isNote ? (
            <FileText className="w-5 h-5 text-green-500 flex-shrink-0" />
          ) : (
            <Link className="w-5 h-5 text-blue-500 flex-shrink-0" />
          )}
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 break-all flex-1 min-h-0 h-auto whitespace-normal overflow-hidden max-w-[calc(100%-4rem)]">
            {title}
          </h3>
        </div>
        <div className="flex gap-2 flex-shrink-0 ml-2">
          <button
            onClick={(e) => handleButtonClick(e, onEdit)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="编辑"
          >
            <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={(e) => handleButtonClick(e, onDelete)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="删除"
          >
            <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* 收藏时间 */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words w-full max-w-full">
        创建时间：{favoriteTime}
      </div>

      {/* 笔记内容预览 */}
      {isNote && note && (
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 break-words w-full max-w-full line-clamp-3">
          {note.replace(/[#*`_~]/g, "")}
        </div>
      )}

      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mb-2 w-full">
        {(tags || []).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full break-words max-w-[200px] truncate"
          >
            #{tag_names?.[index] || tag}
          </span>
        ))}
      </div>

      {/* 文件夹位置 */}
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 break-words w-full max-w-full">
        位置：{folderPath}
      </div>
    </div>
  );
};

export default Card;
