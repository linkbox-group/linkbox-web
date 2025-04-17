import { StateCreator } from "zustand";
import { GlobalState } from "../types";

/**
 * 消息类型定义
 */
export interface Message {
  id: string;
  type: "success" | "error" | "info" | "warning";
  content: string;
  duration?: number;
}

/**
 * 消息状态切片类型
 */
export interface MessageSlice {
  // 系统消息
  messages: Message[];

  // 消息动作
  addMessage: (message: Omit<Message, "id">) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

/**
 * 创建消息状态切片
 */
export const createMessageSlice: StateCreator<
  GlobalState,
  [],
  [],
  MessageSlice
> = (set) => ({
  // 消息初始状态
  messages: [],

  // 添加消息
  addMessage: (message: Omit<Message, "id">) =>
    set((state: GlobalState) => {
      const id = Date.now().toString();
      return {
        ...state,
        messages: [...state.messages, { id, ...message }]
      };
    }),

  // 移除消息
  removeMessage: (id) =>
    set((state: GlobalState) => ({
      ...state,
      messages: state.messages.filter((message) => message.id !== id)
    })),

  // 清空所有消息
  clearMessages: () =>
    set((state: GlobalState) => ({
      ...state,
      messages: []
    })),
});
