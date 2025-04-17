import React from 'react';

const UtilsCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#EEF4FF] to-[#5AB7E4] rounded-lg shadow-sm p-4 select-none h-96">
        <div className="absolute left-3.5 top-[21px] text-[#325E9C] text-sm font-normal font-['Inter']">自定义快捷键</div>
        <div className="absolute left-3.5 top-[103px] text-[#325E9C] text-sm font-normal font-['Inter']">查找失效链接</div>
        <div className="absolute left-3.5 top-[185px] text-[#325E9C] text-sm font-normal font-['Inter']">查找重复链接</div>
        <div className="absolute left-3.5 top-[267px] text-[#325E9C] text-sm font-normal font-['Inter']">回收站</div>
    </div>
  );
};

export default UtilsCard; 