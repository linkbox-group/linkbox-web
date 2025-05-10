import { useNavigate } from "react-router-dom";
import Dock from "../components/Dock";
import { useState } from "react";

const Introduce = () => {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 点击遮罩层的进入按钮时触发
  const handleEnterClick = () => {
    setIsTransitioning(true);
    setOverlayOpacity(0);
    
    // 等待动画完成后再移除遮罩层
    setTimeout(() => {
      setShowOverlay(false);
      setIsTransitioning(false);
    }, 800); // 与CSS过渡时间一致
  };

  return (
    <div
      className="w-full min-h-screen bg-white relative"
      style={{
        backgroundImage: `url(/introbg.png)`,
        backgroundSize: "100% auto",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
      }}
    >
      {/* 遮罩层 */}
      {showOverlay && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center transition-all duration-800 ease-in-out"
          style={{ 
            opacity: overlayOpacity,
            transform: `scale(${overlayOpacity === 0 ? 1.05 : 1})`,
          }}
        >
          {/* 背景图像 */}
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url(/introbg.png)`, backgroundSize: "100% auto",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center top",
            }}
          >
            {/* 顶部导航栏 */}
            <div
              className="absolute top-0 left-0 w-full h-[49px]"
              style={{
                background: "white",
                boxShadow: "0px 3px 4.5px rgba(125.72, 125.72, 125.72, 0.20)",
                overflow: "hidden",
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}
            >
              <div className="flex items-center h-full">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="h-[52px] ml-0"
                  style={{ width: 74.83 }}
                />
                <div
                  className="ml-2"
                  style={{
                    color: "rgba(38.86, 116.81, 222.05, 0.67)",
                    fontSize: 15,
                    fontFamily: "Inter",
                    fontWeight: 200,
                  }}
                >
                  云笺-跨平台收藏工具
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
              <p className="text-xl text-[#002DB5] mb-8">
                一站式链接收集与智能整理工具，让你的灵感、信息不再散落天涯
              </p>
              <p className="text-2xl text-[#002DB5] mb-4">云汇万象，笺载万连</p>
              <p className="text-xl text-[#002DB5]">下一站</p>
              <img src="/logo-write.svg" alt="next" className="w-55 mt-5" />
            </div>
            <div className="absolute bottom-[123px] w-full flex justify-center cursor-pointer hover:scale-[1.03] transition-transform duration-300" onClick={handleEnterClick}>
              <img src="/chair-enter.svg" alt="enter" className="w-full sm:w-2/5" />
            </div>
            {/* 底部蓝色长条 */}
            <div className="absolute h-[123px] bg-[#3C76C7]/60 left-0 bottom-0 w-full" />
          </div>
        </div>
      )}

      {/* 主内容，添加入场动画 */}
      <div className={`${isTransitioning ? 'animate-fadeIn' : ''}`}>
        {/* 顶部导航栏 */}
        <div className="w-full h-12 bg-white shadow-sm flex items-center justify-between px-4 fixed top-0 z-50">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="logo" className="w-14 h-10" />
            <span className="text-blue-600 text-sm font-light">
              云笺-跨平台收藏工具
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              onClick={() => navigate("/login")}
            >
              登录
            </button>
            <button
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              onClick={() => navigate("/register")}
            >
              注册
            </button>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="pt-12">
          {/* 标题部分 */}
          <div className="max-w-4xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
            <p className="text-xl text-[#002DB5] mb-8">
              一站式链接收集与智能整理工具，让你的灵感、信息不再散落天涯
            </p>
            <p className="text-2xl text-[#002DB5] mb-4">云汇万象，笺载万连</p>
            <p className="text-xl text-[#002DB5]">下一站</p>
            <img src="/logo-write.svg" alt="next" className="w-55 mt-5" />
          </div>

          {/* AI 功能部分 */}
          <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
            <div className="space-y-6 mb-12 flex flex-col items-center justify-center">
              <h2 className="text-4xl text-[#002DB5] text-center mb-8">
                AI助力收藏无情儿
              </h2>
              <p className="text-xl text-[#002DB5] text-center">
                AI智能推荐标签并分内别类
              </p>
              <p className="text-xl text-[#002DB5] text-center">
                帮你快速建立清晰结构
              </p>
              <p className="text-xl text-[#002DB5] text-center">
                收藏后还能通过对话式小助手，获得灵感总结与整理建议，让知识管理更高效
              </p>
            </div>
            <img src="/intro1.png" alt="intro1" className="rounded-lg w-10/12" />
          </div>

          {/* 智能归类部分 */}
          <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
            <div className="space-y-6 mb-12 flex flex-col items-center justify-center">
              <h2 className="text-4xl text-[#002DB5] text-center mb-8">
                智能归类 省心收藏
              </h2>
              <p className="text-xl text-[#002DB5] text-center">
                支持以文件夹和标签两种方式整理内容
              </p>
              <p className="text-xl text-[#002DB5] text-center">
                收藏时可一键归类，灵活清晰
              </p>
              <p className="text-xl text-[#002DB5] text-center">
                多维视角管理信息，打造专属结构化知识空间
              </p>
            </div>
            <img
              src="/intro2.png"
              alt="智能归类展示"
              className="rounded-lg w-10/12"
            />
          </div>

          {/* 内容保鲜部分 */}
          <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
            <div className="space-y-6 mb-12 flex flex-col items-center justify-center">
              <h2 className="text-4xl text-[#002DB5] text-center mb-8">
                关效即检 内容保鲜
              </h2>
              <p className="text-xl text-[#002DB5] text-center">
                系统每日自动检测已收藏链接有效性
              </p>
              <p className="text-xl text-[#002DB5] text-center">
                发现失效自动标记提醒，避免内容积灰
              </p>
              <p className="text-xl text-[#002DB5] text-center">
                让你的知识库始终保持新鲜、可用、高效
              </p>
            </div>
            <img
              src="/intro3.png"
              alt="内容保鲜展示"
              className="rounded-lg w-10/12"
            />
          </div>
          {/* 底部进入按钮 */}
          <div className="flex justify-center z-50 px-4 mb-12">
            <button
              className="bg-white text-[#002DB5] text-xl sm:text-2xl md:text-4xl w-full sm:w-2/3 md:w-1/2 lg:w-1/3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 shadow-lg hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => navigate("/register")}
            >
              点击进入
            </button>
          </div>
        </div>
        {/* 使用 Dock 组件 */}
        <Dock />
      </div>

      {/* 添加动画样式 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          
          .transition-all {
            transition-property: all;
          }
          
          .duration-800 {
            transition-duration: 800ms;
          }
        `
      }} />
    </div>
  );
};

export default Introduce;
