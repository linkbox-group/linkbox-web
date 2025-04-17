import React from "react";

const AllFavoritesCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#EEF4FF] to-[#3C89C4] rounded-lg shadow-sm p-4 select-none h-96">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <img src="/icons/folder.svg" alt="全部收藏" className="w-5 h-5" />
          <span className="text-gray-700 font-medium">全部收藏</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="/icons/search.svg" alt="搜索" className="w-4 h-4" />
          <span className="text-gray-500 text-sm">默认</span>
        </div>
      </div>
      <img src="/icons/plus.svg" alt="添加" className="w-5 h-5" />

      <div className="space-y-2">
        <div className="h-8 bg-gray-100 rounded"></div>
        <div className="h-8 bg-gray-100 rounded"></div>
        <div className="h-8 bg-gray-100 rounded"></div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <img src="/icons/tag.svg" alt="标签" className="w-5 h-5" />
          <span className="text-gray-700 font-medium">标签</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="/icons/search.svg" alt="搜索" className="w-4 h-4" />
          <span className="text-gray-500 text-sm">默认</span>
        </div>
      </div>
      <img src="/icons/plus.svg" alt="添加" className="w-5 h-5" />

      <div className="space-y-2">
        <div className="h-8 bg-gray-100 rounded"></div>
        <div className="h-8 bg-gray-100 rounded"></div>
        <div className="h-8 bg-gray-100 rounded"></div>
      </div>
    </div>
  );
};

export default AllFavoritesCard;
