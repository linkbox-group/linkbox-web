import React, { useState, useEffect } from "react";
import Sidebar from "../components/Slidebar/Sidebar";
import AppBar from "../components/AppBar";
import Card from "../components/Card";
import WaterfallFlow, {
  WaterfallItem,
} from "../components/Slidebar/WaterfallFlow";
import TagView from "../components/TagView";
import Line from "../components/Line";
import AddDialog from "../components/Dialogs/AddDialog";
import LoginDialog from "../components/Dialogs/LoginDialog";
import { contentService, Content } from "@/services/content";
import { useMessageStore } from "@/store/messageStore";
import { useUserStore } from "@/store/userStore";

interface CardItem extends WaterfallItem {
  // id已经在WaterfallItem中定义为number | string
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
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [items, setItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { addMessage } = useMessageStore();
  const { user } = useUserStore();

  // 获取收藏内容
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await contentService.getRecentContents(user?.id || "", 20);
      setItems(response.items.map((item: Content) => ({
        id: item.id,
        height: Math.floor(Math.random() * 200) + 300,
        title: item.title,
        favoriteTime: item.created_at,
        tags: item.tags,
        folderPath: item.collection_ids[0] || "未分类",
        link: item.url
      })));
    } catch (error) {
      addMessage({
        type: "error",
        content: "获取收藏内容失败",
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchItems();
  }, []);

  const handleModeChange = () => {
    if (mode === "all") {
      setMode("line");
    } else {
      setMode("all");
    }
  };

  const handleEdit = (id: string | number) => {
    console.log("编辑项目:", id);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await contentService.deleteContent(id.toString(), user?.id || "");
      setItems(items.filter(item => item.id !== id));
      addMessage({
        type: "success",
        content: "删除成功",
        duration: 3000
      });
    } catch (error) {
      addMessage({
        type: "error",
        content: "删除失败",
        duration: 3000
      });
    }
  };

  const handleUserClick = () => {
    if (!user?.isLoggedIn) {
      setLoginDialogOpen(true);
    }
  };

  // 根据模式渲染不同的组件
  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-full">加载中...</div>;
    }

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
                onEdit={() => handleEdit(item.id)}
                onDelete={() => handleDelete(item.id)}
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
                onEdit={() => handleEdit(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            )}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <AddDialog open={addDialogOpen} setOpen={setAddDialogOpen} onAdd={() => {
        setAddDialogOpen(false);
        fetchItems(); // 添加完成后刷新列表
      }} />
      <LoginDialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} />
      <AppBar
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onAdd={() => setAddDialogOpen(true)}
        onUserClick={handleUserClick}
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
