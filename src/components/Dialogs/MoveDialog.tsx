import React, { useState, useEffect } from "react";
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
import { organizationService, Organization } from "@/services/organization";
import { itemService } from "@/services/items";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import TreeView from "@/components/Slidebar/TreeView";
import { Folder } from "lucide-react";

interface MoveDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  type: "organization" | "item";
  currentId: string;
  currentParentCode: string;
}

interface FileTreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FileTreeNode[];
}

const MoveDialog: React.FC<MoveDialogProps> = ({
  open,
  setOpen,
  onSuccess,
  type,
  currentId,
  currentParentCode,
}) => {
  const { user } = useUserStore();
  const [organizations, setOrganizations] = useState<FileTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const fetchOrganizations = async () => {
    try {
      if (user?.id) {
        const response = await organizationService.getList();
        if (response.data?.organizations) {
          const buildTree = (orgs: Organization[], parentCode: string = "0"): FileTreeNode[] => {
            return orgs
              .filter(org => org.parent_code === parentCode && org.id !== currentId) // 排除当前组织
              .map(org => ({
                id: org.id,
                name: org.name,
                type: "folder",
                children: buildTree(orgs, org.code),
              }));
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

  useEffect(() => {
    if (open) {
      fetchOrganizations();
      setSelectedNodeId("");
      setExpandedNodes(new Set());
    }
  }, [open]);

  const handleNodeClick = (node: FileTreeNode) => {
    setSelectedNodeId(node.id);
  };

  const handleMove = async () => {
    if (!selectedNodeId) {
      toast.error("请选择目标位置");
      return;
    }

    try {
      if (type === "organization") {
        // 移动组织
        await organizationService.move({
          id: currentId,
          new_parent_code: selectedNodeId,
        });
        toast.success("组织移动成功");
      } else {
        // 移动内容
        // 1. 从原组织移除内容
        await organizationService.removeItems({
          organization_id: currentParentCode,
          item_ids: [currentId],
        });
        
        // 2. 添加到新组织
        await organizationService.addItems({
          organization_id: selectedNodeId,
          item_ids: [currentId],
        });
        
        toast.success("内容移动成功");
      }
      
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("移动失败:", error);
      toast.error("移动失败");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {type === "organization" ? "移动组织" : "移动内容"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="py-4">
              {loading ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  加载中...
                </div>
              ) : organizations.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  暂无可用位置
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  <TreeView
                    data={organizations}
                    onNodeClick={handleNodeClick}
                    renderNode={(node: FileTreeNode) => (
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{node.name}</span>
                      </div>
                    )}
                    className="py-2"
                  />
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleMove}
            disabled={!selectedNodeId}
            className="bg-blue-600 hover:bg-blue-700"
          >
            移动
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MoveDialog; 