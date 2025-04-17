# 页面 (Pages)

本目录包含应用程序的所有页面组件。

## 目录结构

页面目录应按功能模块或路由路径组织。例如：

```
pages/
├── home/                # 主页相关页面
├── auth/                # 认证相关页面
│   ├── login/           # 登录页面
│   └── register/        # 注册页面
├── user/                # 用户相关页面
└── ...
```

## 页面组件设计原则

- 页面组件负责组合和布局其他组件
- 页面组件应处理路由参数和查询参数
- 页面组件可以包含页面特定的状态管理
- 使用TypeScript接口定义Props
- 遵循关注点分离原则

## 页面目录结构示例

```
PageName/
├── PageName.tsx         # 页面组件
├── index.ts             # 导出入口
└── components/          # 页面特定组件
    └── PageComponent.tsx
```

## 示例页面组件

```tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserData } from '@/services/user';
import { UserProfile } from '@/components/user';

interface UserData {
  id: string;
  name: string;
  email: string;
}

export function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchUserData(id)
        .then(data => setUserData(data))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center p-8">加载中...</div>;
  }

  if (!userData) {
    return <div className="text-center p-8">未找到用户数据</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <UserProfile user={userData} />
    </div>
  );
}
``` 