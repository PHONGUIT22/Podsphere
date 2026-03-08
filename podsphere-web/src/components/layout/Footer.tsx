export const Footer = () => (
  <footer className="mt-auto border-t border-zinc-200 bg-white py-8 px-4 dark:border-zinc-800 dark:bg-black lg:pl-72">
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      <div>
        <h5 className="text-sm font-bold">Về Podsphere</h5>
        <ul className="mt-4 space-y-2 text-xs text-zinc-500">
          <li>Giới thiệu</li>
          <li>Tuyển dụng</li>
          <li>Blog sức khỏe</li>
        </ul>
      </div>
      <div>
        <h5 className="text-sm font-bold">Hỗ trợ</h5>
        <ul className="mt-4 space-y-2 text-xs text-zinc-500">
          <li>Trung tâm giúp đỡ</li>
          <li>Chính sách bảo mật</li>
          <li>Điều khoản sử dụng</li>
        </ul>
      </div>
    </div>
    <div className="mt-8 border-t border-zinc-100 pt-8 text-center text-[10px] text-zinc-400 dark:border-zinc-900">
      © 2026 Podsphere Project. Thiết kế bởi Sinh viên UIT.
    </div>
  </footer>
);