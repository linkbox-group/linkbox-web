import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/user";
import { useUserStore } from "@/store/userStore";
import { PencilIcon } from "lucide-react";
import ChangePasswordDialog from "@/components/Dialogs/ChangePasswordDialog";

export default function User() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useUserStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showWechatPopup, setShowWechatPopup] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("确定要注销账号吗？此操作不可恢复。")) {
      try {
        await userService.deleteUser();
        logout();
        navigate("/login");
      } catch (error) {
        console.error("注销账号失败:", error);
      }
    }
  };

  const handleEditUsername = () => {
    setIsEditingUsername(true);
    setNewUsername(user?.username || "");
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      alert("用户名不能为空");
      return;
    }

    try {
      const response = await userService.updateUserInfo({
        username: newUsername,
        avatar: user?.avatar || "",
        theme: user?.theme || "light",
        bio: user?.bio || "",
      });

      if (response.data.success) {
        setUser({ ...user, username: newUsername });
        setIsEditingUsername(false);
      } else {
        alert(response.data.message || "更新用户名失败，请重试");
      }
    } catch (error) {
      console.error("更新用户名失败:", error);
      alert("更新用户名失败，请重试");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingUsername(false);
    setNewUsername("");
  };

  const handleChangePassword = async () => {
    // 重置错误信息
    setPasswordError("");

    // 验证输入
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("请填写所有密码字段");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("新密码和确认密码不匹配");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("新密码长度不能少于6位");
      return;
    }

    try {
      const response = await userService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (response.data.success) {
        alert("密码修改成功");
        setIsChangePasswordOpen(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(response.data.message || "密码修改失败");
      }
    } catch (error) {
      console.error("修改密码失败:", error);
      setPasswordError("修改密码失败，请重试");
    }
  };

  const handleWechatHover = useCallback(
    (e: React.MouseEvent) => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      
      const rect = e.currentTarget.getBoundingClientRect();
      setPopupPosition({
        x: rect.left,
        y: rect.bottom + 10,
      });
      
      const timeout = setTimeout(() => {
        setShowWechatPopup(true);
      }, 100);
      
      setHoverTimeout(timeout);
    },
    [hoverTimeout]
  );

  const handleFeedbackHover = useCallback(
    (e: React.MouseEvent) => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      
      const rect = e.currentTarget.getBoundingClientRect();
      setPopupPosition({
        x: rect.left,
        y: rect.bottom + 10,
      });
      
      const timeout = setTimeout(() => {
        setShowFeedbackPopup(true);
      }, 100);
      
      setHoverTimeout(timeout);
    },
    [hoverTimeout]
  );

  const handleWechatLeave = useCallback(() => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    const timeout = setTimeout(() => {
      setShowWechatPopup(false);
    }, 100);
    
    setHoverTimeout(timeout);
  }, [hoverTimeout]);

  const handleFeedbackLeave = useCallback(() => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    const timeout = setTimeout(() => {
      setShowFeedbackPopup(false);
    }, 100);
    
    setHoverTimeout(timeout);
  }, [hoverTimeout]);

  if (!user?.isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">加载中...</div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: 'url("/user-bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 顶部背景图片和用户信息 */}
      <div className="relative h-48 md:h-64">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center z-10">
            <img
              src={user.avatar || "https://via.placeholder.com/120"}
              alt={user.username}
              className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
            />
            <div className="mt-4 flex items-center gap-2">
              <h2
                className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white"
                style={{
                  color: "#5A7BB9",
                  fontSize: "32px",
                  fontFamily: "Inter",
                  fontWeight: "400",
                  wordWrap: "break-word",
                }}
              >
                {user.username}
              </h2>
            </div>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* 功能按钮组 */}
      <div className="relative flex flex-col items-start px-4 sm:px-8 md:px-16 lg:px-24 mt-4 space-y-4">
        <button
          className="relative w-full sm:w-48 h-18 transition-all duration-200 hover:opacity-80"
          style={{
            color: "#5A7BB9",
            fontSize: "32px",
            fontFamily: "Inter",
            fontWeight: "normal",
            wordWrap: "break-word",
          }}
        >
          基本信息
        </button>

        {/* 基本信息编辑区域 */}
        <div className="relative w-full sm:ml-[13.75rem] sm:ml-[15.75rem] md:ml-[17.75rem] lg:ml-[19.75rem] sm:w-64 p-4">
          <div className="space-y-6">
            {/* 用户名称 */}
            <div className="space-y-2">
              <div className="text-[#78A7FF]">用户名称：</div>
              <div className="flex flex-wrap items-center gap-2">
                {isEditingUsername ? (
                  <>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full sm:w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A7BB9]"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={handleSaveUsername}
                        className="relative transition-all duration-200 flex-shrink-0"
                        style={{
                          minWidth: "81px",
                          width: "81px",
                          height: "27px",
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: "144px",
                          outline:
                            "1px rgba(90.13, 123.29, 184.88, 0.70) solid",
                          outlineOffset: "-1px",
                          color: "#5A7BB9",
                          fontSize: "15px",
                          fontFamily: "Inter",
                          fontWeight: "100",
                          wordWrap: "break-word",
                        }}
                      >
                        保存
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="relative transition-all duration-200 flex-shrink-0"
                        style={{
                          minWidth: "81px",
                          width: "81px",
                          height: "27px",
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: "144px",
                          outline:
                            "1px rgba(90.13, 123.29, 184.88, 0.70) solid",
                          outlineOffset: "-1px",
                          color: "#5A7BB9",
                          fontSize: "15px",
                          fontFamily: "Inter",
                          fontWeight: "100",
                          wordWrap: "break-word",
                        }}
                      >
                        取消
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={user.username}
                      className="w-full sm:w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A7BB9]"
                      readOnly
                    />
                    <button
                      onClick={handleEditUsername}
                      className="relative transition-all duration-200 flex-shrink-0 mt-2 sm:mt-0"
                      style={{
                        minWidth: "81px",
                        width: "81px",
                        height: "27px",
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "144px",
                        outline: "1px rgba(90.13, 123.29, 184.88, 0.70) solid",
                        outlineOffset: "-1px",
                        color: "#5A7BB9",
                        fontSize: "15px",
                        fontFamily: "Inter",
                        fontWeight: "100",
                        wordWrap: "break-word",
                      }}
                    >
                      设置
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 用户头像 */}
            <div className="space-y-2">
              <div className="text-[#78A7FF]">用户头像：</div>
              <div className="flex flex-wrap items-center gap-4">
                <img
                  src={user.avatar || "https://via.placeholder.com/80"}
                  alt="用户头像"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-[#5A7BB9]"
                />
                <button
                  className="relative transition-all duration-200 flex-shrink-0"
                  style={{
                    minWidth: "81px",
                    width: "81px",
                    height: "27px",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "144px",
                    outline: "1px rgba(90.13, 123.29, 184.88, 0.70) solid",
                    outlineOffset: "-1px",
                    color: "#5A7BB9",
                    fontSize: "15px",
                    fontFamily: "Inter",
                    fontWeight: "100",
                    wordWrap: "break-word",
                  }}
                >
                  设置
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          className="relative w-full sm:w-48 h-18 transition-all duration-200 hover:opacity-80"
          style={{
            color: "#5A7BB9",
            fontSize: "32px",
            fontFamily: "Inter",
            fontWeight: "normal",
            wordWrap: "break-word",
          }}
        >
          账号与安全
        </button>

        {/* 安全选项区域 */}
        <div className="relative w-full sm:ml-[13.75rem] sm:ml-[15.75rem] md:ml-[17.75rem] lg:ml-[19.75rem] sm:w-64 p-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-[#78A7FF]">修改密码</span>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="relative transition-all duration-200 flex-shrink-0"
                style={{
                  minWidth: "81px",
                  width: "81px",
                  height: "27px",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "144px",
                  outline: "1px rgba(90.13, 123.29, 184.88, 0.70) solid",
                  outlineOffset: "-1px",
                  color: "#5A7BB9",
                  fontSize: "15px",
                  fontFamily: "Inter",
                  fontWeight: "100",
                  wordWrap: "break-word",
                }}
              >
                修改
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-[#78A7FF]">绑定邮箱</span>
              <button
                className="relative transition-all duration-200 flex-shrink-0"
                style={{
                  minWidth: "81px",
                  width: "81px",
                  height: "27px",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "144px",
                  outline: "1px rgba(90.13, 123.29, 184.88, 0.70) solid",
                  outlineOffset: "-1px",
                  color: "#5A7BB9",
                  fontSize: "15px",
                  fontFamily: "Inter",
                  fontWeight: "100",
                  wordWrap: "break-word",
                }}
              >
                绑定
              </button>
            </div>
          </div>
        </div>

        <button
          className="relative w-full sm:w-48 h-18 transition-all duration-200 hover:opacity-80"
          style={{
            color: "#5A7BB9",
            fontSize: "32px",
            fontFamily: "Inter",
            fontWeight: "normal",
            wordWrap: "break-word",
          }}
        >
          升级Pro会员
        </button>

        <button
          className="relative w-full sm:w-48 h-18 transition-all duration-200 hover:opacity-80"
          style={{
            color: "#5A7BB9",
            fontSize: "32px",
            fontFamily: "Inter",
            fontWeight: "normal",
            wordWrap: "break-word",
          }}
        >
          反馈中心
        </button>

        <button
          onClick={handleDeleteAccount}
          className="relative w-full sm:w-48 h-18 transition-all duration-200 hover:opacity-80"
          style={{
            color: "#5A7BB9",
            fontSize: "32px",
            fontFamily: "Inter",
            fontWeight: "normal",
            wordWrap: "break-word",
          }}
        >
          账号注销
        </button>

        <button
          onClick={handleLogout}
          className="relative w-full sm:w-48 h-18 transition-all duration-200 hover:opacity-80"
          style={{
            color: "#5A7BB9",
            fontSize: "32px",
            fontFamily: "Inter",
            fontWeight: "normal",
            wordWrap: "break-word",
          }}
        >
          退出登录
        </button>
      </div>
      {/* 渐变分割线 */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#568FFF] to-transparent my-8" />

      {/* 底部 Dock 栏 */}
      <div className="w-full min-h-[16rem] mt-8 px-4 sm:px-8 md:px-16 py-4 sm:py-8">
        <div className="h-[calc(100%-2rem)] flex flex-col">
          {/* 主要内容区域 */}
          <div className="flex-1 flex flex-col sm:flex-row justify-between items-around gap-8">
            {/* 左侧：云笺信息组 */}
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-4 sm:gap-8">
                <img
                  src="/logo2.png"
                  alt="云笺"
                  className="w-32 sm:w-44 h-auto"
                />
                <div className="flex flex-col">
                  <div className="text-[#2A6ADF] text-2xl sm:text-4xl font-normal">
                    云笺
                  </div>
                  <div className="text-[#6190EE] text-sm sm:text-base mt-1 sm:mt-2">
                    云汇万象 笺载万连
                  </div>
                </div>
              </div>
              <div className="flex items-center ml-10 gap-4">
                <div className="relative">
                  <div
                    className="w-10 sm:w-[50px] h-10 sm:h-[50px] rounded-lg flex items-center justify-center cursor-pointer"
                    onMouseOver={handleWechatHover}
                    onMouseOut={handleWechatLeave}
                  >
                    <img
                      src="/wechat.svg"
                      alt="微信"
                      className="w-4 sm:w-15 h-4 sm:h-15"
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
                        src="/linkbox-helper.jpg" 
                        alt="微信二维码" 
                        className="max-w-none w-50 object-contain rounded-lg"
                      />
                      {/* 小三角形指示器 */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                    </div>
                  </div>
                </div>
                <div className="w-10 sm:w-[50px] h-10 sm:h-[50px] rounded-lg flex items-center justify-center">
                  <img
                    onClick={() =>
                      window.open(
                        "https://www.xiaohongshu.com/user/profile/666975330000000007007ba8",
                        "_blank"
                      )
                    }
                    src="/xhs.svg"
                    alt="小红书"
                    className="w-4 sm:w-15 h-4 sm:h-15"
                  />
                </div>
                <div className="text-[#6190EE] text-sm sm:text-base cursor-pointer hover:text-[#2A6ADF] transition-colors">
                  跳转官号联系方式
                </div>
              </div>
            </div>

            {/* 右侧：功能链接和二维码组 */}
            <div className="flex flex-col items-start justify-between gap-4">
              <div className="flex flex-wrap justify-end gap-4 sm:gap-10">
                <div className="text-[#4F89FD] text-base sm:text-xl cursor-pointer hover:text-[#2A6ADF] transition-colors">
                  服务协议
                </div>
                <div className="relative">
                  <div 
                    className="text-[#4F89FD] text-base sm:text-xl cursor-pointer hover:text-[#2A6ADF] transition-colors"
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
                        src="/group.jpg" 
                        alt="反馈群二维码" 
                        className="max-w-none w-50 object-contain rounded-lg"
                      />
                      {/* 小三角形指示器 */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                    </div>
                  </div>
                </div>
                <div className="text-[#4F89FD] text-base sm:text-xl cursor-pointer hover:text-[#2A6ADF] transition-colors">
                  核心功能
                </div>
                <div className="text-[#4F89FD] text-base sm:text-xl cursor-pointer hover:text-[#2A6ADF] transition-colors">
                  使用帮助
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src="/wxqr.png"
                  alt="微信二维码"
                  className="w-16 sm:w-24 h-16 sm:h-24"
                />
                <div className="flex flex-col items-start">
                  <div className="text-[#4F89FD] text-lg sm:text-2xl">
                    微信扫码
                  </div>
                  <div className="text-[#81ABFF] text-xs sm:text-sm mt-1 sm:mt-2">
                    加入我们内测群，获得更多信息
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 修改密码对话框 */}
      <ChangePasswordDialog
        open={isChangePasswordOpen}
        setOpen={setIsChangePasswordOpen}
      />
    </div>
  );
}
