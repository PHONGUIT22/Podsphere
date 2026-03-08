// BlogCard.tsx
export const BlogCard = ({ blog }: { blog: import("@/types/social").BlogDto }) => (
  <div className="flex gap-4 rounded-xl border border-zinc-100 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50">
    <img src={blog.thumbnail || ""} className="h-20 w-20 rounded-lg object-cover" alt="" />
    <div className="flex flex-col justify-center">
      <h4 className="line-clamp-1 font-semibold text-sm">{blog.title}</h4>
      <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{blog.content}</p>
      <span className="mt-2 text-[10px] text-zinc-400 font-medium">By {blog.authorFullName}</span>
    </div>
  </div>
);

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