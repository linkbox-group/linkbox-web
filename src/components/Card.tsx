import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface CardProps {
  title: string;
  favoriteTime: string;
  tags: string[];
  folderPath: string;
  link: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  favoriteTime,
  tags,
  folderPath,
  link,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {/* 标题和操作按钮 */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="编辑"
          >
            <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="删除"
          >
            <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* 收藏时间 */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        收藏时间：{favoriteTime}
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 文件夹位置 */}
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        位置：{folderPath}
      </div>

      {/* 链接 */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate block"
      >
        {link}
      </a>
    </div>
  );
};

export default Card;
