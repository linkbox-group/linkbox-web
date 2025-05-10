import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import {
  aiService,
  ChatMessage,
  ApiResponse,
  ChatListResponse,
} from "@/services/ai";

interface ExtendedChatMessage extends ChatMessage {
  id: string;
  user_id: string;
  send_time: string;
  sender_type: "SENDER_USER" | "SENDER_AI";
}

const AISuggestionCard: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAiMessage, setCurrentAiMessage] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<{ close: () => void } | null>(null);
  const currentMessageContentRef = useRef<string>("");

  // 生成唯一 ID 的函数
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // 获取历史消息
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await aiService.getChatList();
        if (response.code === 20000) {
          // 按时间排序消息
          const sortedMessages = response.data.messages
            .map((msg) => ({
              content: msg.content,
              id: msg.id,
              user_id: msg.user_id,
              send_time: msg.send_time,
              sender_type: msg.sender_type,
            }))
            .sort(
              (a, b) =>
                new Date(a.send_time).getTime() -
                new Date(b.send_time).getTime()
            );

          setMessages(sortedMessages);
        }
      } catch (error) {
        console.error("获取消息失败:", error);
      }
    };
    fetchMessages();
  }, []);

  // 滚动到底部
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
      }, 10);
    }
  };

  // 消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentAiMessage]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ExtendedChatMessage = {
      content: input,
      id: generateUniqueId(),
      user_id: "current_user",
      send_time: new Date().toISOString(),
      sender_type: "SENDER_USER",
    };

    // 重置状态
    const userInput = input.trim();
    setInput("");
    setIsLoading(true);
    setCurrentAiMessage("");
    currentMessageContentRef.current = "";

    // 添加用户消息
    setMessages((prev) => [...prev, userMessage]);

    // 关闭之前的连接
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // 创建新的 SSE 连接
    eventSourceRef.current = aiService.sendMessage(
      userInput,
      undefined,
      (content) => {
        currentMessageContentRef.current += content;
        setCurrentAiMessage(currentMessageContentRef.current);
      },
      (error) => {
        console.error("发送消息失败:", error);
        setIsLoading(false);
      },
      () => {
        const finalContent = currentMessageContentRef.current;

        // 如果消息内容为空，不添加新消息
        if (!finalContent.trim()) {
          setIsLoading(false);
          setCurrentAiMessage("");
          currentMessageContentRef.current = "";
          return;
        }

        const aiMessage: ExtendedChatMessage = {
          content: finalContent,
          id: generateUniqueId(),
          user_id: "ai",
          send_time: new Date().toISOString(),
          sender_type: "SENDER_AI",
        };

        setIsLoading(false);
        setCurrentAiMessage("");
        currentMessageContentRef.current = "";

        // 在流结束时添加完整的AI消息
        setMessages((prev) => [...prev, aiMessage]);
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 组件卸载时关闭连接
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-b from-white to-[#B7DEFB] dark:from-[#2A3958] dark:to-[#3C567A] p-4 pb-16 select-none flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#355DA1] dark:text-blue-400 font-bold">
            AI Suggestions
          </span>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="w-full h-full overflow-y-auto mb-4 overflow-x-hidden"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_type === "SENDER_USER"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender_type === "SENDER_USER"
                  ? "bg-blue-500 text-white rounded-br-none shadow-md"
                  : "bg-white dark:bg-[#2a3349] text-[#355DA1] dark:text-blue-400 rounded-bl-none border border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        {currentAiMessage && currentAiMessage.trim() !== "" && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white dark:bg-[#2a3349] text-[#355DA1] dark:text-blue-400 rounded-bl-none border border-gray-200 dark:border-gray-700">
              <div className="whitespace-pre-wrap">{currentAiMessage}</div>
            </div>
          </div>
        )}
        {isLoading && !currentAiMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white dark:bg-[#2a3349] text-[#355DA1] dark:text-blue-400 rounded-bl-none border border-gray-200 dark:border-gray-700">
              <div className="whitespace-pre-wrap">正在思考...</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的问题..."
          className="w-full h-10 px-4 rounded-lg bg-gray-100 dark:bg-[#2a3349] text-[#355DA1] dark:text-blue-400 placeholder:text-gray-500 dark:placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AISuggestionCard;
