import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

/**
 * 响应数据接口
 */
export interface ResponseData<T = any> {
  code: number;
  data: T;
  msg: string;
}

/**
 * Token管理器
 */
class TokenManager {
  private static ACCESS_TOKEN_KEY = "access_token";
  private static REFRESH_TOKEN_KEY = "refresh_token";

  /**
   * 获取访问令牌
   */
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * 设置访问令牌
   */
  static setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  /**
   * 获取刷新令牌
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * 设置刷新令牌
   */
  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * 清除所有令牌
   */
  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * 存储认证信息
   */
  static setAuthInfo(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  /**
   * 检查是否已认证
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

/**
 * HTTP状态码对应处理器
 */
interface StatusHandlers {
  [key: number]: () => void;
}

/**
 * API服务类
 */
class ApiService {
  // Axios实例
  private instance: AxiosInstance;

  // 状态码处理器
  private statusHandlers: StatusHandlers = {
    401: () => {
      // 未授权时，如果不是刷新令牌请求，则尝试刷新令牌
      // 这里不需要处理，因为令牌失效时会直接清除令牌并跳转到登录页面
    },
    403: () => {
      console.error("没有权限访问该资源");
      // 可以跳转到403页面
      // window.location.href = '/403';
    },
    404: () => {
      console.error("请求的资源不存在");
      // 可以跳转到404页面
      // window.location.href = '/404';
    },
    500: () => {
      console.error("服务器错误，请稍后再试");
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
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: any) => {
        // 添加令牌到请求头
        const token = TokenManager.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { code, msg, data } = response.data;
        
        // 处理业务状态码
        if (code >= 20000 && code < 30000) {
          // 成功状态码
          return data;
        } else if (code >= 30000 && code < 40000) {
          // 用户相关错误
          console.error(`用户错误: ${msg}`);
          return Promise.reject(new Error(msg));
        } else if (code >= 40000 && code < 50000) {
          // 业务逻辑错误
          console.error(`业务错误: ${msg}`);
          return Promise.reject(new Error(msg));
        } else if (code >= 50000) {
          // 第三方服务错误
          console.error(`第三方服务错误: ${msg}`);
          return Promise.reject(new Error(msg));
        } else if (code >= 10000 && code < 20000) {
          // 系统级别错误
          console.error(`系统错误: ${msg}`);
          return Promise.reject(new Error(msg));
        }
        
        return response.data;
      },
      async (error: AxiosError<ResponseData>) => {
        if (!error.response) {
          // 网络错误或请求被取消
          console.error("网络错误或请求被取消");
          return Promise.reject(error);
        }

        const { status } = error.response;
        const handler = this.statusHandlers[status];

        if (handler) {
          handler();
        }

        // 如果是401错误，直接清除令牌并跳转到登录页面
        if (status === 401) {
          TokenManager.clearTokens();
          window.location.href = "/login";
          return Promise.reject(new Error("令牌已失效，请重新登录"));
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
  setStatusHandler(status: number, handler: () => void): void {
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
