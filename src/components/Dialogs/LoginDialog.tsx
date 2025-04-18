import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserStore } from "@/store/userStore";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserStore();

  const handleSubmit = async () => {
    if (!username || !password) return;

    try {
      // 模拟登录成功
      setUser({
        id: "1",
        username,
        email: `${username}@example.com`,
        avatar: "",
        isLoggedIn: true,
      });
      onClose();
    } catch (error) {
      console.error("登录失败:", error);
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>登录</AlertDialogTitle>
          <AlertDialogDescription>
            请输入您的账号和密码
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="username" className="text-sm font-medium">
              用户名
            </label>
            <input
              id="username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              placeholder="请输入用户名"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="请输入密码"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>登录</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginDialog; 