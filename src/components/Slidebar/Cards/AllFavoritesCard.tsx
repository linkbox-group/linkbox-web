import React from "react";
import { Folder, Search, Plus, Tag } from "lucide-react";

const AllFavoritesCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#EEF4FF] via-[#CBD8ED] via-[#89A2CC] to-[#244F99] dark:from-[#1a1f2e] dark:via-[#1e2538] dark:via-[#2a3349] dark:to-[#1a365d] rounded-lg shadow-sm p-4 select-none h-96 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-gray-700 dark:text-blue-400" />
          <span className="text-gray-700 dark:text-blue-400 font-medium">所有收藏集</span>
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500 dark:text-blue-400" />
          <span className="text-gray-500 dark:text-blue-400 text-sm">默认</span>
        </div>
      </div>
      <Plus className="w-5 h-5 text-gray-700 dark:text-blue-400" />

      <div className="space-y-2">
        <div className="h-8 bg-gray-100 dark:bg-[#2a3349] rounded transition-colors duration-300"></div>
        <div className="h-8 bg-gray-100 dark:bg-[#2a3349] rounded transition-colors duration-300"></div>
        <div className="h-8 bg-gray-100 dark:bg-[#2a3349] rounded transition-colors duration-300"></div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-gray-700 dark:text-blue-400" />
          <span className="text-gray-700 dark:text-blue-400 font-medium">标签</span>
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500 dark:text-blue-400" />
          <span className="text-gray-500 dark:text-blue-400 text-sm">默认</span>
        </div>
      </div>
      <Plus className="w-5 h-5 text-gray-700 dark:text-blue-400" />

      <div className="space-y-2">
        <div className="h-8 bg-gray-100 dark:bg-[#2a3349] rounded transition-colors duration-300"></div>
        <div className="h-8 bg-gray-100 dark:bg-[#2a3349] rounded transition-colors duration-300"></div>
        <div className="h-8 bg-gray-100 dark:bg-[#2a3349] rounded transition-colors duration-300"></div>
      </div>
    </div>
  );
};

export default AllFavoritesCard;
