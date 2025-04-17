import React from 'react';

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
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {/* 标题和操作按钮 */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-1 hover:bg-gray-100 rounded-full"
            title="编辑"
          >
            <svg
              className="w-5 h-5 text-gray-600"
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
              className="w-5 h-5 text-gray-600"
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

      {/* 收藏时间 */}
      <div className="text-sm text-gray-500 mb-2">
        收藏时间：{favoriteTime}
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 文件夹位置 */}
      <div className="text-sm text-gray-600 mb-2">
        位置：{folderPath}
      </div>

      {/* 链接 */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:text-blue-800 truncate block"
      >
        {link}
      </a>
    </div>
  );
};

export default Card;
