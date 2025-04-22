import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { useUserStore } from "@/store/userStore";

/**
 * 响应数据接口
 */
export interface ResponseData<T = any> {
  code: number;
  data: T;
  msg: string;
}

/**
 * API响应数据接口
 */
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

/**
 * Token管理器
 */
class TokenManager {
  /**
   * 获取访问令牌
   */
  static getAccessToken(): string | null {
    const store = useUserStore.getState();
    return store.tokens?.accessToken || null;
  }

  /**
   * 设置访问令牌
   */
  static setAccessToken(token: string): void {
    const store = useUserStore.getState();
    store.setTokens({
      accessToken: token,
      refreshToken: token,
      expiresIn: 3600,
    });
  }

  /**
   * 获取刷新令牌
   */
  static getRefreshToken(): string | null {
    const store = useUserStore.getState();
    return store.tokens?.refreshToken || null;
  }

  /**
   * 设置刷新令牌
   */
  static setRefreshToken(token: string): void {
    const store = useUserStore.getState();
    if (store.tokens) {
      store.setTokens({
        ...store.tokens,
        refreshToken: token,
      });
    }
  }

  /**
   * 清除所有令牌
   */
  static clearTokens(): void {
    const store = useUserStore.getState();
    store.setTokens(null);
  }

  /**
   * 存储认证信息
   */
  static setAuthInfo(accessToken: string, refreshToken: string): void {
    const store = useUserStore.getState();
    store.setTokens({
      accessToken,
      refreshToken,
      expiresIn: 3600,
    });
  }

  /**
   * 检查是否已认证
   */
  static isAuthenticated(): boolean {
    const store = useUserStore.getState();
    return !!store.tokens?.accessToken;
  }
}

/**
 * HTTP状态码对应处理器
 */
interface StatusHandlers {
  [key: number]: (error?: AxiosError<ResponseData>) => Promise<boolean | void>;
}

/**
 * API服务类
 */
class ApiService {
  // Axios实例
  private instance: AxiosInstance;

  // 状态码处理器
  private statusHandlers: StatusHandlers = {
    40100: async () => {
      const refreshToken = TokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await this.instance.post<
            ApiResponse<{
              access_token: string;
              refresh_token: string;
            }>
          >("/auth/refresh", {
            refresh_token: refreshToken,
          });

          if (response.data.code === 20000) {
            TokenManager.setAuthInfo(
              response.data.data.access_token,
              response.data.data.refresh_token
            );
            return true;
          }
        } catch (error) {
          console.error("刷新 token 失败:", error);
        }
      }
      TokenManager.clearTokens();
      window.location.href = "/login";
      return false;
    },
    40300: async (error?: AxiosError<ResponseData>) => {
      if (!error) return false;
      const response = error.response?.data;
      if (response?.msg === "Token 验证错误") {
        TokenManager.clearTokens();
        window.location.href = "/login";
        return true;
      }
      console.error("没有权限访问该资源");
      return false;
    },
    40400: async () => {
      console.error("请求的资源不存在");
      return false;
    },
    50000: async () => {
      console.error("服务器错误，请稍后再试");
      return false;
    },
  };

  /**
   * 构造函数
   */
  constructor(baseURL: string = "/api", timeout: number = 10000) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        const token = TokenManager.getAccessToken();
        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { code, msg } = response.data;

        // 处理业务状态码
        if (code >= 20000 && code < 30000) {
          return response.data;
        }

        // 查找对应的错误处理器
        const handler = this.statusHandlers[code];
        if (handler) {
          return handler().then(() => Promise.reject(new Error(msg)));
        }

        // 其他错误
        if (code >= 30000 && code < 40000) {
          console.error(`用户错误: ${msg}`);
        } else if (code >= 40000 && code < 50000) {
          console.error(`业务错误: ${msg}`);
        } else if (code >= 50000) {
          console.error(`第三方服务错误: ${msg}`);
        } else if (code >= 10000 && code < 20000) {
          console.error(`系统错误: ${msg}`);
        }

        return Promise.reject(new Error(msg));
      },
      async (error: AxiosError<ResponseData>) => {
        if (!error.response) {
          console.error("网络错误或请求被取消");
          return Promise.reject(error);
        }

        const { code, msg } = error.response.data;
        const handler = this.statusHandlers[code];

        if (handler) {
          const isHandled = await handler(error);
          if (isHandled) {
            return Promise.reject(new Error(msg));
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * 设置基础URL
   */
  setBaseURL(baseURL: string): void {
    this.instance.defaults.baseURL = baseURL;
  }

  /**
   * 设置请求超时时间
   */
  setTimeout(timeout: number): void {
    this.instance.defaults.timeout = timeout;
  }

  /**
   * 设置请求头
   */
  setHeaders(headers: Record<string, string>): void {
    Object.assign(this.instance.defaults.headers, headers);
  }

  /**
   * 设置状态处理器
   */
  setStatusHandler(
    status: number,
    handler: (error?: AxiosError<ResponseData>) => Promise<boolean | void>
  ): void {
    this.statusHandlers[status] = handler;
  }

  /**
   * GET请求
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<any, T>(url, config);
  }

  /**
   * POST请求
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.post<any, T>(url, data, config);
  }

  /**
   * PUT请求
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.put<any, T>(url, data, config);
  }

  /**
   * DELETE请求
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<any, T>(url, config);
  }

  /**
   * PATCH请求
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.patch<any, T>(url, data, config);
  }

  /**
   * 上传文件
   */
  async upload<T = any>(
    url: string,
    file: File,
    data?: Record<string, any>,
    onProgress?: (percent: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }

    return this.instance.post<any, T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress
        ? (progressEvent: any) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 100)
            );
            onProgress(percentCompleted);
          }
        : undefined,
    });
  }
}

// 从环境变量获取API配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 10000);

// 创建API服务实例
export const api = new ApiService(API_BASE_URL, API_TIMEOUT);

// 导出TokenManager以便在其他地方使用
export { TokenManager };
