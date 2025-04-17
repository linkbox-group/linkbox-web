import React, { useState } from "react";
import Sidebar from "../components/Slidebar/Sidebar";
import AppBar from "../components/AppBar";
import Card from "../components/Card";
import WaterfallFlow, {
  WaterfallItem,
} from "../components/Slidebar/WaterfallFlow";
import TagView from "../components/TagView";
import Line from "../components/Line";
import AddDialog from "../components/AddDialog";
interface CardItem extends WaterfallItem {
  title: string;
  favoriteTime: string;
  tags: string[];
  folderPath: string;
  link: string;
}

const Main: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mode, setMode] = useState<String>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // 模拟数据
  const items: CardItem[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    height: Math.floor(Math.random() * 200) + 300, // 随机高度
    title: `示例标题 ${i + 1}`,
    favoriteTime: "2024-03-20 14:30",
    tags: ["摄影", "风景"],
    folderPath: "/收藏/摄影",
    link: "https://example.com",
  }));

  const handleModeChange = () => {
    if (mode === "all") {
      setMode("line");
    } else {
      setMode("all");
    }
  };

  const handleEdit = (id: number) => {
    console.log("编辑项目:", id);
  };

  const handleDelete = (id: number) => {
    console.log("删除项目:", id);
  };

  // 根据模式渲染不同的组件
  const renderContent = () => {
    switch (mode) {
      case "line":
        return (
          <div className="space-y-1">
            {items.map((item) => (
              <Line
                key={item.id}
                title={item.title}
                favoriteTime={item.favoriteTime}
                tags={item.tags}
                folderPath={item.folderPath}
                link={item.link}
                onEdit={() => handleEdit(item.id as number)}
                onDelete={() => handleDelete(item.id as number)}
              />
            ))}
          </div>
        );
      case "tag":
        return (
          <div className="w-full overflow-hidden">
            <TagView tag="全部" items={items} />
          </div>
        );
      case "all":
      default:
        return (
          <WaterfallFlow
            items={items}
            columns={3}
            gap={16}
            renderItem={(item) => (
              <Card
                title={item.title}
                favoriteTime={item.favoriteTime}
                tags={item.tags}
                folderPath={item.folderPath}
                link={item.link}
                onEdit={() => handleEdit(item.id as number)}
                onDelete={() => handleDelete(item.id as number)}
              />
            )}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <AddDialog open={addDialogOpen} setOpen={setAddDialogOpen} onAdd={() => setAddDialogOpen(false)} />
      <AppBar
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onAdd={() => setAddDialogOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} onSelectedCard={setMode} />
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex items-center justify-end gap-4 mb-4">
            <div className="flex items-center gap-2">
              <img src="/icons/archive.svg" alt="全部" className="w-5 h-5" />
              <span>全部</span>
            </div>
            <div className="flex items-center gap-2" onClick={handleModeChange}>
              <img src="/icons/grid.svg" alt="模式" className="w-5 h-5" />
              <span>模式</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/icons/settings.svg" alt="排序" className="w-5 h-5" />
              <span>排序</span>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Main;
