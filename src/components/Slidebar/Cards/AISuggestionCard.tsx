import React from "react";
import { Send } from "lucide-react";

const AISuggestionCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#EEF4FF] via-[#CBD8ED] via-[#89A2CC] to-[#244F99] dark:from-[#1a1f2e] dark:via-[#1e2538] dark:via-[#2a3349] dark:to-[#1a365d] rounded-lg shadow-sm p-4 select-none h-96 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 dark:text-blue-400 font-medium">AI 建议</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="输入你的问题..."
          className="w-full h-10 px-4 rounded-lg bg-gray-100 dark:bg-[#2a3349] text-gray-700 dark:text-blue-400 placeholder:text-gray-500 dark:placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
        />
        <Send className="w-5 h-5 text-gray-700 dark:text-blue-400" />
      </div>
      <div className="space-y-2 mt-4">
        <div className="h-8 bg-gray-100 dark:bg-[#2a3349] rounded transition-colors duration-300"></div>
        <div className="h-8 bg-gray-100 dark:bg-[#2a3349] rounded transition-colors duration-300"></div>
        <div className="h-8 bg-gray-100 dark:bg-[#2a3349] rounded transition-colors duration-300"></div>
      </div>
    </div>
  );
};

export default AISuggestionCard;
