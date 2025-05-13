import React, { useEffect } from "react";
import Sidebar from "../components/Slidebar/Sidebar";
import AppBar from "../components/Main/AppBar";
import ContentDialog from "../components/Dialogs/ContentDialog";
import ConfirmDialog from "../components/Dialogs/ConfirmDialog";
import OrganizationDialog from "../components/Dialogs/OrganizationDialog";
import { useUserStore } from "@/store/userStore";
import { useAppStore } from "@/store/appStore";
import { useTagStore } from "@/store/tagStore";
import MainContent from "@/components/Main/MainContent";
import MainHeader from "@/components/Main/MainHeader";
import MainPagination from "@/components/Main/MainPagination";
import { useLayout } from "@/hooks/useLayout";
import { useItemManagement } from "@/hooks/useItemManagement";
import { useContentDialogs } from "@/hooks/useContentDialogs";
import { useOrganizationDialogs } from "@/hooks/useOrganizationDialogs";
import { useTrashManagement } from "@/hooks/useTrashManagement";

type ViewMode = "line" | "tag" | "all";

const Main: React.FC = () => {
  const { user } = useUserStore();
  const { currentOrganizationId } = useAppStore();
  const { setShouldRefreshTags } = useTagStore();

  const { sidebarCollapsed, setSidebarCollapsed, columns } = useLayout();
  const {
    viewMode,
    handleViewModeChange,
    pageMode,
    loading,
    items,
    currentPage,
    totalPages,
    sortField,
    isSearching,
    searchKeyword,
    fetchItems,
    handleSearch,
    handleSortChange,
  } = useItemManagement();

  // 回收站管理相关
  const {
    trashItems,
    loading: trashLoading,
    fetchTrashItems,
    handleRecover,
    handlePermanentDelete,
  } = useTrashManagement();

  // 内容对话框相关
  const {
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedContent,
    deleteDialogOpen,
    setDeleteDialogOpen,
    itemToDelete,
    handleEdit,
    handleDelete,
    handleDeleteConfirm,
  } = useContentDialogs();

  // 组织对话框相关
  const {
    organizationDialogOpen,
    setOrganizationDialogOpen,
    deleteOrganizationDialogOpen,
    setDeleteOrganizationDialogOpen,
    organizationToDelete,
    handleDeleteOrganizationConfirm,
  } = useOrganizationDialogs();

  // 监听模式变化，如果是回收站模式则获取回收站数据
  useEffect(() => {
    if (pageMode === "trash") {
      fetchTrashItems();
    }
  }, [pageMode]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (isSearching) {
        handleSearch(searchKeyword);
      } else {
        fetchItems(page);
      }
    }
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
            parentCode={currentOrganizationId}
          />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          <div className="flex-1 overflow-auto p-4 flex flex-col h-full">
            <MainHeader
              mode={viewMode}
              onModeChange={(mode: ViewMode) => handleViewModeChange(mode)}
              onSortChange={handleSortChange}
              onRefresh={() => pageMode === "trash" ? fetchTrashItems() : fetchItems(1)}
              sortField={sortField}
            />
            <MainContent
              loading={pageMode === "trash" ? trashLoading : loading}
              items={items}
              trashItems={trashItems}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRecover={handleRecover}
              onPermanentDelete={handlePermanentDelete}
            />
            <MainPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showPagination={!loading && items.length > 0 && pageMode !== "trash"}
            />
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
          setShouldRefreshTags(true);
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
          setShouldRefreshTags(true);
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
