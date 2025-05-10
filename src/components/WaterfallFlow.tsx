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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // 初始化列项目
  useEffect(() => {
    if (items.length === 0) {
      setColumnItems([]);
      setIsInitialized(false);
      return;
    }

    const cols: WaterfallItem[][] = Array(columns).fill(null).map(() => []);
    setColumnItems(cols);
    columnRefs.current = Array(columns).fill(null);
    itemRefs.current = {};
    setIsInitialized(false);

    // 使用 ResizeObserver 监听容器大小变化
    if (containerRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        setIsInitialized(true);
      });
      resizeObserverRef.current.observe(containerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [columns, items.length]);

  // 分配项目到列
  useEffect(() => {
    if (items.length === 0 || !isInitialized) return;

    const updateLayout = () => {
      const heights: number[] = Array(columns).fill(0);
      const cols: WaterfallItem[][] = Array(columns).fill(null).map(() => []);

      // 先按顺序分配项目
      items.forEach((item) => {
        const minHeightIndex = heights.indexOf(Math.min(...heights));
        cols[minHeightIndex].push(item);
        // 使用实际高度或默认高度
        const itemElement = itemRefs.current[item.id];
        heights[minHeightIndex] += (itemElement?.offsetHeight || 300) + gap;
      });

      setColumnItems(cols);
    };

    // 使用 requestAnimationFrame 确保在下一帧更新
    requestAnimationFrame(updateLayout);
  }, [items, columns, gap, isInitialized]);

  // 监听窗口大小变化
  useEffect(() => {
    if (!isInitialized) return;

    const handleResize = () => {
      requestAnimationFrame(() => {
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
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items, columns, gap, isInitialized]);

  // 如果没有项目，返回 null
  if (items.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`flex w-full h-full ${className}`} 
      style={{ gap: `${gap}px` }}
    >
      {columnItems.map((column, columnIndex) => (
        <div
          key={columnIndex}
          ref={el => {
            if (el) {
              columnRefs.current[columnIndex] = el;
            }
          }}
          className="flex-1 min-w-0"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: `${gap}px`,
            height: 'fit-content'
          }}
        >
          {column.map((item) => (
            <div 
              key={item.id} 
              ref={el => {
                if (el) {
                  itemRefs.current[item.id] = el;
                }
              }}
              className="w-full"
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