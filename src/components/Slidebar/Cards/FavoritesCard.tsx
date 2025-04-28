import React, { useEffect, useState, useRef } from "react";
import { Folder, Plus, ChevronRight, File, Ellipsis, Trash2 } from "lucide-react";
import { organizationService, Organization } from "@/services/organization";
import { useUserStore } from "@/store/userStore";
import { itemService, Item } from "@/services/items";
import OrganizationDialog from "@/components/Dialogs/OrganizationDialog";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TreeView from "../TreeView";
import ContentDialog from "@/components/Dialogs/ContentDialog";

interface FileTreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FileTreeNode[];
  items_count?: number;
}

const FavoritesCard: React.FC = () => {
  const { user } = useUserStore();
  const [organizations, setOrganizations] = useState<FileTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNodeCode, setSelectedNodeCode] = useState<string>("0");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<FileTreeNode | null>(null);
  const [organizationDialogOpen, setOrganizationDialogOpen] = useState(false);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [parentCode, setParentCode] = useState<string>("0");

  const fetchOrganizations = async () => {
    try {
      if (user?.id) {
        const response = await organizationService.getList();
        console.log("组织列表数据:", response);
        if (response.data?.organizations) {
          // 构建树形结构
          const buildTree = (orgs: Organization[], parentCode: string = "0"): FileTreeNode[] => {
            return orgs
              .filter(org => org.parent_code === parentCode)
              .map(org => ({
                id: org.id,
                name: org.name,
                type: "folder",
                children: buildTree(orgs, org.code),
                items_count: org.items_count || 0
              }));
          };

          const tree = buildTree(response.data.organizations);
          console.log("构建后的树:", tree);
          setOrganizations(tree);
        } else {
          setOrganizations([]);
        }
      }
    } catch (error) {
      console.error("获取组织列表失败:", error);
      toast.error("获取组织列表失败");
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationItems = async (nodeId: string) => {
    try {
      const itemsResponse = await itemService.getOrganizationItems({
        organization_id: nodeId,
        page: 1,
        page_size: 100,
        sort_field: "created_at",
        sort_direction: "desc",
      });
      
      if (itemsResponse.data?.items) {
        return itemsResponse.data.items.map((item: Item) => ({
          id: `item-${item.id}`,
          name: item.title || item.url,
          type: "file" as const,
          url: item.url,
        }));
      }
      return [];
    } catch (error) {
      console.error(`获取组织内容项失败:`, error);
      toast.error("获取内容项失败");
      return [{
        id: `error-${nodeId}`,
        name: "加载失败",
        type: "file" as const,
      }];
    }
  };

  const toggleNode = async (id: string) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(id)) {
      newExpandedNodes.delete(id);
    } else {
      newExpandedNodes.add(id);
      if (id.startsWith('items-')) {
        const orgId = id.replace('items-', '');
        const items = await fetchOrganizationItems(orgId);
        setOrganizations(prev => {
          const updateNode = (node: FileTreeNode): FileTreeNode => {
            if (node.id === orgId) {
              return {
                ...node,
                children: items
              };
            }
            if (node.children) {
              return {
                ...node,
                children: node.children.map(updateNode)
              };
            }
            return node;
          };
          return prev.map(updateNode);
        });
      }
    }
    setExpandedNodes(newExpandedNodes);
  };

  useEffect(() => {
    fetchOrganizations();
  }, [user?.id]);

  const handleCreateSuccess = () => {
    fetchOrganizations();
  };

  const handleNodeClick = (node: FileTreeNode) => {
    setSelectedNodeCode(node.id);
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(node.id)) {
      newExpandedNodes.delete(node.id);
    } else {
      newExpandedNodes.add(node.id);
    }
    setExpandedNodes(newExpandedNodes);
  };

  const handleCreateClick = (type: "item" | "organization", nodeCode: string = "0") => {
    setParentCode(nodeCode);
    if (type === "organization") {
      setOrganizationDialogOpen(true);
    } else {
      setContentDialogOpen(true);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, node: FileTreeNode) => {
    e.stopPropagation();
    setNodeToDelete(node);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!nodeToDelete) return;

    try {
      await organizationService.delete(nodeToDelete.id);
      toast.success("删除成功");
      fetchOrganizations(); // 重新获取组织列表
    } catch (error) {
      console.error("删除失败:", error);
      toast.error("删除失败");
    } finally {
      setDeleteDialogOpen(false);
      setNodeToDelete(null);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#EEF4FF] via-[#CBD8ED] via-[#89A2CC] to-[#244F99] dark:from-[#1a1f2e] dark:to-[#1a365d] rounded-lg shadow-sm p-4 select-none h-96 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-gray-700 dark:text-blue-400" />
          <span className="text-gray-700 dark:text-blue-400 font-medium">
            我的收藏集
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Plus 
                className="w-5 h-5 text-gray-700 dark:text-blue-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCreateClick("item")}>
                添加收藏项目
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateClick("organization")}>
                添加收藏集
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100%-3rem)] overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            加载中...
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            暂无收藏集
          </div>
        ) : (
          <TreeView
            data={organizations}
            onNodeClick={handleNodeClick}
            renderNode={(node: FileTreeNode) => (
              <div className="flex items-center justify-between w-full group">
                <div className="flex items-center gap-2 flex-1">
                  {node.type === 'folder' ? (
                    <Folder className="w-4 h-4 text-blue-500" />
                  ) : (
                    <File className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm">{node.name}</span>
                </div>
                {node.type === 'folder' && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Plus
                          className="w-4 h-4 text-gray-500 hover:text-blue-500 cursor-pointer"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCreateClick("item", node.id)}>
                          添加收藏项目
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCreateClick("organization", node.id)}>
                          添加收藏集
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Ellipsis className="w-4 h-4 text-gray-500 hover:text-blue-500 cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => handleDeleteClick(e, node)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            )}
            className="py-2"
          />
        )}
      </div>

      <OrganizationDialog
        open={organizationDialogOpen}
        setOpen={setOrganizationDialogOpen}
        onSuccess={handleCreateSuccess}
        parentCode={parentCode}
      />

      <ContentDialog
        mode="add"
        open={contentDialogOpen}
        setOpen={setContentDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除 "{nodeToDelete?.name}" 吗？此操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FavoritesCard;
