import React from "react";

const FavoritesCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#EEF4FF] via-[#CBD8ED] via-[#89A2CC] to-[#244F99] rounded-lg shadow-sm p-4 select-none h-96">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <img src="/icons/folder.svg" alt="文件夹" className="w-5 h-5" />
          <span className="text-gray-700 font-medium">我的收藏集</span>
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

export default FavoritesCard;
