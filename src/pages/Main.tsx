import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Slidebar/Sidebar";
import AppBar from "../components/AppBar";
import Card from "../components/Card";
import WaterfallFlow from "../components/WaterfallFlow";
import TagView from "../components/TagView";
import Line from "../components/Line";
import ContentDialog from "../components/Dialogs/ContentDialog";
import ConfirmDialog from "../components/Dialogs/ConfirmDialog";
import OrganizationDialog from "../components/Dialogs/OrganizationDialog";
import { itemService, Item } from "@/services/items";
import { organizationService } from "@/services/organization";
import { useUserStore } from "@/store/userStore";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";
import {
  Archive,
  Grid,
  ArrowUpDown,
  List,
  Bookmark,
  CheckIcon,
  LayoutGrid,
  LayoutList,
  Tags,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Main: React.FC = () => {
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
  const [sortField, setSortField] = useState<"created_at" | "title">(
    "created_at"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [columns, setColumns] = useState(
    window.innerWidth < 640
      ? 1
      : window.innerWidth < 1024
      ? 2
      : window.innerWidth < 1280
      ? 3
      : 4
  );
  const pageSize = 10;
  const fetchItemsRef = useRef(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [organizationDialogOpen, setOrganizationDialogOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<any>(null);
  const [deleteOrganizationDialogOpen, setDeleteOrganizationDialogOpen] =
    useState(false);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 768);
      setColumns(
        window.innerWidth < 640
          ? 1
          : window.innerWidth < 1024
          ? 2
          : window.innerWidth < 1920
          ? 3
          : 4
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  // 使用appStore
  const {
    items,
    setItems,
    deleteItem,
    currentOrganizationId,
    setCurrentOrganizationId,
    selectOrganization,
  } = useAppStore();
  const { user } = useUserStore();

  // 监听 items 变化
  useEffect(() => {
    if (items && items.length > 0) {
      // 当 items 变化时，更新瀑布流布局
      const observer = new ResizeObserver((entries) => {
        const updatedItems = [...items];
        entries.forEach((entry) => {
          const card = entry.target;
          const index = card.getAttribute("data-index");
          if (index !== null) {
            updatedItems[parseInt(index)].height = entry.contentRect.height;
          }
        });
        setItems(updatedItems);
      });

      requestAnimationFrame(() => {
        const cards = document.querySelectorAll(".card");
        cards.forEach((card, index) => {
          card.setAttribute("data-index", index.toString());
          observer.observe(card);
        });
      });

      return () => observer.disconnect();
    }
  }, [items, setItems]);

  // 修改 fetchItems 函数
  const fetchItems = async (
    page: number = 1,
    sortField: "created_at" | "title" = "created_at",
    sortDirection: "asc" | "desc" = "desc"
  ) => {
    try {
      setLoading(true);
      const organizationId = currentOrganizationId || "0";
      setCurrentOrganizationId(organizationId);
      const response = await itemService.getOrganizationItems({
        organization_id: organizationId,
        page: page,
        page_size: pageSize,
        sort_field: sortField,
        sort_direction: sortDirection,
      });

      if (response.data?.items) {
        const initialItems = response.data.items.map((item: Item) => ({
          id: item.id,
          height: 300,
          title: item.title,
          favoriteTime: item.created_at,
          tags: item.tag_names || [],
          tag_names: item.tag_names || [],
          folderPath: item.organization_path || "未分类",
          link: item.url,
          type: item.type,
          note: item.note,
        }));

        setItems(initialItems);
        setTotalPages(response.data.total_pages);
        setCurrentPage(page);
      } else {
        setItems([]);
        setTotalPages(1);
        setCurrentPage(1);
        toast.info("暂无内容");
      }
    } catch (error) {
      console.error("获取内容失败:", error);
      toast.error("获取内容失败");
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    if (!fetchItemsRef.current) {
      fetchItems();
      fetchItemsRef.current = true;
    }
  }, []);

  // 监听排序变化
  useEffect(() => {
    if (fetchItemsRef.current) {
      fetchItems(currentPage, sortField, sortDirection);
    }
  }, [sortField, sortDirection]);

  // 监听页码变化
  useEffect(() => {
    if (fetchItemsRef.current) {
      fetchItems(currentPage, sortField, sortDirection);
    }
  }, [currentPage]);

  // 监听组织变化
  useEffect(() => {
    if (fetchItemsRef.current) {
      fetchItems(1, sortField, sortDirection);
    }
  }, [currentOrganizationId]);

  // 处理排序变化
  const handleSortChange = (value: string) => {
    let newSortField: "created_at" | "title" = "created_at";
    let newSortDirection: "asc" | "desc" = "desc";

    switch (value) {
      case "time":
        newSortField = "created_at";
        newSortDirection = "desc";
        break;
      case "title":
        newSortField = "title";
        newSortDirection = "asc";
        break;
      default:
        break;
    }

    setSortField(newSortField);
    setSortDirection(newSortDirection);
    setCurrentPage(1); // 重置页码
    fetchItems(1, newSortField, newSortDirection);
  };

  // 处理搜索
  const handleSearch = async (keyword: string, page: number = 1) => {
    try {
      setIsSearching(true);
      setSearchKeyword(keyword);
      setCurrentPage(page);
      const result = await itemService.search({
        query: keyword,
        item_type: "LINK",
        pagination: {
          page,
          page_size: pageSize,
        },
      });

      if (result.data?.items) {
        // 将搜索结果转换为 items 格式
        const searchItems = result.data.items.map((item: Item) => ({
          id: item.id,
          height: Math.floor(Math.random() * 200) + 300,
          title: item.title,
          favoriteTime: item.created_at,
          tags: item.tag_names || [],
          tag_names: item.tag_names || [],
          folderPath: item.organization_path || "未分类",
          link: item.url,
        }));
        setItems(searchItems);
        setTotalPages(result.data.total_pages);
      } else {
        setItems([]);
        setTotalPages(1);
        toast.info("未找到结果");
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
      const item: Item = {
        id: cardItem.id.toString(),
        user_id: user?.id?.toString() || "",
        type: cardItem.type || "1",
        title: cardItem.title,
        description: "",
        url: cardItem.link,
        thumbnail_url: "",
        tag_names: cardItem.tags,
        tags: cardItem.tags,
        organization_id: "",
        organization_path: "",
        deleted_at: "1970-01-01T00:00:00Z",
        note: cardItem.note || "",
        created_at: cardItem.favoriteTime,
        updated_at: cardItem.favoriteTime,
      };
      setSelectedContent(item);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = async (id: string | number) => {
    const cardItem = items.find((item) => item.id === id);
    if (cardItem) {
      const item: Item = {
        id: cardItem.id.toString(),
        user_id: user?.id?.toString() || "",
        type: cardItem.type || "1",
        title: cardItem.title,
        description: "",
        url: cardItem.link,
        thumbnail_url: "",
        tag_names: cardItem.tags,
        tags: cardItem.tags,
        organization_id: "",
        organization_path: "",
        deleted_at: "1970-01-01T00:00:00Z",
        note: cardItem.note || "",
        created_at: cardItem.favoriteTime,
        updated_at: cardItem.favoriteTime,
      };
      setItemToDelete(item);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await itemService.delete(itemToDelete.id.toString());
      deleteItem(itemToDelete.id);
      toast.success("删除成功");
    } catch (error) {
      console.error("删除失败:", error);
      toast.error("删除失败");
    }
  };

  const handleAddOrganization = (organizationId: string) => {
    setCurrentOrganizationId(organizationId);
    setOrganizationDialogOpen(true);
  };

  const handleDeleteOrganization = (organization: any) => {
    setOrganizationToDelete(organization);
    setDeleteOrganizationDialogOpen(true);
  };

  const handleDeleteOrganizationConfirm = async () => {
    if (!organizationToDelete) return;

    try {
      await organizationService.delete(organizationToDelete.id);
      toast.success("删除成功");
      // 重新获取组织列表
      const sidebar = document.querySelector('[data-testid="sidebar"]');
      if (sidebar) {
        const event = new CustomEvent("refreshOrganizations");
        sidebar.dispatchEvent(event);
      }
    } catch (error) {
      console.error("删除失败:", error);
      toast.error("删除失败");
    } finally {
      setDeleteOrganizationDialogOpen(false);
      setOrganizationToDelete(null);
    }
  };

  // 根据模式渲染不同的组件
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-1 flex justify-center items-center min-h-[70vh]">
          <div className="text-gray-500 dark:text-gray-400">加载中...</div>
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 min-h-[70vh]">
          <Bookmark className="w-16 h-16 mb-4" />
          <p className="text-lg">还没有收藏哦</p>
        </div>
      );
    }

    switch (mode) {
      case "line":
        return (
          <div className="flex-1 space-y-1 min-h-[70vh]">
            {items.map((item) => (
              <Line
                key={item.id}
                title={item.title}
                favoriteTime={item.favoriteTime}
                tags={item.tags}
                folderPath={item.folderPath}
                link={item.link}
                type={item.type}
                note={item.note}
                onEdit={() => handleEdit(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        );
      case "ai":
        return (
          <div className="flex-1 w-full overflow-hidden min-h-[70vh]">
            <TagView items={items} />
          </div>
        );
      case "all":
      default:
        return (
          <div className="flex-1 min-h-[70vh]">
            {items.length > 0 && (
              <WaterfallFlow
                items={items}
                columns={columns}
                gap={16}
                renderItem={(item) => (
                  <Card
                    key={item.id}
                    title={item.title}
                    favoriteTime={item.favoriteTime}
                    tags={item.tags}
                    tag_names={item.tags}
                    folderPath={item.folderPath}
                    link={item.link}
                    type={item.type}
                    note={item.note}
                    onEdit={() => handleEdit(item.id)}
                    onDelete={() => handleDelete(item.id)}
                  />
                )}
              />
            )}
          </div>
        );
    }
  };

  // 修改分页组件的渲染逻辑
  const renderPagination = () => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={`${
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                } text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100`}
              >
                上一页
              </PaginationPrevious>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
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
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <AppBar
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onAdd={() => setAddDialogOpen(true)}
        username={user?.username || ""}
        onSearch={handleSearch}
      />
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-shrink-0 transition-all duration-300 ${
            sidebarCollapsed ? "w-0" : "w-[280px]"
          }`}
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            onSelectedCard={setMode}
            parentCode={currentOrganizationId}
            setCurrentOrganizationId={setCurrentOrganizationId}
          />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          <div className="flex-1 overflow-auto p-4 flex flex-col h-full">
            <div className="flex items-center justify-end gap-4 mb-4">
              <div
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 select-none cursor-pointer hover:text-gray-800 dark:hover:text-gray-100"
                onClick={() => fetchItems(1, sortField, sortDirection)}
              >
                <Archive className="w-5 h-5" />
                <span>全部</span>
              </div>
              <div
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-gray-100 select-none"
                onClick={() => handleModeChange()}
              >
                {mode === "all" ? (
                  <LayoutList className="w-5 h-5" />
                ) : mode === "line" ? (
                  <LayoutGrid className="w-5 h-5" />
                ) : (
                  <Tags className="w-5 h-5" />
                )}
                <span>模式</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 select-none">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 cursor-pointer select-none">
                    <ArrowUpDown className="w-5 h-5" />
                    <span>排序</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleSortChange("time")}>
                      <CheckIcon
                        className={`w-4 h-4 mr-2 ${
                          sortField === "created_at"
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      时间排序
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange("title")}>
                      <CheckIcon
                        className={`w-4 h-4 mr-2 ${
                          sortField === "title" ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      标题排序
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex-1 flex flex-col min-h-[calc(100vh-12rem)]">
              {renderContent()}
              {renderPagination()}
            </div>
            {/* 备案信息 */}
            <div className="h-8 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 w-full mt-auto">
              <div className="w-full text-center">
                <a
                  href="http://beian.miit.gov.cn/"
                  target="_blank"
                  rel="nofollow noopener"
                  className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  赣ICP备2022001931号
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      <ConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        title="确认删除"
        description={`确定要删除 "${itemToDelete?.title}" 吗？此操作不可恢复。`}
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
      <OrganizationDialog
        mode="add"
        open={organizationDialogOpen}
        setOpen={setOrganizationDialogOpen}
        onSuccess={() => {
          setOrganizationDialogOpen(false);
          // 重新获取组织列表
          const sidebar = document.querySelector('[data-testid="sidebar"]');
          if (sidebar) {
            const event = new CustomEvent("refreshOrganizations");
            sidebar.dispatchEvent(event);
          }
        }}
        parentCode={currentOrganizationId}
      />
      <ConfirmDialog
        open={deleteOrganizationDialogOpen}
        setOpen={setDeleteOrganizationDialogOpen}
        title="确认删除"
        description={`确定要删除 "${organizationToDelete?.name}" 吗？此操作不可恢复。`}
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleDeleteOrganizationConfirm}
        variant="destructive"
      />
    </div>
  );
};

export default Main;
