import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

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
  // 最大重试次数
  private maxRetries = 0;
  // 重试延迟时间（毫秒）
  private retryDelay = 1000;

  // 状态码处理器
  private statusHandlers: StatusHandlers = {
    40001: async () => {
      console.error("请求的资源不存在");
      toast.error("请求的资源不存在");
      return false;
    },
    40100: async (error?: AxiosError<ResponseData>) => {
      const originalRequest = error?.config;
      const refreshToken = TokenManager.getRefreshToken();

      if (!refreshToken) {
        TokenManager.clearTokens();
        window.location.href = "/login";
        return false;
      }

      try {
        // 阻止重复刷新
        if (originalRequest?.url?.includes("/user/refresh-token")) {
          TokenManager.clearTokens();
          window.location.href = "/login";
          return false;
        }

        const response = await this.instance.post<string>(
          "/user/refresh-token",
          {
            refresh_token: refreshToken,
          }
        );

        if (response.data) {
          TokenManager.setAccessToken(response.data);

          if (originalRequest) {
            originalRequest.headers.Authorization = `Bearer ${response.data}`;
            return true;
          }
        }
      } catch (refreshError) {
        console.error("刷新 token 失败:", refreshError);
        toast.error("登录已过期，请重新登录");
        TokenManager.clearTokens();
        window.location.href = "/login";
      }
      return false;
    },

    30000: async (error?: AxiosError<ResponseData>) => {
      // 类似40100的处理逻辑
      const originalRequest = error?.config;
      const refreshToken = TokenManager.getRefreshToken();

      if (!refreshToken) {
        TokenManager.clearTokens();
        window.location.href = "/login";
        return false;
      }

      try {
        if (originalRequest?.url?.includes("/user/refresh-token")) {
          TokenManager.clearTokens();
          window.location.href = "/login";
          return false;
        }

        const response = await this.instance.post<string>(
          "/user/refresh-token",
          {
            token: refreshToken,
          }
        );
        console.log(response);
        if (response.data) {
          TokenManager.setAccessToken(response.data);

          if (originalRequest) {
            originalRequest.headers.Authorization = `Bearer ${response.data}`;
            return true;
          }
        }
      } catch (refreshError) {
        console.error("刷新 token 失败:", refreshError);
        toast.error("登录已过期，请重新登录");
        TokenManager.clearTokens();
        window.location.href = "/login";
      }
      return false;
    },

    40400: async () => {
      console.error("请求的资源不存在");
      return false;
    },
    50000: async (error?: AxiosError<ResponseData>) => {
      console.error("服务器错误，请稍后再试", error?.response?.data);
      if (error?.response?.data?.msg) {
        console.error(error.response.data.msg);
      }
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
        console.error("请求错误:", error.message);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      async (error: AxiosError<ResponseData>) => {
        const originalRequest = error.config;

        // 处理业务错误码
        if (error.response?.data?.code) {
          const handler = this.statusHandlers[error.response.data.code];
          if (handler) {
            const shouldRetry = await handler(error);

            // 如果handler返回true且有原始请求，则重试请求
            if (shouldRetry && originalRequest) {
              return this.instance(originalRequest);
            }
          }
        }

        // 其他错误处理
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
   * 重试请求
   */
  private async retryRequest<T>(
    request: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    try {
      return await request();
    } catch (error) {
      if (retryCount < this.maxRetries) {
        // 等待一段时间后重试
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        return this.retryRequest(request, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * GET请求
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.retryRequest(() => this.instance.get<any, T>(url, config));
  }

  /**
   * POST请求
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.retryRequest(() =>
      this.instance.post<any, T>(url, data, config)
    );
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

  /**
   * 创建 SSE 连接
   * @param url 请求URL
   * @param onMessage 消息回调函数
   * @param onError 错误回调函数
   * @param onComplete 完成回调函数
   */
  createSSEConnection(
    url: string,
    onMessage?: (data: any) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ) {
    const token = TokenManager.getAccessToken();
    const urlObj = new URL(
      this.instance.defaults.baseURL + url,
      window.location.origin
    );

    const headers = new Headers();
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
    headers.append("Accept", "text/event-stream");
    headers.append("Cache-Control", "no-cache");
    headers.append("Connection", "keep-alive");

    const controller = new AbortController();
    const { signal } = controller;

    fetch(urlObj.toString(), {
      method: "GET",
      headers,
      credentials: "include",
      signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        const processStream = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                onComplete?.();
                break;
              }

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              let currentEvent = "";
              let currentData = "";

              for (const line of lines) {
                if (line.startsWith("event:")) {
                  currentEvent = line.slice(6).trim();
                } else if (line.startsWith("data:")) {
                  currentData = line.slice(5).trim();
                } else if (line === "") {
                  // 空行表示消息结束
                  if (currentData) {
                    onMessage?.(currentData);

                    // 如果收到 EOF，关闭连接
                    if (currentData === "EOF") {
                      controller.abort();
                      onComplete?.();
                      return;
                    }
                  }
                  currentEvent = "";
                  currentData = "";
                }
              }
            }
          } catch (error: unknown) {
            if (error instanceof Error && error.name === "AbortError") {
              onComplete?.();
            } else {
              onError?.(error as Error);
            }
          }
        };

        processStream();
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") {
          onComplete?.();
        } else {
          onError?.(error);
        }
      });

    return {
      close: () => {
        controller.abort();
        onComplete?.();
      },
    };
  }

  /**
   * 发送 SSE 请求
   * @param url 请求URL
   * @param params 请求参数
   * @param onMessage 消息回调函数
   * @param onError 错误回调函数
   * @param onComplete 完成回调函数
   */
  sendSSE(
    url: string,
    params: Record<string, string> = {},
    onMessage?: (data: any) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return this.createSSEConnection(fullUrl, onMessage, onError, onComplete);
  }
}

// 从环境变量获取API配置
const API_BASE_URL = "/api";
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 10000);

// 创建API服务实例
export const api = new ApiService(API_BASE_URL, API_TIMEOUT);

// 导出TokenManager以便在其他地方使用
export { TokenManager };
