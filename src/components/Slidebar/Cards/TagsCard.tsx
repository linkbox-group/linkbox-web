import React, { useState, useEffect } from "react";
import { Tag, Plus } from "lucide-react";
import { tagService, Tag as TagType } from "@/services/tags";
import { useUserStore } from "@/store/userStore";
import TagDialog from "@/components/Dialogs/TagDialog";
import { toast } from "sonner";

const TagsCard: React.FC = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useUserStore();

  const fetchTags = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await tagService.getTags();
      setTags(response.data?.tags || []);
    } catch (error) {
      toast.error("获取标签失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [user?.id]);

  return (
    <div className="bg-gradient-to-b from-[#EEF4FF] to-[#7CC6FF] dark:from-[#2D4661] dark:to-[#4C7A9D] rounded-lg shadow-sm p-4 select-none h-96 transition-colors duration-300 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-gray-700 dark:text-blue-400" />
          <span className="text-gray-700 dark:text-blue-400 font-medium">
            标签
          </span>
        </div>
       
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-700 dark:border-blue-400"></div>
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
            暂无标签
          </div>
        ) : (
          <div className="space-y-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color || "#7CC6FF" }}
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {tag.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {tag.item_count}
                </span>
              </div>
            ))}
          </div>
        )}
         <button
          onClick={() => setDialogOpen(true)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-700 dark:text-blue-400" />
        </button>
      </div>

      <TagDialog
        mode="add"
        open={dialogOpen}
        setOpen={setDialogOpen}
        onSuccess={fetchTags}
      />
    </div>
  );
};

export default TagsCard;
