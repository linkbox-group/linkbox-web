import React from "react";
import Card from "./Card";

interface CardItem {
  id: string | number;
  title: string;
  favoriteTime: string;
  tags: string[];
  folderPath: string;
  link: string;
}

interface TagViewProps {
  tag: string;
  items: Array<CardItem>;
}

const TagView: React.FC<TagViewProps> = ({ tag, items }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 标签显示区域 */}
      <div
        className="inline-flex w-fit bg-[#F0F0F0] overflow-hidden rounded-[10px] m-2 p-2 outline outline-[#3D87C2]"
      >
        <div className="text-[#3C89C4] text-base font-['Inter']">
          #{tag}
        </div>
      </div>

      {/* 横向滚动列表 */}
      <div className="overflow-x-auto max-w-full">
        <div className="flex gap-4 pb-4">
          {items.map((item) => (
            <Card
              key={item.id}
              title={item.title}
              favoriteTime={item.favoriteTime}
              tags={item.tags}
              folderPath={item.folderPath}
              link={item.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagView;
