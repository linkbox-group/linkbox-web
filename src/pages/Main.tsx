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
import { SearchResultItem } from "@/services/search";
import { searchService } from "@/services/search";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
const Main: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mode, setMode] = useState<String>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 10;

  // 使用appStore中的items和generateMockItems
  const { items, setItems, deleteItem, generateMockItems } = useAppStore();
  const { user } = useUserStore();

  // 获取收藏内容
  const fetchItems = async (page: number = 1) => {
    try {
      setLoading(true);
      setCurrentPage(page);

      // 如果用户已登录，尝试从API获取数据
      if (user?.id) {
        const response = await contentService.getRecentContents(
          user.id,
          pageSize,
          (page - 1).toString()
        );
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
        // 由于 API 没有返回总数，我们暂时使用固定值
        setTotalPages(5);
      } else {
        // 如果用户未登录，使用模拟数据
        generateMockItems(pageSize);
        setTotalPages(5); // 模拟总页数
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      toast.error("获取数据失败");
      // 如果API请求失败，使用模拟数据
      generateMockItems(pageSize);
      setTotalPages(5); // 模拟总页数
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = async (keyword: string, page: number = 1) => {
    try {
      setIsSearching(true);
      setSearchKeyword(keyword);
      setCurrentPage(page);
      const result = await searchService.globalSearch({
        keyword,
        page,
        pageSize,
      });

      if (result.items.length > 0) {
        // 将搜索结果转换为 items 格式
        const searchItems = result.items.map((item: SearchResultItem) => ({
          id: item.id.toString(),
          height: Math.floor(Math.random() * 200) + 300,
          title: item.title,
          favoriteTime: item.createdAt,
          tags: [], // 暂时使用空数组，因为 SearchResultItem 中没有 tags 字段
          folderPath: item.collections[0]?.name || "未分类",
          link: item.url || "",
        }));
        setItems(searchItems);
        setTotalPages(
          Math.ceil(result.pagination.totalItems / result.pagination.pageSize)
        );
      } else {
        // 如果没有搜索结果，显示提示
        toast.info("未找到相关结果");
        setItems([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("搜索失败:", error);
      toast.error("搜索失败，请重试");
    } finally {
      setIsSearching(false);
    }
  };

  // 处理页码变化
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (isSearching) {
        handleSearch(searchKeyword, page);
      } else {
        fetchItems(page);
      }
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
        onSearch={handleSearch}
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
          {/* 分页组件 */}
          {items.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    >
                      上一页
                    </PaginationPrevious>
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    >
                      下一页
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
