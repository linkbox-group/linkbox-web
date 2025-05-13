import { useState, useRef, useEffect } from "react";
import { itemService, Item } from "@/services/items";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";

export const useItemManagement = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<"created_at" | "title">(
    "created_at"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const pageSize = 10;
  const fetchItemsRef = useRef(false);
  const prevOrganizationIdRef = useRef<string | null>(null);

  const {
    items,
    setItems,
    deleteItem,
    currentOrganizationId,
    viewMode,
    pageMode,
    setViewMode,
    setPageMode,
    setFilterTag,
  } = useAppStore();

  // 监听组织变化和初始化
  useEffect(() => {
    // 如果是第一次加载
    if (!fetchItemsRef.current) {
      fetchItems();
      fetchItemsRef.current = true;
      prevOrganizationIdRef.current = currentOrganizationId;
      return;
    }

    // 如果组织ID发生变化
    if (prevOrganizationIdRef.current !== currentOrganizationId) {
      prevOrganizationIdRef.current = currentOrganizationId;
      fetchItems(1);
    }
  }, [currentOrganizationId]);

  const fetchItems = async (
    page: number = 1,
    sortField: "created_at" | "title" = "created_at",
    sortDirection: "asc" | "desc" = "desc"
  ) => {
    try {
      setLoading(true);
      const organizationId = currentOrganizationId || "0";
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
          type: item.type || "LINK",
          note: item.note,
          user_id: item.user_id,
          description: item.description,
          url: item.url,
          thumbnail_url: item.thumbnail_url,
          organization_id: item.organization_id,
          organization_path: item.organization_path,
          deleted_at: item.deleted_at,
          created_at: item.created_at,
          updated_at: item.updated_at,
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

  const handleSearch = async (keyword: string) => {
    try {
      setIsSearching(true);
      setSearchKeyword(keyword);
      setCurrentPage(1);
      const result = await itemService.search({
        query: keyword,
        item_type: "LINK",
        pagination: {
          page: 1,
          page_size: pageSize,
        },
      });

      if (result.data?.items) {
        const searchItems = result.data.items.map((item: Item) => ({
          id: item.id,
          height: Math.floor(Math.random() * 200) + 300,
          title: item.title,
          favoriteTime: item.created_at,
          tags: item.tag_names || [],
          tag_names: item.tag_names || [],
          folderPath: item.organization_path || "未分类",
          link: item.url,
          type: item.type || "LINK",
          note: item.note,
          user_id: item.user_id,
          description: item.description,
          url: item.url,
          thumbnail_url: item.thumbnail_url,
          organization_id: item.organization_id,
          organization_path: item.organization_path,
          deleted_at: item.deleted_at,
          created_at: item.created_at,
          updated_at: item.updated_at,
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
    setCurrentPage(1);
    fetchItems(1, newSortField, newSortDirection);
  };

  const handleViewModeChange = (mode: "line" | "tag" | "all") => {
    setViewMode(mode);
    if (mode !== "tag") {
      setFilterTag(null);
    }
  };

  const handlePageModeChange = (mode: "normal" | "trash") => {
    setPageMode(mode);
  };

  const handleTagClick = async (tag: string) => {
    try {
      setLoading(true);
      setViewMode("tag");
      setFilterTag(tag);

      const response = await itemService.getByTags({
        tags: [tag],
        pagination: {
          page: 1,
          page_size: pageSize,
        },
      });

      if (response.data?.items) {
        const tagItems = response.data.items.map((item: Item) => ({
          id: item.id,
          height: 300,
          title: item.title,
          favoriteTime: item.created_at,
          tags: item.tag_names || [],
          tag_names: item.tag_names || [],
          folderPath: item.organization_path || "未分类",
          link: item.url,
          type: item.type || "LINK",
          note: item.note,
          user_id: item.user_id,
          description: item.description,
          url: item.url,
          thumbnail_url: item.thumbnail_url,
          organization_id: item.organization_id,
          organization_path: item.organization_path,
          deleted_at: item.deleted_at,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));

        setItems(tagItems);
        setTotalPages(response.data.total_pages);
        setCurrentPage(1);
      } else {
        setItems([]);
        setTotalPages(1);
        toast.info("该标签下暂无内容");
      }
    } catch (error) {
      console.error("获取标签内容失败:", error);
      toast.error("获取标签内容失败");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    items,
    currentPage,
    totalPages,
    sortField,
    sortDirection,
    isSearching,
    searchKeyword,
    fetchItemsRef,
    fetchItems,
    handleSearch,
    handleSortChange,
    setCurrentPage,
    deleteItem,
    viewMode,
    pageMode,
    handleViewModeChange,
    handlePageModeChange,
    handleTagClick,
  };
};
