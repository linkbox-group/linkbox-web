import React from 'react';
import { CardItem } from '@/types';
import Card from '@/components/Main/Card';
import Line from '@/components/Main/Line';
import TagView from '@/components/Main/TagView';
import WaterfallFlow from '@/components/WaterfallFlow';
import { Bookmark } from 'lucide-react';

interface MainContentProps {
  mode: string;
  loading: boolean;
  items: CardItem[];
  columns: number;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  mode,
  loading,
  items,
  columns,
  onEdit,
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
        <Bookmark className="w-16 h-16 mb-4" />
        <p className="text-lg">还没有收藏哦</p>
      </div>
    );
  }

  switch (mode) {
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
    case "ai":
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