# 类型定义 (Types)

本目录包含应用程序的全局TypeScript类型定义。

## 目录结构

类型定义应按功能模块或领域组织。

```
types/
├── index.ts             # 类型导出入口
├── api.ts               # API相关类型
├── auth.ts              # 认证相关类型
├── user.ts              # 用户相关类型
└── ...
```

## 类型设计原则

- 优先使用接口（interface）而不是类型别名（type）
- 避免使用枚举（enum），使用联合类型或字面量类型代替
- 使用命名空间组织相关类型
- 类型名应当清晰、描述性强
- 在需要扩展的情况下使用接口继承

## 示例类型定义

```tsx
// types/api.ts

// API响应通用结构
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页查询参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应数据
export interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API错误
export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, any>;
}
```

```tsx
// types/user.ts

// 用户基础信息
export interface UserBase {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// 用户详细信息
export interface UserDetail extends UserBase {
  phone?: string;
  bio?: string;
  preferences: UserPreferences;
  roles: string[];
  lastLoginAt?: string;
}

// 用户偏好设置
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// 用户创建参数
export interface CreateUserParams {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

// 用户更新参数
export interface UpdateUserParams {
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  preferences?: Partial<UserPreferences>;
}
```

```tsx
// types/auth.ts

import { UserBase } from './user';

// 认证凭证
export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 认证响应
export interface AuthResponse {
  user: UserBase;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// 认证状态
export interface AuthState {
  user: UserBase | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 注册参数
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

## 类型导出示例

```tsx
// types/index.ts

// 重新导出所有类型
export * from './api';
export * from './auth';
export * from './user';
// 导出其他类型...
``` 