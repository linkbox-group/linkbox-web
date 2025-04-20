import React, { useEffect, useState } from "react";
import { Folder, Plus, ChevronRight } from "lucide-react";
import { organizationService } from "@/services/organization";
import { useUserStore } from "@/store/userStore";

const FavoritesCard: React.FC = () => {
  const { user } = useUserStore();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        if (user?.id) {
          const response = await organizationService.getList(user.id);
          if (response.data.organizations) {
            setOrganizations(response.data.organizations);
          }
        }
      } catch (error) {
        console.error("获取组织列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [user?.id]);

  return (
    <div className="bg-gradient-to-b light:from-[#EEF4FF] light:via-[#CBD8ED] light:via-[#89A2CC] light:to-[#244F99] dark:from-[#1a1f2e] dark:to-[#1a365d] rounded-lg shadow-sm p-4 select-none h-96 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-gray-700 dark:text-blue-400" />
          <span className="text-gray-700 dark:text-blue-400 font-medium">
            我的收藏集
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-gray-700 dark:text-blue-400" />
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100%-3rem)] overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">加载中...</div>
        ) : organizations.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">暂无收藏集</div>
        ) : (
          organizations.map((org) => (
            <div
              key={org.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-700 dark:text-gray-200">{org.name}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritesCard;
