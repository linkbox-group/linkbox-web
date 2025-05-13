import React from "react";
import { CardItem } from "@/types";
import Card from "@/components/Main/Card";
import Line from "@/components/Main/Line";
import TagView from "@/components/Main/TagView";
import TrashContent from "@/components/Main/TrashContent";
import WaterfallFlow from "@/components/WaterfallFlow";
import { Bookmark } from "lucide-react";
import { TrashItem } from "@/services/trash";
import { useAppStore } from "@/store/appStore";

interface MainContentProps {
  loading: boolean;
  items: CardItem[];
  trashItems?: TrashItem[];
  columns: number;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
  onRecover?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  onTagClick?: (tag: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  loading,
  items,
  trashItems = [],
  columns,
  onEdit,
  onDelete,
  onRecover,
  onPermanentDelete,
  onTagClick,
}) => {
  const { viewMode, pageMode, filterTag } = useAppStore();

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[70vh]">
        <div className="text-gray-500 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

  // 非回收站模式下的空状态
  if (pageMode === "normal" && (!items || items.length === 0)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 min-h-[70vh]">
        <Bookmark className="w-16 h-16 mb-4" />
        <p className="text-lg">还没有收藏哦</p>
      </div>
    );
  }
  // 回收站模式
  if (pageMode === "trash") {
    return (
      <TrashContent
        mode="trash"
        loading={loading}
        items={trashItems}
        columns={columns}
        onRecover={(id) => onRecover?.(id)}
        onDelete={(id) => onPermanentDelete?.(id)}
      />
    );
  }

  // 正常模式下的不同视图
  switch (viewMode) {
    case "line":
      return (
        <div className="flex-1 space-y-1 min-h-[70vh]">
          {items.map((item) => (
            <Line
              key={item.id}
              title={item.title}
              favoriteTime={item.favoriteTime}
              tags={item.tags}
              folderPath={item.folderPath}
              link={item.link}
              type={item.type}
              note={item.note}
              onEdit={() => onEdit(item.id)}
              onDelete={() => onDelete(item.id)}
            />
          ))}
        </div>
      );
    case "tag":
      return (
        <div className="flex-1 w-full overflow-y-scroll min-h-[70vh]">
          <div className="flex flex-col gap-8">
            {filterTag ? (
              <div className="flex flex-col gap-4">
                {/* 标签显示区域 */}
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pt-2 pb-1">
                  <div className="inline-flex w-fit bg-[#F0F0F0] dark:bg-[#2a3349] overflow-hidden rounded-[10px] m-2 p-2 outline outline-[#3D87C2] dark:outline-[#1e2538] transition-colors duration-300">
                    <div className="text-[#3C89C4] dark:text-blue-400 text-base font-['Inter'] transition-colors duration-300">
                      #{filterTag}
                    </div>
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
                        tag_names={item.tag_names}
                        folderPath={item.folderPath}
                        link={item.link}
                        type={item.type}
                        note={item.note}
                        onEdit={() => onEdit(item.id)}
                        onDelete={() => onDelete(item.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              Array.from(new Set(items.flatMap((item) => item.tags || []))).map(
                (tag) => {
                  // 获取包含当前标签的内容
                  const tagItems = items.filter((item) =>
                    item.tags?.includes(tag)
                  );

                  return (
                    <div key={tag} className="flex flex-col gap-4">
                      {/* 标签显示区域 */}
                      <div
                        className="inline-flex w-fit bg-[#F0F0F0] dark:bg-[#2a3349] overflow-hidden rounded-[10px] m-2 p-2 outline outline-[#3D87C2] dark:outline-[#1e2538] transition-colors duration-300 cursor-pointer hover:bg-[#E0E0E0] dark:hover:bg-[#3a4359]"
                        onClick={() => onTagClick?.(tag)}
                      >
                        <div className="text-[#3C89C4] dark:text-blue-400 text-base font-['Inter'] transition-colors duration-300">
                          #{tag}
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
                              type={item.type}
                              note={item.note}
                              onEdit={() => onEdit(item.id)}
                              onDelete={() => onDelete(item.id)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>
      );
    case "all":
    default:
      return (
        <div className="flex-1 min-h-[70vh]">
          {items.length > 0 && (
            <WaterfallFlow
              items={items}
              columns={columns}
              gap={16}
              renderItem={(item) => (
                <Card
                  key={item.id}
                  title={item.title}
                  favoriteTime={item.favoriteTime}
                  tags={item.tags}
                  tag_names={item.tags}
                  folderPath={item.folderPath}
                  link={item.link}
                  type={item.type}
                  note={item.note}
                  onEdit={() => onEdit(item.id)}
                  onDelete={() => onDelete(item.id)}
                />
              )}
            />
          )}
        </div>
      );
  }
};

export default MainContent;
