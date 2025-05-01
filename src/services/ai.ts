import { api } from "./api";

/**
 * 通用响应类型
 */
export interface ApiResponse<T> {
  msg: string;
  code: number;
  data: T;
}

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  send_time: string;
  sender_type: "SENDER_USER" | "SENDER_AI";
}

/**
 * 聊天消息列表响应
 */
export interface ChatListResponse {
  messages: ChatMessage[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 删除消息请求参数
 */
export interface DeleteMessagesRequest {
  ids: string[];
}

/**
 * 获取标签建议请求参数
 */
export interface GetTagSuggestionsRequest {
  item_id: string;
}

/**
 * SSE 消息接口
 */
interface SSEMessage {
  message?: {
    content: string;
  };
  content?: string;
}

/**
 * AI 服务
 */
export const aiService = {
  /**
   * 发送聊天消息（使用 SSE）
   * @param content 消息内容
   * @param item_id 关联的条目ID
   * @param onMessage 消息回调函数
   * @param onError 错误回调函数
   * @param onComplete 完成回调函数
   */
  sendMessage: (
    content: string,
    item_id?: string,
    onMessage?: (content: string) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ) => {
    const params: Record<string, string> = {
      content,
    };
    if (item_id) {
      params.item_id = item_id;
    }

    const handleMessage = (data: string) => {
      if (data === 'EOF') {
        onComplete?.();
        return;
      }

      try {
        const sseMessage = JSON.parse(data) as SSEMessage;
        if (sseMessage.message?.content) {
          onMessage?.(sseMessage.message.content);
        } else if (sseMessage.content) {
          onMessage?.(sseMessage.content);
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error, 'Raw data:', data);
      }
    };

    return api.sendSSE("/ai/chat", params, handleMessage, onError, onComplete);
  },

  /**
   * 获取聊天消息列表
   */
  getChatList: async () => {
    return api.get<ApiResponse<ChatListResponse>>("/ai/chat/list");
  },

  /**
   * 删除聊天消息
   * @param ids 要删除的消息ID列表
   */
  deleteMessages: async (ids: string[]) => {
    return api.delete<ApiResponse<boolean>>("/ai/chat", {
      data: { ids },
    });
  },

  /**
   * 获取标签建议
   * @param item_id 条目ID
   */
  getTagSuggestions: async (item_id: string) => {
    return api.post<ApiResponse<string[]>>("/ai/tags", { item_id });
  },
};
