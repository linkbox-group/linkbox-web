import React, { useState, useRef, useEffect } from "react";
import FavoritesCard from "./Cards/FavoritesCard";
import AISuggestionCard from "./Cards/AISuggestionCard";
import AllFavoritesCard from "./Cards/TagsCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Star, MessageSquare, Tag, Trash2 } from "lucide-react";

// 导入 Swiper 样式
// @ts-ignore
import "swiper/css";

interface SidebarProps {
  collapsed: boolean;
  onSelectedCard: (mode: string) => void;
  onOrganizationSelect?: (organizationId: string) => void;
  onAddOrganization?: (parentCode: string) => void;
  onDeleteOrganization?: (organization: any) => void;
  parentCode: string;
  setCurrentOrganizationId: (code: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onSelectedCard,
  onOrganizationSelect,
  onAddOrganization,
  onDeleteOrganization,
  parentCode,
  setCurrentOrganizationId,
}) => {
  const [activeTab, setActiveTab] = useState("favorites");
  const swiperRef = useRef<any>(null);

  const handleTabChange = (tabType: string, index: number) => {
    setActiveTab(tabType);
    onSelectedCard(tabType);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  return (
    <div
      className={`h-full transition-all duration-300 ${
        collapsed ? "w-0 opacity-0 overflow-hidden" : "opacity-100"
      }`}
      data-testid="sidebar"
    >
      <div className="h-full p-4">
        <div className="h-full w-full bg-white dark:bg-[#1E2333] rounded-lg shadow-[0px_4px_10.9px_rgba(0,0,0,0.16)] relative overflow-hidden">
          <div className="h-full w-full pb-16">
            <Swiper
              ref={swiperRef}
              spaceBetween={0}
              slidesPerView={1}
              initialSlide={0}
              onSlideChange={(swiper) => {
                const types = ["favorites", "ai", "tags", "trash"];
                setActiveTab(types[swiper.activeIndex]);
                onSelectedCard(types[swiper.activeIndex]);
              }}
              className="!h-full !w-full"
            >
              <SwiperSlide className="!w-full !h-full">
                <div className="h-full w-full overflow-auto">
                  <FavoritesCard
                    onOrganizationSelect={onOrganizationSelect}
                    onAddOrganization={onAddOrganization}
                    onDeleteOrganization={onDeleteOrganization}
                    parentCode={parentCode}
                    setCurrentOrganizationId={setCurrentOrganizationId}
                  />
                </div>
              </SwiperSlide>

              <SwiperSlide className="!w-full !h-full">
                <div className="h-full w-full overflow-auto">
                  <AISuggestionCard />
                </div>
              </SwiperSlide>

              <SwiperSlide className="!w-full !h-full">
                <div className="h-full w-full overflow-auto">
                  <AllFavoritesCard />
                </div>
              </SwiperSlide>

              <SwiperSlide className="!w-full !h-full">
                <div className="h-full w-full overflow-auto flex items-center justify-center">
                  <div className="text-gray-500 dark:text-gray-400 flex flex-col items-center">
                    <Trash2 className="w-16 h-16 mb-4" />
                    <p className="text-lg">回收站功能即将上线</p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

          {/* 底部导航栏 */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center py-3 px-4 bg-white/90 dark:bg-[#1E2333]/90 backdrop-blur-sm z-10 border-t border-gray-100 dark:border-gray-800">
            <TabButton
              icon={Star}
              label="收藏"
              active={activeTab === "favorites"}
              onClick={() => handleTabChange("favorites", 0)}
            />
            <TabButton
              icon={MessageSquare}
              label="AI助手"
              active={activeTab === "ai"}
              onClick={() => handleTabChange("ai", 1)}
            />
            <TabButton
              icon={Tag}
              label="标签"
              active={activeTab === "tags"}
              onClick={() => handleTabChange("tags", 2)}
            />
            <TabButton
              icon={Trash2}
              label="回收站"
              active={activeTab === "trash"}
              onClick={() => handleTabChange("trash", 3)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 标签按钮组件
interface TabButtonProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  icon: Icon,
  label,
  active,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 transition-colors ${
        active
          ? "text-[#355DA1] dark:text-blue-400"
          : "text-gray-600 dark:text-gray-400 hover:text-[#355DA1] dark:hover:text-blue-400"
      }`}
    >
      <Icon size={20} />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default Sidebar;
