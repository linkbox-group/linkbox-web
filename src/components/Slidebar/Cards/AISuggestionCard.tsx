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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<{ close: () => void } | null>(null);

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
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    // 添加新消息并保持排序
    setMessages((prev) =>
      [...prev, userMessage].sort(
        (a, b) =>
          new Date(a.send_time).getTime() - new Date(b.send_time).getTime()
      )
    );
    setInput("");
    setIsLoading(true);
    setCurrentAiMessage("");

    // 关闭之前的连接
    eventSourceRef.current?.close();

    // 创建新的 SSE 连接
    eventSourceRef.current = aiService.sendMessage(
      input,
      undefined,
      (content) => {
        setCurrentAiMessage((prev) => prev + content);
      },
      (error) => {
        console.error("发送消息失败:", error);
        setIsLoading(false);
      },
      () => {
        if (currentAiMessage) {
          const aiMessage: ExtendedChatMessage = {
            content: currentAiMessage,
            id: generateUniqueId(),
            user_id: "ai",
            send_time: new Date().toISOString(),
            sender_type: "SENDER_AI",
          };
          // 添加新消息并保持排序
          setMessages((prev) =>
            [...prev, aiMessage].sort(
              (a, b) =>
                new Date(a.send_time).getTime() -
                new Date(b.send_time).getTime()
            )
          );
          setCurrentAiMessage("");
        }
        setIsLoading(false);
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
      eventSourceRef.current?.close();
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#FFFFFF] to-[#B7DEFB] dark:from-[#2A3958] dark:to-[#3C567A] rounded-lg shadow-sm p-4 select-none h-96 transition-colors duration-300 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 dark:text-blue-400 font-medium">
            AI Suggestions
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
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
                  : "bg-white dark:bg-[#2a3349] text-gray-700 dark:text-blue-400 rounded-bl-none border border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        {currentAiMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white dark:bg-[#2a3349] text-gray-700 dark:text-blue-400 rounded-bl-none border border-gray-200 dark:border-gray-700">
              <div className="whitespace-pre-wrap">{currentAiMessage}</div>
            </div>
          </div>
        )}
        {isLoading && !currentAiMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white dark:bg-[#2a3349] text-gray-700 dark:text-blue-400 rounded-bl-none border border-gray-200 dark:border-gray-700">
              <div className="whitespace-pre-wrap">正在思考...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的问题..."
          className="w-full h-10 px-4 rounded-lg bg-gray-100 dark:bg-[#2a3349] text-gray-700 dark:text-blue-400 placeholder:text-gray-500 dark:placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AISuggestionCard;
