# 状态管理

本项目使用 Zustand 进行状态管理，采用分散式 store 模式，每个功能模块都有自己的 store。

## Store 结构

```
src/store/
├── types.ts           # 类型定义
├── index.ts          # store 导出
├── userStore.ts      # 用户状态
├── settingsStore.ts  # 设置状态
├── appStore.ts       # 应用状态
└── messageStore.ts   # 消息状态
```

## 使用示例

```typescript
// 在组件中使用
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAppStore } from '@/store/appStore';
import { useMessageStore } from '@/store/messageStore';

const MyComponent = () => {
  // 使用状态
  const user = useUserStore(state => state.user);
  const settings = useSettingsStore(state => state.settings);
  const app = useAppStore(state => state.app);
  const messages = useMessageStore(state => state.messages);

  // 使用动作
  const { setUser, logout } = useUserStore();
  const { updateSettings, toggleTheme } = useSettingsStore();
  const { setLoading, toggleSidebar } = useAppStore();
  const { addMessage, removeMessage } = useMessageStore();

  return (
    // ...
  );
};
```

## 状态持久化

设置状态会自动持久化到 localStorage，其他状态不会持久化。

## 开发工具

在开发环境中，可以使用 Redux DevTools 查看状态变化。 