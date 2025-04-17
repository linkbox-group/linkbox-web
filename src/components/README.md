# 组件 (Components)

本目录包含应用程序的所有可复用UI组件。

## 目录结构

- `common/`: 通用组件，如按钮、输入框、卡片等
- `layout/`: 布局相关组件，如页眉、页脚、侧边栏等
- 其他目录: 按功能模块分组的组件

## 组件设计原则

- 组件应当是可复用的
- 遵循单一职责原则
- 使用函数式组件和Hooks
- 使用TypeScript接口定义Props
- 使用Tailwind CSS进行样式设计

## 组件目录结构示例

```
ComponentName/
├── ComponentName.tsx       # 主组件
├── index.ts                # 导出入口
└── components/             # 子组件目录（如需要）
    └── SubComponent.tsx    # 子组件
```

## 示例组件

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  return (
    <button 
      className={`rounded px-4 py-2 ${
        variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
``` 