import React, { useState, useEffect } from "react";
import Card from "./Card";
import { tagService, Tag } from "@/services/tags";
import { useUserStore } from "@/store/userStore";

interface CardItem {
  id: string | number;
  title: string;
  favoriteTime: string;
  tags: string[];
  tag_names: string[];
  folderPath: string;
  link: string;
}

interface TagViewProps {
  items: Array<CardItem>;
}

const TagView: React.FC<TagViewProps> = ({ items }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchTags = async () => {
      if (!user?.id) return;
      try {
        const response = await tagService.getTags();
        setTags(response.data?.tags || []);
      } catch (error) {
        console.error("获取标签失败:", error);
      }
    };

    fetchTags();
  }, [user?.id]);

  // 获取所有唯一的标签
  const allTags = Array.from(new Set(items.flatMap(item => item.tags || [])));

  // 如果没有标签，显示所有内容
  if (allTags.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="overflow-x-auto max-w-full">
          <div className="flex gap-4 pb-4">
            {items.map((item) => (
              <Card
                key={item.id}
                title={item.title}
                favoriteTime={item.favoriteTime}
                tags={item.tags}
                tag_names={item.tag_names}
                folderPath={item.folderPath}
                link={item.link}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {allTags.map((tag) => {
        // 获取包含当前标签的内容
        const tagItems = items.filter(item => item.tags?.includes(tag));
        
        // 获取标签的显示名称
        const tagName = tagItems[0]?.tag_names?.[tagItems[0].tags.indexOf(tag)] || tag;

        return (
          <div key={tag} className="flex flex-col gap-4">
            {/* 标签显示区域 */}
            <div className="inline-flex w-fit bg-[#F0F0F0] dark:bg-[#2a3349] overflow-hidden rounded-[10px] m-2 p-2 outline outline-[#3D87C2] dark:outline-[#1e2538] transition-colors duration-300">
              <div className="text-[#3C89C4] dark:text-blue-400 text-base font-['Inter'] transition-colors duration-300">
                #{tagName}
              </div>
            </div>

            {/* 横向滚动列表 */}
            <div className="overflow-x-auto max-w-full">
              <div className="flex gap-4 pb-4">
                {tagItems.map((item) => (
                  <Card
                    key={item.id}
                    title={item.title}
                    favoriteTime={item.favoriteTime}
                    tags={item.tags}
                    tag_names={item.tag_names}
                    folderPath={item.folderPath}
                    link={item.link}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TagView;
