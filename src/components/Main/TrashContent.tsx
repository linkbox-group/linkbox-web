import React from 'react';
import { TrashItem } from '@/services/trash';
import { Trash2, RotateCcw } from 'lucide-react';

interface TrashContentProps {
  mode: string;
  loading: boolean;
  items: TrashItem[];
  columns: number;
  onRecover: (id: string) => void;
  onDelete: (id: string) => void;
}

const TrashContent: React.FC<TrashContentProps> = ({
  mode,
  loading,
  items,
  columns,
  onRecover,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[70vh]">
        <div className="text-gray-500 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 min-h-[70vh]">
        <Trash2 className="w-16 h-16 mb-4" />
        <p className="text-lg">回收站是空的</p>
      </div>
    );
  }

  const renderTrashCard = (item: TrashItem) => (
    <div
      key={item.id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {item.title}
        </h3>
        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div>
            删除时间：{new Date(item.deleted_at).toLocaleString()}
          </div>
          <div>
            过期时间：{new Date(item.expired_at).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end space-x-2">
        <button
          onClick={() => onRecover(item.id)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          恢复
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          删除
        </button>
      </div>
    </div>
  );

  const renderTrashLine = (item: TrashItem) => (
    <div
      key={item.id}
      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-2"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {item.title}
        </h3>
        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <span>删除：{new Date(item.deleted_at).toLocaleString()}</span>
          <span>过期：{new Date(item.expired_at).toLocaleString()}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={() => onRecover(item.id)}
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          恢复
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          删除
        </button>
      </div>
    </div>
  );

  switch (mode) {
    case "line":
      return (
        <div className="flex-1 space-y-1 min-h-[70vh]">
          {items.map(renderTrashLine)}
        </div>
      );
    case "all":
    default:
      return (
        <div className="flex-1 min-h-[70vh] p-4">
          <div 
            className="grid gap-4" 
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {items.map(renderTrashCard)}
          </div>
        </div>
      );
  }
};

export default TrashContent; 