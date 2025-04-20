import React from "react";
import { Folder, Search, Plus, Tag } from "lucide-react";

const AllFavoritesCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#EEF4FF] to-[#3C89C4] dark:from-[#1a1f2e] dark:to-[#1a365d] rounded-lg shadow-sm p-4 select-none h-96 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-gray-700 dark:text-blue-400" />
          <span className="text-gray-700 dark:text-blue-400 font-medium">
            所有收藏集
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-gray-700 dark:text-blue-400" />
          <span className="text-gray-700 dark:text-blue-400 font-medium">
            标签
          </span>
        </div>
        <Plus className="w-5 h-5 text-gray-700 dark:text-blue-400" />
      </div>
    </div>
  );
};

export default AllFavoritesCard;
