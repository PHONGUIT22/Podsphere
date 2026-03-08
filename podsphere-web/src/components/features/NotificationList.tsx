import { Bell, CheckCheck } from "lucide-react";
import { NotificationDto } from "@/types/system";
import { NotificationItem } from "@/components/ui/NotificationItem"; // Sử dụng cái nãy tao đã code

export const NotificationList = ({ notifications }: { notifications: NotificationDto[] }) => {
  return (
    <div className="w-80 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between bg-zinc-50 p-4 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-indigo-600" />
          <h4 className="text-sm font-bold">Thông báo</h4>
        </div>
        <button className="text-[10px] font-bold text-indigo-600 hover:underline">
          Đánh dấu đã đọc
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(n => <NotificationItem key={n.id} noti={n} />)
        ) : (
          <div className="py-8 text-center text-xs text-zinc-500">Mày chưa có thông báo mới nào.</div>
        )}
      </div>
    </div>
  );
};