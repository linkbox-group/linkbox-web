import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Slidebar/Sidebar";
import AppBar from "../components/AppBar";
import Card from "../components/Card";
import WaterfallFlow from "../components/Slidebar/WaterfallFlow";
import TagView from "../components/TagView";
import Line from "../components/Line";
import ContentDialog from "../components/Dialogs/ContentDialog";
import { itemService, Item } from "@/services/items";
import { useUserStore } from "@/store/userStore";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";
import { SearchResultItem } from "@/services/search";
import { searchService } from "@/services/search";
import {
  Archive,
  Grid,
  ArrowUpDown,
  List,
  Menu,
  Search,
  Plus,
  Bookmark,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organizationService } from "@/services/organization";

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    window.innerWidth < 768
  );
  const [mode, setMode] = useState<String>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Item | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [columns, setColumns] = useState(
    window.innerWidth < 640 ? 1 : 
    window.innerWidth < 1024 ? 2 : 
    window.innerWidth < 1280 ? 3 : 4
  );
  const pageSize = 10;

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 768);
      setColumns(
        window.innerWidth < 640 ? 1 : 
        window.innerWidth < 1024 ? 2 : 
        window.innerWidth < 1280 ? 3 : 4
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        const response = await itemService.getByTags({
          tags: [], // 空数组表示获取所有内容
          pagination: {
            page,
            page_size: pageSize,
          },
        });

        // 将 Item 类型转换为 CardItem 类型
        const cardItems = response.data.items.map((item: Item) => ({
          id: item.id,
          height: Math.floor(Math.random() * 200) + 300,
          title: item.title,
          favoriteTime: item.created_at,
          tags: item.tags || [],
          folderPath:
            item.collection_ids?.length > 0 ? item.collection_ids[0] : "未分类",
          link: item.url,
        }));

        // 更新状态
        setItems(cardItems);
        setTotalPages(response.data.total_pages);
        setCurrentPage(response.data.page);
      } else {
        // 如果用户未登录，跳转到登录页面
        navigate("/auth");
        return;
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      toast.error("获取数据失败");
      setItems([]);
      setTotalPages(1);
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

      if (result.data.items.length > 0) {
        // 将搜索结果转换为 items 格式
        const searchItems = result.data.items.map((item: SearchResultItem) => ({
          id: item.id,
          height: Math.floor(Math.random() * 200) + 300,
          title: item.title,
          favoriteTime: item.createdAt,
          tags: [], // 暂时使用空数组，因为 SearchResultItem 中没有 tags 字段
          folderPath: item.collections[0]?.name || "未分类",
          link: item.url || "",
        }));
        setItems(searchItems);
        setTotalPages(
          Math.ceil(
            result.data.pagination.totalItems / result.data.pagination.pageSize
          )
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

  // 获取组织列表
  const fetchOrganizations = async () => {
    try {
      if (user?.id) {
        const response = await organizationService.getList(user.id);
        console.log("组织列表:", response.data.organizations);

        // 如果组织列表为空，创建根目录
        if (!response.data.organizations) {
          await organizationService.create({
            user_id: user.id,
            name: "根目录",
            code: "root",
            parent_code: "",
            description: "根目录",
            is_default: true,
            is_shared: false,
            share_code: undefined,
            share_expire_at: undefined,
            sort_order: 0,
          });
          console.log("已创建根目录");
        }
      }
    } catch (error) {
      console.error("获取组织列表失败:", error);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchItems();
    fetchOrganizations();
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
      // 将CardItem转换为Item类型
      const item: Item = {
        id: cardItem.id.toString(),
        user_id: user?.id?.toString() || "",
        type: 1,
        title: cardItem.title,
        description: "",
        url: cardItem.link,
        thumbnail_url: "",
        metadata: {
          title: cardItem.title,
          description: "",
          thumbnail_url: "",
          author: "",
          site_name: "",
          favicon_url: "",
          content_type: "",
          keywords: [],
          language: "",
          is_article: false,
        },
        tags: cardItem.tags,
        collection_ids: [],
        is_favorite: false,
        is_private: false,
        is_archived: false,
        note: "",
        read_count: 0,
        created_at: cardItem.favoriteTime,
        updated_at: cardItem.favoriteTime,
      };
      setSelectedContent(item);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await itemService.delete(id.toString());
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

    if (!items || items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500 dark:text-gray-400">
          <Bookmark className="w-16 h-16 mb-4" />
          <p className="text-lg">还没有收藏哦</p>
        </div>
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
            columns={columns}
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
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      <ContentDialog
        mode="add"
        open={addDialogOpen}
        setOpen={setAddDialogOpen}
        onSuccess={() => {
          setAddDialogOpen(false);
          fetchItems();
        }}
      />
      <ContentDialog
        mode="edit"
        content={selectedContent}
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        onSuccess={() => {
          setEditDialogOpen(false);
          fetchItems();
        }}
      />
      <AppBar
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onAdd={() => setAddDialogOpen(true)}
        username={user?.username || ""}
        onSearch={handleSearch}
      />
      <div className="flex flex-1 min-h-0 overflow-x-hidden">
        <div
          className={`flex-shrink-0 transition-all duration-300 ${
            sidebarCollapsed ? "w-0" : "w-70"
          }`}
        >
          <Sidebar collapsed={sidebarCollapsed} onSelectedCard={setMode} />
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <div className="flex items-center justify-end gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Archive className="w-5 h-5" />
                <span>全部</span>
              </div>
              <div
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-gray-100"
                onClick={handleModeChange}
              >
                {mode === "all" ? (
                  <Grid className="w-5 h-5" />
                ) : (
                  <List className="w-5 h-5" />
                )}
                <span>模式</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Select>
                  <SelectTrigger className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border-0 bg-transparent p-0 h-auto cursor-pointer">
                    <ArrowUpDown className="w-5 h-5" />
                    <span>排序</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">时间排序</SelectItem>
                    <SelectItem value="title">标题排序</SelectItem>
                    <SelectItem value="folder">文件夹排序</SelectItem>
                  </SelectContent>
                </Select>
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
                        className={`${
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        } text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100`}
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
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        } text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100`}
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
    </div>
  );
};

export default Main;
