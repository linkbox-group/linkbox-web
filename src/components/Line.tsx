import React from 'react';

interface LineProps {
  title: string;
  favoriteTime: string;
  tags: string[];
  folderPath: string;
  link: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const Line: React.FC<LineProps> = ({
  title,
  favoriteTime,
  tags,
  folderPath,
  link,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center py-2 px-4 hover:bg-gray-50 border-b border-gray-200">
      {/* 标题 */}
      <div className="flex-1 min-w-[200px]">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline truncate block"
        >
          {title}
        </a>
      </div>

      {/* 收藏时间 */}
      <div className="w-[180px] text-sm text-gray-500">
        {favoriteTime}
      </div>

      {/* 标签 */}
      <div className="w-[200px] flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 文件夹位置 */}
      <div className="w-[200px] text-sm text-gray-600 truncate">
        {folderPath}
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 ml-4">
        <button
          onClick={onEdit}
          className="p-1 hover:bg-gray-100 rounded-full"
          title="编辑"
        >
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1 hover:bg-gray-100 rounded-full"
          title="删除"
        >
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Line;
