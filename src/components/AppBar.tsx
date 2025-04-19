import { FC } from "react";

interface AppBarProps {
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  onAdd: () => void;
  onUserClick: () => void;
  username?: string;
}

const AppBar: FC<AppBarProps> = ({ onSidebarToggle, onAdd, onUserClick, username }) => {
  return (
    <div
      className="w-full h-15 bg-white shadow-md flex items-center justify-between px-4"
    >
      {/* 左侧 Logo */}
      <div className="flex items-center h-full" onClick={onSidebarToggle}>
        <img className="w-16 h-12 mx-5" src="/logo.png" alt="Logo" />
        <div
          className="flex items-center text-lg"
          style={{
            color: "rgba(38.86, 116.81, 222.05, 0.67)",
            fontFamily: "Inter",
            fontWeight: "200",
            wordWrap: "break-word",
          }}
        >
          云笺-跨平台收藏工具
        </div>
      </div>

      {/* 中间搜索框 */}
      <div className="sm:w-[600px] w-[200px] bg-[#F5F5F5] rounded-md flex flex-row items-center h-10">
        <img src="/icons/search.svg" alt="搜索" className="mx-3 w-5 h-5" />
        <input
          type="text"
          placeholder="搜索 (按 tab 搜索标签 )"
          className="w-full h-full rounded-md text-base text-[#757575] focus:outline-none placeholder:text-[#757575]"
        />
      </div>

      {/* 右侧用户 */}
      <div className="flex gap-6 items-center h-full">
        <img src="/icons/plus.svg" alt="添加" className="w-6 h-6" onClick={onAdd} />
        <div className="flex items-center gap-2 cursor-pointer" onClick={onUserClick}>
          <img src="/icons/user.svg" alt="用户" className="w-6 h-6" />
          <span className="text-gray-600 text-base !mr-5 whitespace-nowrap">
            {username || "登录"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
