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
}) => {
  const { viewMode, pageMode } = useAppStore();

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
        <div className="flex-1 w-full overflow-hidden min-h-[70vh]">
          <TagView items={items} />
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
