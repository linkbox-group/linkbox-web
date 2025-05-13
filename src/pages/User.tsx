import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/user";
import { useUserStore } from "@/store/userStore";
import { ArrowLeft } from "lucide-react";
import ChangePasswordDialog from "@/components/Dialogs/ChangePasswordDialog";
import Dock from "@/components/Dock";

export default function User() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useUserStore();
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

  if (!user?.isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">加载中...</div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url("/user-bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 返回按钮 */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-50 flex items-center justify-center w-10 h-10 bg-[#5A7BB9] rounded-full shadow-lg transition-all duration-200 hover:bg-[#4A6BA9] hover:scale-105 active:scale-95"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

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
      <div className="flex justify-center">
        <div className="relative flex flex-col bg-white/50 w-full sm:w-[926px] items-start px-4 sm:px-8 py-6 mt-4 shadow-md rounded-[6px]">
          {/* 基本信息和账号安全的容器 */}
          <div className="w-full flex flex-col sm:flex-row sm:gap-8">
            {/* 基本信息 */}
            <div className="w-full sm:w-1/2 mb-8 sm:mb-0">
              <div className="text-[25px] text-[#888888] mb-6">基本信息</div>

              {/* 用户头像 */}
              <div className="flex items-center mb-6">
                <span className="text-[25px] text-[#5A7BB9] font-normal ">
                  用户头像：
                </span>
                <div className="w-[53px] h-[53px] bg-[#78A7FF] rounded-full overflow-hidden">
                  <img
                    src={user.avatar || "https://via.placeholder.com/53"}
                    alt="用户头像"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="ml-4 w-[93px] h-[28px] rounded-[144px] border border-[#5A7BB9] text-[#5A7BB9] text-[16px] font-normal transition-all duration-200 hover:bg-[#5A7BB9] hover:text-white hover:scale-105">
                  上传头像
                </button>
              </div>

              {/* 用户名称 */}
              <div className="flex items-center flex-wrap">
                <span className="text-[25px] text-[#5A7BB9] font-normal ">
                  用户名称：
                </span>
                {isEditingUsername ? (
                  <>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-[192px] h-[31px] bg-white rounded-[15.5px] border border-[#9DB0D4] px-4 text-[16px]"
                      placeholder="用户名"
                      autoFocus
                    />
                    <div className="flex gap-2 ml-4 mt-2 sm:mt-0">
                      <button
                        onClick={handleSaveUsername}
                        className="w-[76px] h-[29px] rounded-[144px] border border-[#5A7BB9] text-[#5A7BB9] text-[15px] font-normal transition-all duration-200 hover:bg-[#5A7BB9] hover:text-white hover:scale-105"
                      >
                        保存
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="w-[76px] h-[29px] rounded-[144px] border border-[#5A7BB9] text-[#5A7BB9] text-[15px] font-normal transition-all duration-200 hover:bg-[#5A7BB9] hover:text-white hover:scale-105"
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
                      className="w-[192px] h-[31px] bg-white rounded-[15.5px] border border-[#9DB0D4] px-4 text-[16px] text-[#BABABA]"
                      readOnly
                    />
                    <button
                      onClick={handleEditUsername}
                      className="ml-4 w-[76px] h-[29px] rounded-[144px] border border-[#5A7BB9] text-[#5A7BB9] text-[15px] font-normal transition-all duration-200 hover:bg-[#5A7BB9] hover:text-white hover:scale-105"
                    >
                      设置
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 账号与安全 */}
            <div className="w-full sm:w-1/2">
              <div className="text-[25px] text-[#888888] mb-6">账号与安全</div>

              {/* 绑定账号 */}
              <div className="flex items-center mb-6">
                <span className="text-[25px] text-[#5A7BB9] font-normal ">
                  绑定账号：
                </span>
                <button className="w-[76px] h-[29px] rounded-[144px] border border-[#5A7BB9] text-[#5A7BB9] text-[15px] font-normal transition-all duration-200 hover:bg-[#5A7BB9] hover:text-white hover:scale-105">
                  设置
                </button>
              </div>

              {/* 修改密码 */}
              <div className="flex items-center flex-wrap">
                <span className="text-[25px] text-[#5A7BB9] font-normal ">
                  修改密码：
                </span>

                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="ml-4 w-[76px] h-[29px] rounded-[144px] border border-[#5A7BB9] text-[#5A7BB9] text-[15px] font-normal transition-all duration-200 hover:bg-[#5A7BB9] hover:text-white hover:scale-105"
                >
                  修改
                </button>
              </div>
            </div>
          </div>

          {/* 退出登录按钮 */}
          <div className="w-full flex justify-center mt-8">
            <button
              onClick={handleLogout}
              className="w-[93px] h-[33px] rounded-[144px] border border-[#5A7BB9] text-[#5A7BB9] text-[16px] font-normal transition-all duration-200 hover:bg-[#5A7BB9] hover:text-white hover:scale-105"
            >
              退出登录
            </button>
          </div>

          {/* 账号注销 */}
          <div className="absolute right-4 bottom-4">
            <button
              onClick={handleDeleteAccount}
              className="text-[16px] text-[#98A3BC] hover:text-[#5A7BB9] transition-colors duration-200"
            >
              账号注销
            </button>
          </div>
        </div>
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
