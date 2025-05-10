import React from "react";
import {
  Archive,
  ArrowUpDown,
  LayoutGrid,
  LayoutList,
  Tags,
  CheckIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainHeaderProps {
  mode: string;
  onModeChange: () => void;
  onSortChange: (value: string) => void;
  onRefresh: () => void;
  sortField: "created_at" | "title";
}

const MainHeader: React.FC<MainHeaderProps> = ({
  mode,
  onModeChange,
  onSortChange,
  onRefresh,
  sortField,
}) => {
  return (
    <div className="flex items-center justify-end gap-4 mb-4">
      <div
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 select-none cursor-pointer hover:text-gray-800 dark:hover:text-gray-100"
        onClick={onRefresh}
      >
        <Archive className="w-5 h-5" />
        <span>全部</span>
      </div>
      <div
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-gray-100 select-none"
        onClick={() => onModeChange()}
      >
        {mode === "all" ? (
          <LayoutGrid className="w-5 h-5" />
        ) : mode === "line" ? (
          <LayoutList className="w-5 h-5" />
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
            <DropdownMenuItem onClick={() => onSortChange("time")}>
              <CheckIcon
                className={`w-4 h-4 mr-2 ${
                  sortField === "created_at" ? "opacity-100" : "opacity-0"
                }`}
              />
              时间排序
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("title")}>
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
  );
};

export default MainHeader;
