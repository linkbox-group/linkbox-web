# 路由 (Routes)

本目录包含应用程序的路由配置。

## 目录结构

```
routes/
├── index.tsx            # 路由配置入口
├── PrivateRoute.tsx     # 受保护路由组件
├── PublicRoute.tsx      # 公共路由组件
└── ...
```

## 路由设计原则

- 路由配置应清晰、可维护
- 支持路由懒加载以提高性能
- 实现路由鉴权和访问控制
- 支持嵌套路由和布局
- 使用TypeScript定义路由参数类型

## 示例路由配置 (React Router v6)

```tsx
// routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// 懒加载路由组件
const Home = lazy(() => import('@/pages/home/Home'));
const Login = lazy(() => import('@/pages/auth/login/Login'));
const Register = lazy(() => import('@/pages/auth/register/Register'));
const Profile = lazy(() => import('@/pages/user/profile/Profile'));
const NotFound = lazy(() => import('@/pages/error/NotFound'));

// 路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Login />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Register />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Profile />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

// 路由提供者组件
export function AppRouter() {
  return <RouterProvider router={router} />;
}

// 导出路由常量
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
};
```

## 受保护路由组件示例

```tsx
// routes/PrivateRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ROUTES } from './index';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    // 重定向到登录页，并保存当前位置以便登录成功后返回
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
```

## 公共路由组件示例

```tsx
// routes/PublicRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ROUTES } from './index';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectAuthenticated?: boolean;
}

export function PublicRoute({ 
  children, 
  redirectAuthenticated = true 
}: PublicRouteProps) {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const from = location.state?.from?.pathname || ROUTES.HOME;

  if (isAuthenticated && redirectAuthenticated) {
    // 如果已登录且需要重定向，则重定向到来源页面或首页
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
``` 