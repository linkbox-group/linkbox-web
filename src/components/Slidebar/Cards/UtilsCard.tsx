import React from 'react';

const UtilsCard: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-white to-[#4387C0] dark:from-[#3A4756] dark:to-[#5A7FA3] p-4 pb-16 select-none transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#355DA1] dark:text-blue-400 font-medium">工具</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-8 bg-gray-100 dark:bg-[#2a3349] rounded transition-colors duration-300"></div>
        <div className="h-8 bg-gray-100 dark:bg-[#2a3349] rounded transition-colors duration-300"></div>
        <div className="h-8 bg-gray-100 dark:bg-[#2a3349] rounded transition-colors duration-300"></div>
      </div>
    </div>
  );
};

export default UtilsCard; 