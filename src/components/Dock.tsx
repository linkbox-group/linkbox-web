import { useState } from "react";

const Dock = () => {
  const [showWechatPopup, setShowWechatPopup] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  const handleWechatHover = () => setShowWechatPopup(true);
  const handleWechatLeave = () => setShowWechatPopup(false);
  const handleFeedbackHover = () => setShowFeedbackPopup(true);
  const handleFeedbackLeave = () => setShowFeedbackPopup(false);

  return (
    <div className="w-full min-h-[16rem] mt-8 px-4 sm:px-8 md:px-16 py-4 sm:py-8">
      <div className="h-[calc(100%-2rem)] flex flex-col">
        {/* 主要内容区域 */}
        <div className="flex-1 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8">
          {/* 左侧：云笺信息组 */}
          <div className="w-full sm:flex-1 flex flex-col items-center sm:items-start gap-6 sm:max-w-[45%]">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
              <img
                src="/logo.png"
                alt="云笺"
                className="w-32 sm:w-40 md:w-52 h-auto"
              />
              <div className="flex flex-col items-center sm:items-start mt-2 sm:mt-0">
                <div className="text-[#2A6ADF] text-2xl sm:text-3xl md:text-5xl font-normal">
                  云笺
                </div>
                <div className="text-[#6190EE] text-sm sm:text-base md:text-lg mt-1 sm:mt-2 md:mt-3">
                  云汇万象 笺载万连
                </div>
              </div>
            </div>
            <div className="flex items-center ml-0 sm:ml-12 gap-4 sm:gap-6">
              <div className="relative">
                <div
                  className="w-10 sm:w-12 md:w-[60px] h-10 sm:h-12 md:h-[60px] rounded-lg flex items-center justify-center cursor-pointer"
                  onMouseOver={handleWechatHover}
                  onMouseOut={handleWechatLeave}
                >
                  <img
                    src="/wechat.svg"
                    alt="微信"
                    className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10"
                  />
                </div>
                {/* 微信二维码弹出框 */}
                <div
                  className={`absolute z-50 p-2 bg-white rounded-lg shadow-lg transition-all duration-300 ease-out transform ${
                    showWechatPopup
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
                  style={{
                    left: "50%",
                    bottom: "100%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="relative">
                    <img
                      src="/linkbox-helper.png"
                      alt="微信二维码"
                      className="max-w-none w-40 sm:w-50 object-contain rounded-lg"
                    />
                    {/* 小三角形指示器 */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                  </div>
                </div>
              </div>
              <div className="w-10 sm:w-12 md:w-[60px] h-10 sm:h-12 md:h-[60px] rounded-lg flex items-center justify-center">
                <img
                  onClick={() =>
                    window.open(
                      "https://www.xiaohongshu.com/user/profile/666975330000000007007ba8",
                      "_blank"
                    )
                  }
                  src="/xhs.svg"
                  alt="小红书"
                  className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10"
                />
              </div>
              <div className="text-[#6190EE] text-xs sm:text-sm md:text-base lg:text-lg cursor-pointer hover:text-[#2A6ADF] transition-colors whitespace-nowrap">
                跳转官号联系方式
              </div>
            </div>
          </div>

          {/* 右侧：功能链接和二维码组 */}
          <div className="w-full sm:flex-1 flex flex-col items-center sm:items-start justify-between gap-6 sm:max-w-[45%]">
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 md:gap-12">
              <div className="text-[#4F89FD] text-base sm:text-lg md:text-2xl cursor-pointer hover:text-[#2A6ADF] transition-colors">
                服务协议
              </div>
              <div className="relative">
                <div
                  className="text-[#4F89FD] text-base sm:text-lg md:text-2xl cursor-pointer hover:text-[#2A6ADF] transition-colors"
                  onMouseOver={handleFeedbackHover}
                  onMouseOut={handleFeedbackLeave}
                >
                  反馈中心
                </div>
                {/* 反馈中心弹出框 */}
                <div
                  className={`absolute z-50 p-2 bg-white rounded-lg shadow-lg transition-all duration-300 ease-out transform ${
                    showFeedbackPopup
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
                  style={{
                    left: "50%",
                    bottom: "100%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="relative">
                    <img
                      src="/group.png"
                      alt="反馈群二维码"
                      className="max-w-none w-40 sm:w-50 object-contain rounded-lg"
                    />
                    {/* 小三角形指示器 */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                  </div>
                </div>
              </div>
              <div className="text-[#4F89FD] text-base sm:text-lg md:text-2xl cursor-pointer hover:text-[#2A6ADF] transition-colors">
                核心功能
              </div>
              <div className="text-[#4F89FD] text-base sm:text-lg md:text-2xl cursor-pointer hover:text-[#2A6ADF] transition-colors">
                使用帮助
              </div>
            </div>
            <div className="flex items-center sm:items-start gap-4 sm:gap-6">
              <img
                src="/wxqr.png"
                alt="微信二维码"
                className="w-16 sm:w-20 md:w-28 h-16 sm:h-20 md:h-28"
              />
              <div className="flex flex-col items-center sm:items-start">
                <div className="text-[#4F89FD] text-lg sm:text-xl md:text-3xl">
                  微信扫码
                </div>
                <div className="text-[#81ABFF] text-xs sm:text-sm md:text-base mt-1 sm:mt-2 md:mt-3">
                  加入我们内测群，获得更多信息
                </div>
              </div>

            
            </div>
            <a
                href="http://beian.miit.gov.cn/"
                target="_blank"
                rel="nofollow noopener"
                className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                赣ICP备2022001931号
              </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dock;
