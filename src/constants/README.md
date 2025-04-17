# 常量 (Constants)

本目录包含应用程序中使用的常量定义。

## 目录结构

常量应按功能或用途分组。

```
constants/
├── index.ts             # 常量导出入口
├── api.ts               # API相关常量
├── routes.ts            # 路由相关常量
├── messages.ts          # 消息相关常量
└── ...
```

## 常量设计原则

- 使用大写字母和下划线命名常量
- 避免使用魔法数字和字符串
- 使用对象映射代替枚举
- 提供清晰的类型定义
- 分类组织相关常量

## 示例常量定义

```tsx
// constants/api.ts

// API基础URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// API路径
export const API_PATHS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token'
  },
  USER: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    GET_BY_ID: (id: string) => `/users/${id}`
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`
  }
};

// HTTP状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// 请求超时时间（毫秒）
export const REQUEST_TIMEOUT = 10000;
```

```tsx
// constants/routes.ts

// 路由路径
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password'
  },
  USER: {
    PROFILE: '/profile',
    SETTINGS: '/settings'
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`
  },
  NOT_FOUND: '*'
};

// 面包屑配置
export const BREADCRUMBS = {
  [ROUTES.HOME]: '首页',
  [ROUTES.AUTH.LOGIN]: '登录',
  [ROUTES.AUTH.REGISTER]: '注册',
  [ROUTES.USER.PROFILE]: '个人资料',
  [ROUTES.USER.SETTINGS]: '设置',
  [ROUTES.PRODUCTS.LIST]: '产品列表'
};
```

```tsx
// constants/messages.ts

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK: '网络错误，请检查您的网络连接',
  SESSION_EXPIRED: '会话已过期，请重新登录',
  UNAUTHORIZED: '您没有权限执行此操作',
  SERVER_ERROR: '服务器错误，请稍后再试',
  VALIDATION: {
    REQUIRED: (field: string) => `${field}不能为空`,
    MIN_LENGTH: (field: string, length: number) => `${field}长度不能少于${length}个字符`,
    MAX_LENGTH: (field: string, length: number) => `${field}长度不能超过${length}个字符`,
    EMAIL: '请输入有效的邮箱地址',
    PASSWORD_MISMATCH: '两次输入的密码不一致'
  }
};

// 成功消息
export const SUCCESS_MESSAGES = {
  LOGIN: '登录成功',
  REGISTER: '注册成功',
  PROFILE_UPDATE: '个人资料更新成功',
  PASSWORD_RESET: '密码重置成功',
  ITEM_CREATED: '创建成功',
  ITEM_UPDATED: '更新成功',
  ITEM_DELETED: '删除成功'
};
```

```tsx
// constants/ui.ts

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGES_DISPLAYED: 5
};

// 颜色主题
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// 媒体查询断点
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  XXL: '1536px'
};
``` 