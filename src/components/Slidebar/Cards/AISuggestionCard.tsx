import React, { useState } from "react";

const AISuggestionCard: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    console.log("发送消息:", inputValue);
    setInputValue("");
  };

  return (
    <div className="bg-gradient-to-b from-[#FFFFFF] to-[#B7DEFB] rounded-lg shadow-sm p-4 select-none h-96">
      <div className="text-[#3C89C4] font-bold   font-serif mb-4">
        AI Suggestion
      </div>
      <div className="flex h-full items-end pb-10 gap-2">
        <div className="flex-1 bg-white rounded-lg flex items-center px-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="开启新的对话"
            className="w-full text-sm h-10 bg-transparent focus:outline-none placeholder:text-[#3C89C4]"
          />
          <svg
            fill="#3C89C4"
            className="w-5 h-5 hover:cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>send-variant-outline</title>
            <path d="M3 20V4L22 12M5 17L16.85 12L5 7V10.5L11 12L5 13.5M5 17V7 13.5Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionCard;
