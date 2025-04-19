import React, { useEffect, useState } from 'react';

export interface WaterfallItem {
  id: number | string;
  height: number;
  [key: string]: any; // 允许其他属性
}

interface WaterfallFlowProps {
  items: WaterfallItem[];
  columns?: number;
  gap?: number;
  className?: string;
  renderItem?: (item: WaterfallItem) => React.ReactNode;
}

const WaterfallFlow: React.FC<WaterfallFlowProps> = ({
  items,
  columns = 4,
  gap = 16,
  className = '',
  renderItem,
}) => {
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const [columnItems, setColumnItems] = useState<WaterfallItem[][]>([]);

  // 初始化列高度和列项目
  useEffect(() => {
    const heights = Array(columns).fill(0);
    const cols: WaterfallItem[][] = Array(columns).fill(null).map(() => []);
    setColumnHeights(heights);
    setColumnItems(cols);
  }, [columns]);

  // 分配项目到列
  useEffect(() => {
    if (items.length === 0) return;

    const heights = Array(columns).fill(0);
    const cols: WaterfallItem[][] = Array(columns).fill(null).map(() => []);

    items.forEach((item) => {
      // 找到最短的列
      const minHeightIndex = heights.indexOf(Math.min(...heights));
      // 将项目添加到该列
      cols[minHeightIndex].push(item);
      heights[minHeightIndex] += item.height + gap;
    });

    setColumnHeights(heights);
    setColumnItems(cols);
  }, [items, columns, gap]);

  // 默认渲染函数
  const defaultRenderItem = (item: WaterfallItem) => (
    <div
      key={item.id}
      className="w-full mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg break-inside-avoid transition-colors duration-300"
      style={{ height: `${item.height}px` }}
    />
  );

  return (
    <div className={`flex ${className}`} style={{ gap: `${gap}px` }}>
      {columnItems.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="flex-1"
          style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}
        >
          {column.map((item) => (
            <div key={item.id}>
              {renderItem ? renderItem(item) : defaultRenderItem(item)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WaterfallFlow;