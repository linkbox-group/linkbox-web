import React, { useEffect, useState } from "react";
import { Folder, Plus, ChevronRight, Ellipsis, Trash2, Search, X } from "lucide-react";
import { organizationService, Organization } from "@/services/organization";
import { useUserStore } from "@/store/userStore";
import OrganizationDialog from "@/components/Dialogs/OrganizationDialog";
import ConfirmDialog from "@/components/Dialogs/ConfirmDialog";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TreeView, { TreeNode } from "../TreeView";

interface FileTreeNode extends TreeNode {
  type: "folder";
  items_count?: number;
}

interface FavoritesCardProps {
  onOrganizationSelect?: (organizationId: string) => void;
  onAddOrganization?: (parentCode: string) => void;
  onDeleteOrganization?: (organization: FileTreeNode) => void;
}

const FavoritesCard: React.FC<FavoritesCardProps> = ({
  onOrganizationSelect,
  onAddOrganization,
  onDeleteOrganization
}) => {
  const { user } = useUserStore();
  const [organizations, setOrganizations] = useState<FileTreeNode[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<FileTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<FileTreeNode | null>(null);
  const [organizationDialogOpen, setOrganizationDialogOpen] = useState(false);
  const [parentCode, setParentCode] = useState<string>("0");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrganizations = async () => {
    try {
      if (user?.id) {
        const response = await organizationService.getList();
        console.log("组织列表数据:", response);
        if (response.data?.organizations) {
          // 构建树形结构
          const buildTree = (
            orgs: Organization[],
            parentCode: string = "0"
          ): FileTreeNode[] => {
            return orgs
              .filter((org) => org.parent_code === parentCode)
              .map((org) => ({
                id: org.id,
                name: org.name,
                type: "folder" as const,
                children: buildTree(orgs, org.code),
                items_count: org.items_count || 0,
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

  const toggleNode = (id: string) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(id)) {
      newExpandedNodes.delete(id);
    } else {
      newExpandedNodes.add(id);
    }
    setExpandedNodes(newExpandedNodes);
  };

  const filterOrganizations = (query: string) => {
    if (!query.trim()) {
      setFilteredOrganizations(organizations);
      return;
    }

    const filterNode = (node: TreeNode): TreeNode | null => {
      if (node.name.toLowerCase().includes(query.toLowerCase())) {
        return node;
      }
      if (node.children) {
        const filteredChildren = node.children
          .map(filterNode)
          .filter((child): child is TreeNode => child !== null);
        if (filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren,
          };
        }
      }
      return null;
    };

    const filtered = organizations
      .map(filterNode)
      .filter((node): node is TreeNode => node !== null);
    setFilteredOrganizations(filtered as FileTreeNode[]);
  };

  useEffect(() => {
    fetchOrganizations();
  }, [user?.id]);

  useEffect(() => {
    filterOrganizations(searchQuery);
  }, [searchQuery, organizations]);

  const handleCreateSuccess = () => {
    fetchOrganizations();
  };

  const handleNodeClick = (node: TreeNode) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(node.id)) {
      newExpandedNodes.delete(node.id);
    } else {
      newExpandedNodes.add(node.id);
    }
    setExpandedNodes(newExpandedNodes);
  };

  const handleCreateClick = (
    type: "item" | "organization",
    nodeCode: string = "0"
  ) => {
    setParentCode(nodeCode);
    if (type === "organization") {
      setOrganizationDialogOpen(true);
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
    <div className="bg-gradient-to-b from-[#EEF4FF] to-[#244F99] dark:bg-gradient-to-b dark:from-[#1a1f2e] dark:to-[#1a365d] rounded-lg shadow-sm p-4 select-none h-96 transition-colors duration-300">
      <div className={cn(
        "flex justify-between items-center mb-4 transition-all duration-300",
        isSearching && "opacity-0 h-0 mb-0 pointer-events-none"
      )}>
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-gray-700 dark:text-blue-400" />
          <span className="text-gray-700 dark:text-blue-400 font-bold">
            我的收藏集
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Search
            className="w-5 h-5 text-gray-700 dark:text-blue-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
            onClick={() => setIsSearching(true)}
          />
          <Plus 
            className="w-5 h-5 text-gray-700 dark:text-blue-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
            onClick={() => {
              setParentCode("0");
              setOrganizationDialogOpen(true);
            }}
          />
        </div>
      </div>

      <div className={cn(
        "flex justify-end items-center mb-4 transition-all duration-300",
        !isSearching && "opacity-0 h-0 mb-0 pointer-events-none"
      )}>
        <div className="flex items-center gap-2 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-2 py-1 text-sm bg-white/10 dark:bg-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="搜索收藏集..."
            autoFocus
          />
          <X
            className="w-4 h-4 text-gray-500 cursor-pointer hover:text-blue-500"
            onClick={() => {
              setIsSearching(false);
              setSearchQuery("");
            }}
          />
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100%-3rem)] overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            加载中...
          </div>
        ) : filteredOrganizations.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? "未找到匹配的收藏集" : "暂无收藏集"}
          </div>
        ) : (
          <TreeView
            data={filteredOrganizations}
            onNodeClick={handleNodeClick}
            expandedNodes={expandedNodes}
            onToggleNode={toggleNode}
            renderNode={(node: TreeNode) => (
              <div className="flex items-center justify-between w-full group">
                <div className="flex items-center gap-2 flex-1">
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-gray-500 cursor-pointer transition-transform",
                      expandedNodes.has(node.id) && "transform rotate-90"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNode(node.id);
                    }}
                  />
                  <div
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                    onClick={() => {
                      onOrganizationSelect?.(node.id);
                    }}
                  >
                    <Folder className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{node.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus 
                    className="w-4 h-4 text-gray-500 hover:text-blue-500 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateClick("organization", node.id);
                    }}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Ellipsis className="w-4 h-4 text-gray-500 hover:text-blue-500 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) =>
                          handleDeleteClick(e, node as FileTreeNode)
                        }
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
            className="py-2"
          />
        )}
      </div>

      <OrganizationDialog
        mode="add"
        open={organizationDialogOpen}
        setOpen={setOrganizationDialogOpen}
        onSuccess={handleCreateSuccess}
        parentCode={parentCode}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        title="确认删除"
        description={`确定要删除 "${nodeToDelete?.name}" 吗？此操作不可恢复。`}
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        variant="destructive"
      />
    </div>
  );
};

export default FavoritesCard;
