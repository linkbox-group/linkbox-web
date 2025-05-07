import { create } from "zustand";
import { AppState } from "./types";
import { CardItem } from "../types";

// 生成随机ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// 生成随机日期（过去30天内）
const generateDate = () => {
  const now = new Date();
  const pastDate = new Date(
    now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
  );
  return pastDate.toISOString();
};

// 生成随机标签
const generateTags = () => {
  const allTags = [
    "工作",
    "学习",
    "娱乐",
    "生活",
    "技术",
    "设计",
    "阅读",
    "视频",
    "音乐",
    "游戏",
  ];
  const count = Math.floor(Math.random() * 3) + 1; // 1-3个标签
  const tags = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allTags.length);
    tags.push(allTags[randomIndex]);
    allTags.splice(randomIndex, 1); // 避免重复标签
  }
  return tags;
};

// 生成随机文件夹路径
const generateFolderPath = () => {
  const folders = ["工作", "学习", "娱乐", "生活", "未分类"];
  return folders[Math.floor(Math.random() * folders.length)];
};

// 生成随机高度
const generateHeight = () => Math.floor(Math.random() * 200) + 300;

// 生成单个内容项
const generateItem = (): CardItem => {
  const tags = generateTags();
  return {
    id: generateId(),
    height: generateHeight(),
    title: `测试内容 ${Math.floor(Math.random() * 1000)}`,
    favoriteTime: generateDate(),
    tags,
    tag_names: tags,
    folderPath: generateFolderPath(),
    link: `https://example.com/item/${generateId()}`,
  };
};

// 生成多个内容项
const generateItems = (count: number): CardItem[] => {
  const items: CardItem[] = [];
  for (let i = 0; i < count; i++) {
    items.push(generateItem());
  }
  return items;
};

interface AppStore {
  app: AppState;
  items: CardItem[];
  currentOrganizationId: string;
  setLoading: (isLoading: boolean) => void;
  toggleSidebar: () => void;
  setIsMobile: (isMobile: boolean) => void;
  setItems: (items: CardItem[]) => void;
  addItem: (item: CardItem) => void;
  updateItem: (id: string | number, item: CardItem) => void;
  deleteItem: (id: string | number) => void;
  setCurrentOrganizationId: (id: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // 应用状态初始状态
  app: {
    isLoading: false,
    isMobile: false,
    sidebarCollapsed: false,
  },

  // 内容项缓存
  items: [],

  // 当前选中的组织ID
  currentOrganizationId: "",

  // 设置加载状态
  setLoading: (isLoading) =>
    set((state) => ({
      app: {
        ...state.app,
        isLoading,
      },
    })),

  // 切换侧边栏
  toggleSidebar: () =>
    set((state) => ({
      app: {
        ...state.app,
        sidebarCollapsed: !state.app.sidebarCollapsed,
      },
    })),

  // 设置移动设备状态
  setIsMobile: (isMobile) =>
    set((state) => ({
      app: {
        ...state.app,
        isMobile,
      },
    })),

  // 设置内容项列表
  setItems: (items) => set({ items }),

  // 添加内容项
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  // 更新内容项
  updateItem: (id, updatedItem) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? updatedItem : item)),
    })),

  // 删除内容项
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  // 生成模拟数据

  // 设置当前组织ID
  setCurrentOrganizationId: (id) =>
    set(() => ({
      currentOrganizationId: id,
    })),
}));
