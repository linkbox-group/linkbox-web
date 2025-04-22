import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService, ApiResponse, UserInfo } from "@/services/user";
import { useUserStore } from "@/store/userStore";

export default function User() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    avatar: "",
    bio: "",
    theme: "light",
  });

  const themeOptions = [
    { value: "light", label: "浅色" },
    { value: "dark", label: "深色" },
    { value: "system", label: "跟随系统" },
  ];

  useEffect(() => {
    if (!user?.isLoggedIn) {
      fetchUserInfo();
    } else {
      setFormData({
        username: user.username,
        avatar: user.avatar || "",
        bio: user.bio || "",
        theme: user.theme || "light",
      });
    }
  }, [user]);

  const fetchUserInfo = async () => {
    try {
      const response = await userService.getUserInfo();
      if (response.code === 20000) {
        const userData = response.data;
        setUser({
          id: userData.user_id,
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar,
          bio: userData.bio,
          theme: userData.theme,
          isLoggedIn: true,
        });
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      const response = await userService.updateUserInfo(formData);
      if (response.code === 20000) {
        setUser({
          ...user!,
          username: formData.username,
          avatar: formData.avatar,
          bio: formData.bio,
          theme: formData.theme,
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("更新失败:", error);
    } finally {
      setIsSaving(false);
    }
  };

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

  if (!user?.isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">加载中...</div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">用户信息</h1>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || "https://via.placeholder.com/80"}
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1"
              >
                用户名
              </label>
              <input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium mb-1"
              >
                头像链接
              </label>
              <input
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-1">
                个人简介
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing || isSaving}
                rows={4}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-medium mb-1">
                主题
              </label>
              <select
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                {themeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <div className="flex items-center flex-1">
              <button
                onClick={handleDeleteAccount}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                注销账号
              </button>
            </div>
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSaving ? "保存中..." : "保存"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  退出登录
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  编辑信息
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
