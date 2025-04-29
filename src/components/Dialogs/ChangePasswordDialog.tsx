import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/user";
import { toast } from "sonner";

interface ChangePasswordDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  setOpen,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    // 验证输入
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("请填写所有密码字段");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("新密码和确认密码不匹配");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("新密码长度不能少于6位");
      return;
    }

    try {
      setLoading(true);
      const response = await userService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (response.data.success) {
        toast.success("密码修改成功");
        setOpen(false);
        // 清空表单
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message || "密码修改失败");
      }
    } catch (error) {
      console.error("修改密码失败:", error);
      toast.error("修改密码失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            修改密码
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            请输入当前密码和新密码
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="oldPassword" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              当前密码
            </label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="请输入当前密码"
              className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              新密码
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="请输入新密码"
              className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              确认新密码
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入新密码"
              className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => {
              setOpen(false);
              setOldPassword("");
              setNewPassword("");
              setConfirmPassword("");
            }} 
            disabled={loading}
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            取消
          </Button>
          <Button 
            variant="default"
            onClick={handleChangePassword} 
            disabled={loading}
            className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            {loading ? "修改中..." : "确认修改"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog; 