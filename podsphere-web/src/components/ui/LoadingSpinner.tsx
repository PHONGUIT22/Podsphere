export const LoadingSpinner = ({ fullPage = false }: { fullPage?: boolean }) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-indigo-600 dark:border-zinc-800" />
      <p className="text-xs font-medium text-zinc-500 animate-pulse">Đang lấy dữ liệu...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/80">
        {spinner}
      </div>
    );
  }

  return <div className="flex w-full justify-center py-10">{spinner}</div>;
};