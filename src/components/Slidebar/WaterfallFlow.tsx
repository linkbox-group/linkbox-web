import React, { useEffect, useState, useRef } from 'react';

export interface WaterfallItem {
  id: number | string;
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
  const [columnItems, setColumnItems] = useState<WaterfallItem[][]>([]);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 初始化列项目
  useEffect(() => {
    const cols: WaterfallItem[][] = Array(columns).fill(null).map(() => []);
    setColumnItems(cols);
    columnRefs.current = Array(columns).fill(null);
    itemRefs.current = {};
  }, [columns]);

  // 分配项目到列
  useEffect(() => {
    if (items.length === 0) return;

    const cols: WaterfallItem[][] = Array(columns).fill(null).map(() => []);
    const heights: number[] = Array(columns).fill(0);

    // 先按顺序分配项目
    items.forEach((item) => {
      const minHeightIndex = heights.indexOf(Math.min(...heights));
      cols[minHeightIndex].push(item);
      // 使用估计的高度
      heights[minHeightIndex] += 200; // 估计的卡片高度
    });

    setColumnItems(cols);
  }, [items, columns]);

  // 更新实际高度
  useEffect(() => {
    const updateHeights = () => {
      const heights: number[] = Array(columns).fill(0);
      const cols: WaterfallItem[][] = Array(columns).fill(null).map(() => []);

      items.forEach((item) => {
        const itemElement = itemRefs.current[item.id];
        if (itemElement) {
          const minHeightIndex = heights.indexOf(Math.min(...heights));
          cols[minHeightIndex].push(item);
          heights[minHeightIndex] += itemElement.offsetHeight + gap;
        }
      });

      setColumnItems(cols);
    };

    // 使用 requestAnimationFrame 确保在下一帧更新
    requestAnimationFrame(updateHeights);
  }, [items, columns, gap]);

  return (
    <div className={`flex ${className}`} style={{ gap: `${gap}px` }}>
      {columnItems.map((column, columnIndex) => (
        <div
          key={columnIndex}
          ref={el => {
            if (el) {
              columnRefs.current[columnIndex] = el;
            }
          }}
          className="flex-1"
          style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}
        >
          {column.map((item) => (
            <div 
              key={item.id} 
              ref={el => {
                if (el) {
                  itemRefs.current[item.id] = el;
                }
              }}
            >
              {renderItem ? renderItem(item) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WaterfallFlow;