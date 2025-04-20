import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { userService, ApiResponse } from "@/services/user";
import { Loader2 } from "lucide-react";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUserStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    code: "",
  });

  // 根据路由路径设置登录/注册状态
  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // 使用 userService 进行登录
        const response = await userService.login({
          email: formData.email,
          password: formData.password,
        });
        if (response.code === 20000) {
          // 更新用户状态
          login(response);
          toast.success("登录成功");
          navigate("/");
        } else {
          toast.error(response.msg);
        }
      } else {
        // 使用 userService 进行注册
        const response = await userService.register({
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password,
          code: formData.code,
        });

        if (response.code === 20000) {
          toast.success("注册成功");
          navigate("/login");
        } else {
          toast.error(response.msg);
        }
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.msg ||
          (isLogin ? "登录失败，服务器错误" : "注册失败，服务器错误")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      toast.error("请输入邮箱");
      return;
    }

    try {
      setSendingCode(true);
      const response = await userService.sendCode({ email: formData.email });
      if (response.code === 20000) {
        toast.success("验证码已发送");
        setCountdown(60); // 设置60秒倒计时
      } else {
        toast.error(response.msg);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.msg || "发送验证码失败");
    } finally {
      setSendingCode(false);
    }
  };

  const toggleMode = () => {
    navigate(isLogin ? "/register" : "/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-[90%] sm:w-[400px] space-y-6 p-3 sm:p-8 bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-300">
        <div>
          <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {isLogin ? "登录 LinkBox" : "注册 LinkBox"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                邮箱
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:z-10 sm:text-sm bg-white dark:bg-gray-700 transition-colors duration-300"
                placeholder="邮箱"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {!isLogin && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="code" className="sr-only">
                    验证码
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:z-10 sm:text-sm bg-white dark:bg-gray-700 transition-colors duration-300"
                    placeholder="验证码"
                    value={formData.code}
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendingCode || countdown > 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 transition-colors duration-300"
                >
                  {sendingCode ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : countdown > 0 ? (
                    `${countdown}秒后重试`
                  ) : (
                    "获取验证码"
                  )}
                </button>
              </div>
            )}
            <div>
              <label htmlFor="password" className="sr-only">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:z-10 sm:text-sm bg-white dark:bg-gray-700 transition-colors duration-300"
                placeholder="密码"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="confirm_password" className="sr-only">
                  确认密码
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:z-10 sm:text-sm bg-white dark:bg-gray-700 transition-colors duration-300"
                  placeholder="确认密码"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 transition-colors duration-300"
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                </span>
              ) : null}
              {isLogin ? "登录" : "注册"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
              onClick={toggleMode}
            >
              {isLogin ? "没有账户？注册" : "已有账户？登录"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
