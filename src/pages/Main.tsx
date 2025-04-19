import React, { useState, useEffect } from "react";
import Sidebar from "../components/Slidebar/Sidebar";
import AppBar from "../components/AppBar";
import Card from "../components/Card";
import WaterfallFlow from "../components/Slidebar/WaterfallFlow";
import TagView from "../components/TagView";
import Line from "../components/Line";
import ContentDialog from "../components/Dialogs/ContentDialog";
import { contentService, Content } from "@/services/content";
import { useUserStore } from "@/store/userStore";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";

const Main: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mode, setMode] = useState<String>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  // 使用appStore中的items和generateMockItems
  const { items, setItems, deleteItem, generateMockItems } = useAppStore();
  const { user } = useUserStore();

  // 获取收藏内容
  const fetchItems = async () => {
    try {
      setLoading(true);

      // 如果用户已登录，尝试从API获取数据
      if (user?.id) {
        const response = await contentService.getRecentContents(user.id, 20);
        const fetchedItems = response.items.map((item: Content) => ({
          id: item.id,
          height: Math.floor(Math.random() * 200) + 300,
          title: item.title,
          favoriteTime: item.created_at,
          tags: item.tags,
          folderPath: "未分类",
          link: item.url,
        }));
        setItems(fetchedItems);
      } else {
        // 如果用户未登录，使用模拟数据
        generateMockItems(20);
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      toast.error("获取数据失败");
      // 如果API请求失败，使用模拟数据
      generateMockItems(20);
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
    const cardItem = items.find((item) => item.id === id);
    if (cardItem) {
      // 将CardItem转换为Content类型
      const content: Content = {
        id: cardItem.id.toString(),
        title: cardItem.title,
        description: "",
        url: cardItem.link,
        image_url: "",
        created_at: cardItem.favoriteTime,
        updated_at: cardItem.favoriteTime,
        user_id: user?.id || "",
        tags: cardItem.tags,
      };
      setSelectedContent(content);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await contentService.deleteContent(id.toString(), user?.id || "");
      deleteItem(id);
      toast.success("删除成功");
    } catch (error) {
      console.error("删除失败:", error);
      toast.error("删除失败");
    }
  };

  // 根据模式渲染不同的组件
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">加载中...</div>
      );
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
      <ContentDialog
        mode="add"
        open={addDialogOpen}
        setOpen={setAddDialogOpen}
        onSuccess={() => {
          setAddDialogOpen(false);
          fetchItems(); // 添加完成后刷新列表
        }}
      />
      <ContentDialog
        mode="edit"
        content={selectedContent}
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        onSuccess={() => {
          setEditDialogOpen(false);
          fetchItems(); // 编辑完成后刷新列表
        }}
      />
      <AppBar
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onAdd={() => setAddDialogOpen(true)}
        username={user?.username || ""}
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
