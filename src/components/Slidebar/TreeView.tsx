import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
}

interface TreeViewProps {
  data: TreeNode[];
  onNodeClick?: (node: TreeNode) => void;
  className?: string;
  renderNode?: (node: TreeNode) => React.ReactNode;
}

const TreeView: React.FC<TreeViewProps> = ({ data, onNodeClick, className, renderNode }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderNodeContent = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            'flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer',
            className
          )}
          style={{ paddingLeft: `${level * 16}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            }
            onNodeClick?.(node);
          }}
        >
          {hasChildren ? (
            <ChevronRight
              className={cn(
                'w-4 h-4 transition-transform',
                isExpanded && 'transform rotate-90'
              )}
            />
          ) : (
            <div className="w-4" />
          )}
          {renderNode ? renderNode(node) : (
            <>
              {node.type === 'folder' ? (
                <Folder className="w-4 h-4 text-blue-500" />
              ) : (
                <File className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm">{node.name}</span>
            </>
          )}
        </div>
        {isExpanded && hasChildren && (
          <div>
            {node.children?.map((child) => renderNodeContent(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="py-2">{data.map((node) => renderNodeContent(node))}</div>;
};

export default TreeView; 