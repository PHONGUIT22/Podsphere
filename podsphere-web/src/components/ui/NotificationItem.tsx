// NotificationItem.tsx
export const NotificationItem = ({ noti }: { noti: import("@/types/system").NotificationDto }) => (
  <div className={`flex flex-col gap-1 border-b border-zinc-100 p-4 last:border-0 dark:border-zinc-800 ${!noti.isRead ? 'bg-indigo-50/50 dark:bg-indigo-950/10' : ''}`}>
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-tighter text-indigo-600">{noti.type}</span>
      <span className="text-[10px] text-zinc-400">{new Date(noti.createdAt).toLocaleDateString()}</span>
    </div>
    <h5 className="text-sm font-semibold">{noti.title}</h5>
    <p className="text-xs text-zinc-500">{noti.message}</p>
  </div>
);