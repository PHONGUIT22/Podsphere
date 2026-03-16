import { Facebook, Instagram, Youtube } from "lucide-react";

export const Footer = () => (
  // Đã XÓA lg:pl-64 ở đây. Chỉ giữ lại màu sắc và border.
  <footer className="mt-auto border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-black text-zinc-500 dark:text-zinc-400">
    
    {/* Vùng max-w-7xl mx-auto px-4 này sẽ căn lề chính xác từng milimet với page.tsx */}
    <div className="mx-auto max-w-7xl px-4">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Cột 1: Brand & Social */}
        <div className="space-y-4">
          <h4 className="text-indigo-600 font-black text-xl tracking-tighter">PODSPHERE</h4>
          <p className="text-sm font-medium leading-relaxed">
            Không gian lắng nghe và chữa lành cho người trẻ Việt Nam. Mỗi tuần một câu chuyện về sức khỏe tinh thần.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <div key={i} className="h-10 w-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all cursor-pointer">
                <Icon size={18} />
              </div>
            ))}
          </div>
        </div>

        {/* Cột 2: Nội dung */}
        <div>
          <h5 className="text-zinc-900 dark:text-white font-bold text-sm mb-4 uppercase tracking-widest">Khám phá</h5>
          <ul className="space-y-3 text-sm font-medium">
            {["Trang chủ", "Podcast nổi bật", "Khóa học kỹ năng", "Bài viết cộng đồng"].map(item => (
              <li key={item} className="hover:text-indigo-600 cursor-pointer transition-colors">{item}</li>
            ))}
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div>
          <h5 className="text-zinc-900 dark:text-white font-bold text-sm mb-4 uppercase tracking-widest">Hỗ trợ</h5>
          <ul className="space-y-3 text-sm font-medium">
            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Câu hỏi thường gặp (FAQ)</li>
            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Chính sách bảo mật</li>
            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Điều khoản sử dụng</li>
            <li className="text-indigo-600 font-black mt-2 bg-indigo-50 dark:bg-indigo-900/20 w-fit px-3 py-1 rounded-lg">Hotline: 1800-6013</li>
          </ul>
        </div>

        {/* Cột 4: Newsletter */}
        <div className="space-y-4">
          <h5 className="text-zinc-900 dark:text-white font-bold text-sm uppercase tracking-widest">Đăng ký tin</h5>
          <p className="text-xs font-medium">Nhận tips chăm sóc sức khỏe tinh thần mỗi tuần.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email của bạn" 
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm flex-1 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-zinc-900 dark:text-white"
            />
            <button className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all">
              Gửi
            </button>
          </div>
          <p className="text-[10px] italic">Miễn phí. Hủy bất cứ lúc nào.</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center space-y-2">
        <p className="text-xs font-medium">
          © 2025 Podsphere. Thiết kế bằng <span className="text-red-500 animate-pulse">❤️</span> tại UIT.
        </p>
        <p className="text-[10px]">
          Nếu gặp khủng hoảng tâm lý, gọi ngay: <span className="text-indigo-600 font-black">1800-6013</span> (miễn phí 24/7).
        </p>
      </div>

    </div>
  </footer>
);