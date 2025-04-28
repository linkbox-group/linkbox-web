import React, { useState, useRef, useEffect } from "react";
import FavoritesCard from "./Cards/FavoritesCard";
import AISuggestionCard from "./Cards/AISuggestionCard";
import UtilsCard from "./Cards/UtilsCard";
import AllFavoritesCard from "./Cards/AllFavoritesCard";

const CARD_DATA = [
  {
    id: 1,
    type: "favorites",
  },
  {
    id: 2,
    type: "ai",
  },
  {
    id: 3,
    type: "recent",
  },
  {
    id: 4,
    type: "tags",
  },
];

interface SidebarProps {
  collapsed: boolean;
  onSelectedCard: (mode: string) => void;
  onOrganizationSelect?: (organizationId: string) => void;
  onAddOrganization?: (parentCode: string) => void;
  onDeleteOrganization?: (organization: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onSelectedCard, onOrganizationSelect, onAddOrganization, onDeleteOrganization }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 当 currentIndex 变化时，检查最上面的卡片是否为 AI 卡片
  useEffect(() => {
    const topCard = CARD_DATA[currentIndex];
    if (topCard && topCard.type === "ai") {
      onSelectedCard("tag");
    }else{
      onSelectedCard("all")
    }
  }, [currentIndex, onSelectedCard]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentY(e.clientY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const dragDistance = currentY - startY;
    if (Math.abs(dragDistance) > 50) {
      if (dragDistance > 0) {
        setCurrentIndex((prev) => (prev - 1 + CARD_DATA.length) % CARD_DATA.length);
      } else {
        setCurrentIndex((prev) => (prev + 1) % CARD_DATA.length);
      }
    }

    setIsDragging(false);
  };

  // 处理鼠标滚轮事件
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      // 向下滚动，显示下一张卡片
      setCurrentIndex((prev) => (prev + 1) % CARD_DATA.length);
    } else {
      // 向上滚动，显示上一张卡片
      setCurrentIndex((prev) => (prev - 1 + CARD_DATA.length) % CARD_DATA.length);
    }
  };

  const renderCard = (type: string) => {
    switch (type) {
      case "favorites":
        return <FavoritesCard 
          onOrganizationSelect={onOrganizationSelect} 
          onAddOrganization={onAddOrganization}
          onDeleteOrganization={onDeleteOrganization}
        />;
      case "ai":
        return <AISuggestionCard />;
      case "recent":
        return <UtilsCard />;
      case "tags":
        return <AllFavoritesCard />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`h-full bg-white dark:bg-gray-900 mt-16 transition-all duration-300 ease-in-out ${
        collapsed ? "w-0 overflow-hidden" : "w-70"
      }`}
    >
      <div className={`w-70 h-full bg-white dark:bg-gray-900 p-4 transition-all duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
        <div
          ref={containerRef}
          className="w-full h-[400px] relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {CARD_DATA.map((card, index) => {
            const screenHeight = window.innerHeight;
            const position = (index - currentIndex + CARD_DATA.length) % CARD_DATA.length;
            const baseTranslateY = position * 130 * screenHeight / 1080;
            const dragOffset = isDragging ? currentY - startY : 0;
            const translateY = baseTranslateY + (position === 0 ? dragOffset : 0);
            const scale = 1 - (position * 0.05);

            return (
              <div
                key={card.id}
                className={`absolute w-full transition-all duration-300 ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  zIndex: CARD_DATA.length - position,
                }}
              >
                {renderCard(card.type)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
