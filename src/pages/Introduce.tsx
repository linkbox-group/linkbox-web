import { useNavigate } from "react-router-dom";
import Dock from "../components/Dock";

const Introduce = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full min-h-screen bg-white"
      style={{
        backgroundImage: `url(/introbg.png)`,
        backgroundSize: "100% auto",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
      }}
    >
      {/* 顶部导航栏 */}
      <div className="w-full h-12 bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-4 fixed top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo2.png" alt="logo" className="w-14 h-10" />
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
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-8xl font-serif text-blue-900 mb-4">云笺</h1>
          <p className="text-xl text-blue-900 mb-8">
            一站式链接收集与智能整理工具，让你的灵感、信息不再散落天涯
          </p>
          <p className="text-2xl text-blue-900 mb-4">云汇万象，笺载万连</p>
          <p className="text-xl text-blue-900">下一站</p>
        </div>

        {/* AI 功能部分 */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="space-y-6 mb-12 flex flex-col items-center justify-center">
            <h2 className="text-4xl text-blue-900 text-center mb-8">
              AI助力收藏无情儿
            </h2>
            <p className="text-xl text-blue-900 text-center">
              AI智能推荐标签并分内别类
            </p>
            <p className="text-xl text-blue-900 text-center">
              帮你快速建立清晰结构
            </p>
            <p className="text-xl text-blue-900 text-center">
              收藏后还能通过对话式小助手，获得灵感总结与整理建议，让知识管理更高效
            </p>
          </div>
          <img
            src="/intro1.jpg"
            alt="AI功能展示"
            className="w-full rounded-lg"
          />
        </div>

        {/* 智能归类部分 */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="space-y-6 mb-12 flex flex-col items-center justify-center">
            <h2 className="text-4xl text-blue-900 text-center mb-8">
              智能归类 省心收藏
            </h2>
            <p className="text-xl text-blue-900 text-center">
              支持以文件夹和标签两种方式整理内容
            </p>
            <p className="text-xl text-blue-900 text-center">
              收藏时可一键归类，灵活清晰
            </p>
            <p className="text-xl text-blue-900 text-center">
              多维视角管理信息，打造专属结构化知识空间
            </p>
          </div>
          <img
            src="/intro2.jpg"
            alt="智能归类展示"
            className="w-full rounded-lg"
          />
        </div>

        {/* 内容保鲜部分 */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="space-y-6 mb-12 flex flex-col items-center justify-center">
            <h2 className="text-4xl text-blue-900 text-center mb-8">
              关效即检 内容保鲜
            </h2>
            <p className="text-xl text-blue-900 text-center">
              系统每日自动检测已收藏链接有效性
            </p>
            <p className="text-xl text-blue-900 text-center">
              发现失效自动标记提醒，避免内容积灰
            </p>
            <p className="text-xl text-blue-900 text-center">
              让你的知识库始终保持新鲜、可用、高效
            </p>
          </div>
          <img
            src="/intro3.jpg"
            alt="内容保鲜展示"
            className="w-full rounded-lg"
          />
        </div>
        {/* 底部进入按钮 */}
        <div className="flex justify-center z-50">
          <button
            className="bg-white text-blue-900 text-2xl px-8 py-6 shadow-lg hover:bg-gray-50 rounded-lg transition-colors duration-200"
            onClick={() => navigate("/register")}
          >
            点击进入
          </button>
        </div>
      </div>
      {/* 使用 Dock 组件 */}
      <Dock />
    </div>
  );
};

export default Introduce;
