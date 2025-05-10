import React, { useEffect, useState, useRef } from "react";
import {
  FolderClosed,
  Plus,
  ChevronRight,
  Ellipsis,
  Trash2,
  Search,
  X,
  Move,
} from "lucide-react";
import { organizationService, Organization } from "@/services/organization";
import { useUserStore } from "@/store/userStore";
import { useAppStore } from "@/store/appStore";
import OrganizationDialog from "@/components/Dialogs/OrganizationDialog";
import ConfirmDialog from "@/components/Dialogs/ConfirmDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import TreeView, { TreeNode } from "../TreeView";
import MoveDialog from "@/components/Dialogs/MoveDialog";

interface FileTreeNode extends TreeNode {
  type: "folder";
  items_count?: number;
  children: FileTreeNode[];
  parent_code?: string;
  sort_order?: number;
  code: string;
}

interface FavoritesCardProps {
  parentCode: string;
}

const FavoritesCard: React.FC<FavoritesCardProps> = ({
  parentCode,
}) => {
  const { user } = useUserStore();
  const { selectOrganization, setCurrentOrganizationId } = useAppStore();
  const [organizations, setOrganizations] = useState<FileTreeNode[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<FileTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<FileTreeNode | null>(null);
  const [organizationDialogOpen, setOrganizationDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [nodeToMove, setNodeToMove] = useState<FileTreeNode | null>(null);

  const fetchOrganizations = async () => {
    try {
      if (user?.id) {
        const response = await organizationService.getList();
        if (response.data?.organizations) {
          // 构建树形结构
          const buildTree = (orgs: Organization[]): FileTreeNode[] => {
            // 创建一个映射，用于快速查找节点
            const nodeMap = new Map<string, FileTreeNode>();

            // 首先创建所有节点
            orgs.forEach((org) => {
              nodeMap.set(org.code, {
                id: org.id,
                code: org.code,
                name: org.name,
                type: "folder" as const,
                children: [],
                items_count: org.items_count || 0,
                parent_code: org.parent_code,
                sort_order: org.sort_order || 0,
              });
            });

            // 构建父子关系
            const rootNodes: FileTreeNode[] = [];

            // 遍历所有节点，建立父子关系
            orgs.forEach((org) => {
              const node = nodeMap.get(org.code);
              if (!node) return;

              if (org.parent_code === "0" && org.code === "0") {
                // 跳过根节点 "/"
                return;
              } else if (org.parent_code === "0") {
                // 如果是根节点的直接子节点，添加到 rootNodes
                rootNodes.push(node);
              } else {
                // 如果是其他子节点，找到父节点并添加到其 children 中
                const parent = nodeMap.get(org.parent_code);
                if (parent) {
                  parent.children.push(node);
                }
              }
            });

            // 对每个层级的节点进行排序
            const sortNodes = (nodes: FileTreeNode[]) => {
              nodes.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
              nodes.forEach((node) => {
                if (node.children.length > 0) {
                  sortNodes(node.children);
                }
              });
            };

            sortNodes(rootNodes);

            return rootNodes;
          };

          const tree = buildTree(response.data.organizations);
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
    setCurrentOrganizationId(nodeCode);
    if (type === "organization") {
      setOrganizationDialogOpen(true);
    }
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

  const handleMoveConfirm = async (targetId: string) => {
    if (!nodeToMove) return;

    try {
      await organizationService.move({
        id: nodeToMove.id,
        new_parent_code: targetId,
      });
      toast.success("移动成功");
      fetchOrganizations(); // 重新获取组织列表
    } catch (error) {
      console.error("移动失败:", error);
      toast.error("移动失败");
    } finally {
      setMoveDialogOpen(false);
      setNodeToMove(null);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#FFFFFF] to-[#D7EEFF] dark:bg-gradient-to-b dark:from-[#1E2333] dark:to-[#27446F] rounded-lg shadow-sm p-4 pb-16 select-none">
      <div
        className={cn(
          "flex justify-between items-center mb-4",
          isSearching && "hidden"
        )}
      >
        <div className="flex items-center gap-2">
          <FolderClosed className="w-5 h-5 text-[#355DA1] dark:text-blue-400" />
          <span
            className="text-[#355DA1] dark:text-blue-400 font-bold cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
            onClick={() => {
              setCurrentOrganizationId("0");
              selectOrganization("0");
            }}
          >
            我的收藏集
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Search
            className="w-5 h-5 text-[#355DA1] dark:text-blue-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
            onClick={() => setIsSearching(true)}
          />
          <Plus
            className="w-5 h-5 text-[#355DA1] dark:text-blue-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
            onClick={() => {
              setCurrentOrganizationId("0");
              setOrganizationDialogOpen(true);
            }}
          />
        </div>
      </div>

      <div
        className={cn(
          "flex justify-end items-center mb-4 transition-all duration-300",
          !isSearching && "opacity-0 h-0 mb-0 pointer-events-none"
        )}
      >
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

      <div className="flex-1 overflow-y-auto">
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
            renderNode={(node: TreeNode) => {
              const handleTouchStart = (e: React.TouchEvent) => {
                e.preventDefault();
                const longPressTimer = setTimeout(() => {
                  const contextEvent = new MouseEvent("contextmenu", {
                    bubbles: true,
                    cancelable: true,
                    clientX: e.touches[0].clientX,
                    clientY: e.touches[0].clientY,
                  });
                  e.target.dispatchEvent(contextEvent);
                }, 500);

                const handleTouchEnd = () => {
                  clearTimeout(longPressTimer);
                  document.removeEventListener("touchend", handleTouchEnd);
                };

                document.addEventListener("touchend", handleTouchEnd);
              };

              return (
                <div
                  className="flex items-center justify-between w-full group"
                  onContextMenu={(e) => e.preventDefault()}
                >
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
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <div
                          className="flex items-center gap-2 flex-1 cursor-pointer"
                          onClick={() => {
                            setCurrentOrganizationId(node.id);
                            selectOrganization(node.id);
                          }}
                          onTouchStart={handleTouchStart}
                        >
                          <FolderClosed className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{node.name}</span>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="min-w-[120px]">
                        <ContextMenuItem
                          onClick={() => {
                            setNodeToMove(node as FileTreeNode);
                            setMoveDialogOpen(true);
                          }}
                        >
                          <Move className="w-4 h-4 mr-2" />
                          移动
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => {
                            setNodeToDelete(node as FileTreeNode);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus
                      className="w-4 h-4 text-gray-500 hover:text-blue-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateClick("organization", node.id);
                      }}
                    />
                  </div>
                </div>
              );
            }}
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

      <MoveDialog
        open={moveDialogOpen}
        setOpen={setMoveDialogOpen}
        onSuccess={handleMoveConfirm}
        currentId={nodeToMove?.id || ""}
      />
    </div>
  );
};

export default FavoritesCard;
