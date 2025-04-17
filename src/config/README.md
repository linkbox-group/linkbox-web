# 配置 (Config)

本目录包含应用程序的配置文件。

## 目录结构

```
config/
├── index.ts             # 配置导出入口
├── env.ts               # 环境变量配置
├── api.ts               # API配置
├── routes.ts            # 路由配置
└── ...
```

## 配置设计原则

- 集中管理应用程序配置
- 按环境区分配置
- 提供合理的默认值
- 使用TypeScript类型约束
- 避免硬编码配置

## 示例配置文件

```tsx
// config/env.ts

// 环境类型
export type Environment = 'development' | 'test' | 'production';

// 获取当前环境
export const getEnvironment = (): Environment => {
  return (import.meta.env.MODE as Environment) || 'development';
};

// 判断是否为开发环境
export const isDevelopment = (): boolean => getEnvironment() === 'development';

// 判断是否为测试环境
export const isTest = (): boolean => getEnvironment() === 'test';

// 判断是否为生产环境
export const isProduction = (): boolean => getEnvironment() === 'production';

// 环境变量配置
export const env = {
  // 应用名称
  APP_NAME: import.meta.env.VITE_APP_NAME || '我的应用',
  
  // API基础URL
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // 是否启用API模拟
  API_MOCK: import.meta.env.VITE_API_MOCK === 'true',
  
  // API超时时间（毫秒）
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
  
  // 是否启用日志
  ENABLE_LOGS: import.meta.env.VITE_ENABLE_LOGS !== 'false',
  
  // 日志级别
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  
  // 默认语言
  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || 'zh-CN',
  
  // 应用版本号
  VERSION: import.meta.env.VITE_APP_VERSION || '0.1.0'
};
```

```tsx
// config/api.ts
import { env } from './env';

// API配置
export const apiConfig = {
  // API基础URL
  baseURL: env.API_BASE_URL,
  
  // 请求超时时间
  timeout: env.API_TIMEOUT,
  
  // 请求头
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // 是否启用API模拟
  enableMock: env.API_MOCK,
  
  // 错误重试次数
  retryTimes: 3,
  
  // 状态码处理
  statusHandlers: {
    401: () => {
      // 处理未授权
      localStorage.removeItem('token');
      window.location.href = '/login';
    },
    403: () => {
      // 处理禁止访问
      window.location.href = '/403';
    },
    404: () => {
      // 处理未找到
      window.location.href = '/404';
    },
    500: () => {
      // 处理服务器错误
      console.error('服务器错误，请稍后再试');
    }
  }
};

// API端点
export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token'
  },
  user: {
    profile: '/users/profile',
    update: '/users/profile',
    getById: (id: string) => `/users/${id}`
  },
  // 其他API端点...
};
```

```tsx
// config/feature-flags.ts

// 特性标志类型
export interface FeatureFlags {
  enableDarkMode: boolean;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  newUserProfile: boolean;
  betaFeatures: boolean;
  // 其他特性标志
}

// 从环境变量或本地存储获取特性标志
const getFeatureFlags = (): FeatureFlags => {
  // 尝试从本地存储获取
  const storedFlags = localStorage.getItem('featureFlags');
  let localFlags: Partial<FeatureFlags> = {};
  
  if (storedFlags) {
    try {
      localFlags = JSON.parse(storedFlags);
    } catch (error) {
      console.error('解析特性标志出错', error);
    }
  }
  
  // 默认特性标志与环境变量和本地存储的合并
  return {
    enableDarkMode: import.meta.env.VITE_FEATURE_DARK_MODE !== 'false',
    enableNotifications: import.meta.env.VITE_FEATURE_NOTIFICATIONS !== 'false',
    enableAnalytics: import.meta.env.VITE_FEATURE_ANALYTICS === 'true',
    newUserProfile: import.meta.env.VITE_FEATURE_NEW_PROFILE === 'true',
    betaFeatures: import.meta.env.VITE_FEATURE_BETA === 'true',
    // 其他特性标志
    ...localFlags
  };
};

// 导出特性标志
export const featureFlags = getFeatureFlags();

// 检查特性是否启用
export function isFeatureEnabled(featureName: keyof FeatureFlags): boolean {
  return featureFlags[featureName] === true;
}

// 设置特性标志
export function setFeatureFlag(featureName: keyof FeatureFlags, value: boolean): void {
  // 更新内存中的特性标志
  featureFlags[featureName] = value;
  
  // 保存到本地存储
  try {
    const storedFlags = localStorage.getItem('featureFlags');
    let localFlags: Partial<FeatureFlags> = {};
    
    if (storedFlags) {
      localFlags = JSON.parse(storedFlags);
    }
    
    localStorage.setItem('featureFlags', JSON.stringify({
      ...localFlags,
      [featureName]: value
    }));
  } catch (error) {
    console.error('保存特性标志出错', error);
  }
}
```

```tsx
// config/index.ts

// 导出所有配置
export * from './env';
export * from './api';
export * from './feature-flags';
// 其他配置导出...
``` 