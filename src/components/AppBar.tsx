import { FC, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import {
  Sun,
  Moon,
  Menu,
  Search,
  Plus,
  User,
  Clock,
  X,
  Link,
  FileText,
  Image,
} from "lucide-react";

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface AppBarProps {
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  onAdd: () => void;
  username?: string;
  onSearch?: (keyword: string) => void;
}

interface SearchHistory {
  id: string;
  keyword: string;
  timestamp: number;
}

interface SearchResultItem {
  id: string;
  title: string;
  type: 'link' | 'text' | 'image';
  collections: Array<{ name: string }>;
}

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 10;

const AppBar: FC<AppBarProps> = ({
  onSidebarToggle,
  onAdd,
  username,
  onSearch,
}) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // 搜索历史
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(() => {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // 搜索建议
  const [suggestedTags, setSuggestedTags] = useState<
    Array<{ id: number; name: string; count: number }>
  >([]);

  // 保存搜索历史到 localStorage
  useEffect(() => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  // 点击外部关闭搜索建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSearchContent(""); // 清空搜索内容
        // 在移动端时，同时收起搜索框
        if (window.innerWidth < 768) {
          setSearchExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 执行搜索
  const performSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setSuggestedTags([]);
      return;
    }

    try {
      onSearch?.(keyword);
      addToHistory(keyword);
    } catch (error) {
      console.error("搜索失败:", error);
      toast.error("搜索失败，请重试");
    }
  };

  // 添加搜索历史
  const addToHistory = (keyword: string) => {
    const newHistory = [
      { id: Date.now().toString(), keyword, timestamp: Date.now() },
      ...searchHistory.filter((item) => item.keyword !== keyword),
    ].slice(0, MAX_HISTORY_ITEMS);
    setSearchHistory(newHistory);
  };

  // 清除搜索历史
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  // 防抖处理搜索
  const debouncedSearch = debounce(performSearch, 300);

  // 处理搜索输入
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchContent(value);
    setShowSuggestions(true);
    debouncedSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch(searchContent);
      setShowSuggestions(false);
    }
  };

  // 处理搜索历史点击
  const handleHistoryClick = (keyword: string) => {
    setSearchContent(keyword);
    performSearch(keyword);
    setShowSuggestions(false);
  };

  // 处理搜索建议点击
  const handleSuggestionClick = (item: SearchResultItem) => {
    setSearchContent(item.title);
    performSearch(item.title);
    setShowSuggestions(false);
  };

  // 处理标签点击
  const handleTagClick = (tagName: string) => {
    setSearchContent(tagName);
    performSearch(tagName);
    setShowSuggestions(false);
  };

  // 组件卸载时取消防抖
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    onSidebarToggle();
  };

  return (
    <div className="w-full h-15 mt-3 bg-white dark:bg-gray-900 shadow-md flex items-center justify-between px-4">
      {/* 左侧 Logo */}
      <div
        className="hidden md:flex items-center h-full"
        onClick={handleSidebarToggle}
      >
        <img className="w-22 h-15 mx-5" src="/logo.png" alt="Logo" />
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

      {/* 左侧菜单按钮 */}
      <button
        onClick={handleSidebarToggle}
        className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* 中间搜索框 */}
      <div
        ref={searchRef}
        className="relative flex-1 mx-4 flex items-center justify-center transition-all duration-300"
      >
        {/* 桌面端搜索框 */}
        <div className="hidden md:block w-full max-w-[600px]">
          <div
            className={`bg-[#F5F5F5] dark:bg-gray-800 rounded-md flex flex-row items-center h-10 ${
              searchExpanded ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 mx-3" />
            <input
              type="text"
              value={searchContent}
              onChange={handleSearchChange}
              onFocus={() => {
                setSearchExpanded(true);
                setShowSuggestions(true);
              }}
              placeholder="搜索 (按 tab 搜索标签)"
              className="w-full h-full rounded-md text-base text-[#757575] dark:text-gray-300 focus:outline-none placeholder:text-[#757575] dark:placeholder:text-gray-400 bg-transparent"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* 移动端搜索 */}
        <div className="md:hidden">
          {searchExpanded ? (
            <div className="bg-[#F5F5F5] dark:bg-gray-800 rounded-md flex flex-row items-center h-10 w-[200px]">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 mx-3" />
              <input
                type="text"
                value={searchContent}
                onChange={handleSearchChange}
                onFocus={() => {
                  setSearchExpanded(true);
                  setShowSuggestions(true);
                }}
                placeholder="搜索"
                className="w-full h-full rounded-md text-base text-[#757575] dark:text-gray-300 focus:outline-none placeholder:text-[#757575] dark:placeholder:text-gray-400 bg-transparent"
                onKeyDown={handleKeyDown}
              />
            </div>
          ) : (
            <button
              onClick={() => {
                setSearchExpanded(true);
                setShowSuggestions(true);
              }}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Search className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* 搜索建议面板 */}
        {showSuggestions && (
          <div className="absolute top-[40px] left-1/2 transform -translate-x-1/2 w-full max-w-[600px] mt-1 bg-white dark:bg-gray-900 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
            {searchContent ? (
              <div className="p-2">
                {/* 搜索结果 */}
                {searchResults.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1">
                      搜索结果
                    </div>
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSuggestionClick(item)}
                        className="flex items-center justify-between px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          {item.type === "link" && (
                            <Link className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          )}
                          {item.type === "text" && (
                            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          )}
                          {item.type === "image" && (
                            <Image className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          )}
                          <span className="text-gray-700 dark:text-gray-300">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.collections[0]?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 相关标签 */}
                {suggestedTags.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1">
                      相关标签
                    </div>
                    <div className="flex flex-wrap gap-2 p-2">
                      {suggestedTags.map((tag) => (
                        <div
                          key={tag.id}
                          onClick={() => handleTagClick(tag.name)}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-1"
                        >
                          <span>{tag.name}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            ({tag.count})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 搜索历史
              <div className="p-2">
                <div className="flex justify-between items-center px-2 py-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    搜索历史
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    清除
                  </button>
                </div>
                {searchHistory.map((history) => (
                  <div
                    key={history.id}
                    onClick={() => handleHistoryClick(history.keyword)}
                    className="flex items-center justify-between px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {history.keyword}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(history.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 右侧用户 */}
      <div className="flex gap-6 items-center h-full transition-all duration-300">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">切换主题</span>
        </button>
        <button
          onClick={onAdd}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
        <div
          onClick={() => navigate("/user")}
          className="flex items-center gap-2  hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full pl-2 py-1 transition-colors"
        >
          <User className="w-6 h-6" />
          <span className="text-gray-600 dark:text-gray-300 text-base !mr-5 whitespace-nowrap">
            {username || "登录"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
