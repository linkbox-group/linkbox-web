import { create } from "zustand";

/**
 * 消息类型定义
 */
export interface Message {
  id: string;
  type: "success" | "error" | "info" | "warning";
  content: string;
  duration?: number;
}

interface MessageStore {
  // 系统消息
  messages: Message[];

  // 消息动作
  addMessage: (message: Omit<Message, "id">) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  // 消息初始状态
  messages: [],

  // 添加消息
  addMessage: (message: Omit<Message, "id">) =>
    set((state) => {
      const id = Date.now().toString();
      return {
        messages: [...state.messages, { id, ...message }]
      };
    }),

  // 移除消息
  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id)
    })),

  // 清空所有消息
  clearMessages: () =>
    set(() => ({
      messages: []
    })),
})); 