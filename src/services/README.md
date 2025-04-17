# 服务 (Services)

本目录包含应用程序的所有API服务和网络请求。

## 目录结构

服务应按功能、资源或API端点组织。

```
services/
├── api.ts               # API基础配置和工具函数
├── auth.ts              # 认证相关API
├── user.ts              # 用户相关API
└── ...
```

## 服务设计原则

- 每个服务模块应专注于特定资源或功能
- 使用TypeScript定义请求参数和响应类型
- 实现统一的错误处理和响应转换
- 保持服务逻辑与UI组件分离
- 使用适当的缓存和重试策略

## 示例服务模块

```tsx
import { api } from './api';

// 用户数据类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// 用户创建/更新参数类型
export interface UserParams {
  username: string;
  email: string;
  password?: string;
}

// 获取用户列表
export async function getUsers(): Promise<User[]> {
  return api.get('/users');
}

// 获取单个用户详情
export async function getUser(id: string): Promise<User> {
  return api.get(`/users/${id}`);
}

// 创建用户
export async function createUser(params: UserParams): Promise<User> {
  return api.post('/users', params);
}

// 更新用户
export async function updateUser(id: string, params: Partial<UserParams>): Promise<User> {
  return api.put(`/users/${id}`, params);
}

// 删除用户
export async function deleteUser(id: string): Promise<void> {
  return api.delete(`/users/${id}`);
}
```

## API工具示例

```tsx
// api.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 创建axios实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证令牌等
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 处理未授权错误
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API工具方法
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    instance.get<any, T>(url, config),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    instance.post<any, T>(url, data, config),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    instance.put<any, T>(url, data, config),
    
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    instance.delete<any, T>(url, config)
};
``` 