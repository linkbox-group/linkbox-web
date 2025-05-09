import React, { useState, useRef } from "react";
import FavoritesCard from "./Cards/FavoritesCard";
import AISuggestionCard from "./Cards/AISuggestionCard";
import AllFavoritesCard from "./Cards/TagsCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Folder, Bot, Tag, Trash2 } from "lucide-react";

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
          <div className="h-full w-full">
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
            </Swiper>
          </div>

          {/* 垃圾桶按钮固定在左下角 */}
          <div className="absolute bottom-0 left-0 z-10 py-2 mr-2">
            <TabButton icon={Trash2} active={activeTab === "trash"} />
          </div>

          {/* 底部导航栏 */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex justify-around items-center py-2 px-4 z-10">
            <TabButton
              icon={Folder}
              active={activeTab === "favorites"}
              onClick={() => handleTabChange("favorites", 0)}
            />
            <TabButton
              icon={Bot}
              active={activeTab === "ai"}
              onClick={() => handleTabChange("ai", 1)}
            />
            <TabButton
              icon={Tag}
              active={activeTab === "tags"}
              onClick={() => handleTabChange("tags", 2)}
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
  active: boolean;
  onClick?: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  icon: Icon,
  active,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-2 mx-1 rounded-full transition-[transform,scale] duration-200 ${
        active
          ? "text-[#355DA1] dark:text-blue-400 bg-gray-100 dark:bg-gray-800 scale-110"
          : "text-gray-600 dark:text-gray-400 hover:text-[#355DA1] dark:hover:text-blue-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 hover:scale-110"
      }`}
    >
      <Icon size={20} />
    </button>
  );
};

export default Sidebar;
