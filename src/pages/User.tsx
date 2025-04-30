import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/user";
import { useUserStore } from "@/store/userStore";
import { PencilIcon } from "lucide-react";
import ChangePasswordDialog from "@/components/Dialogs/ChangePasswordDialog";
import Dock from "@/components/Dock";

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

      {/* 使用 Dock 组件 */}
      <Dock />

      {/* 修改密码对话框 */}
      <ChangePasswordDialog
        open={isChangePasswordOpen}
        setOpen={setIsChangePasswordOpen}
      />
    </div>
  );
}
