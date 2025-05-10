import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Folder, ChevronRight } from "lucide-react";
import { organizationService, Organization } from "@/services/organization";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import TreeView, { TreeNode } from "@/components/Slidebar/TreeView";

interface FileTreeNode extends TreeNode {
  type: "folder";
  items_count?: number;
  children: FileTreeNode[];
  parent_code?: string;
  sort_order?: number;
  code: string;
}

interface MoveDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: (targetId: string) => void;
  currentId: string;
}

const MoveDialog: React.FC<MoveDialogProps> = ({
  open,
  setOpen,
  onSuccess,
  currentId,
}) => {
  const { user } = useUserStore();
  const [organizations, setOrganizations] = useState<FileTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<FileTreeNode | null>(null);

  const fetchOrganizations = async () => {
    try {
      if (user?.id) {
        const response = await organizationService.getList();
        if (response.data?.organizations) {
          const buildTree = (orgs: Organization[]): FileTreeNode[] => {
            const nodeMap = new Map<string, FileTreeNode>();

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

            const rootNodes: FileTreeNode[] = [];

            orgs.forEach((org) => {
              const node = nodeMap.get(org.code);
              if (!node) return;

              if (org.parent_code === "0" && org.code === "0") {
                return;
              } else if (org.parent_code === "0") {
                rootNodes.push(node);
              } else {
                const parent = nodeMap.get(org.parent_code);
                if (parent) {
                  parent.children.push(node);
                }
              }
            });

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
        }
      }
    } catch (error) {
      console.error("获取组织列表失败:", error);
      toast.error("获取组织列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOrganizations();
    }
  }, [open]);

  const toggleNode = (id: string) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(id)) {
      newExpandedNodes.delete(id);
    } else {
      newExpandedNodes.add(id);
    }
    setExpandedNodes(newExpandedNodes);
  };

  const handleNodeClick = (node: TreeNode) => {
    setSelectedNode(node as FileTreeNode);
  };

  const handleConfirm = () => {
    if (selectedNode) {
      onSuccess(selectedNode.id);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">移动到</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="h-[300px] overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-white/50 dark:bg-gray-700/50">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">加载中...</div>
            ) : organizations.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">暂无收藏集</div>
            ) : (
              <TreeView
                data={organizations}
                onNodeClick={handleNodeClick}
                expandedNodes={expandedNodes}
                onToggleNode={toggleNode}
                renderNode={(node: TreeNode) => (
                  <div className="flex items-center gap-2 w-full group">
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
                      className={cn(
                        "flex items-center gap-2 flex-1 cursor-pointer p-1 rounded-md",
                        selectedNode?.id === node.id &&
                          "bg-blue-100 dark:bg-blue-900"
                      )}
                    >
                      <Folder className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{node.name}</span>
                    </div>
                  </div>
                )}
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              取消
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedNode || selectedNode.id === currentId}
              className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              确定
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoveDialog;
