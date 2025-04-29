import { api } from './api';

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
  sender_type: 'SENDER_USER' | 'SENDER_AI';
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
 * AI 服务
 */
export const aiService = {
  /**
   * 发送聊天消息
   * @param content 消息内容
   * @param item_id 关联的条目ID
   */
  sendMessage: async (content?: string, item_id?: string) => {
    return api.get<ApiResponse<{}>>('/api/ai/chat', {
      params: { content, item_id },
    });
  },

  /**
   * 获取聊天消息列表
   */
  getChatList: async () => {
    return api.get<ApiResponse<ChatListResponse>>('/api/ai/chat/list');
  },

  /**
   * 删除聊天消息
   * @param ids 要删除的消息ID列表
   */
  deleteMessages: async (ids: string[]) => {
    return api.delete<ApiResponse<boolean>>('/api/ai/chat', {
      data: { ids },
    });
  },

  /**
   * 获取标签建议
   * @param item_id 条目ID
   */
  getTagSuggestions: async (item_id: string) => {
    return api.post<ApiResponse<string[]>>('/api/ai/tags', { item_id });
  },
}; 