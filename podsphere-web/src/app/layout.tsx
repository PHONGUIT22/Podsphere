import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AudioPlayer } from "@/components/layout/AudioPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podsphere - Podcast & Health",
  description: "Ứng dụng nghe podcast kết hợp theo dõi sức khỏe cho sinh viên UIT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-indigo-100 selection:text-indigo-700`}>
        <div className="flex min-h-screen bg-white dark:bg-black">
          
          {/* 1. Sidebar cố định bên trái - Sẽ ẩn trên mobile nếu mày chưa làm Responsive */}
          <Sidebar />

          {/* 2. Cột bên phải chứa Header, Main Content và Footer */}
          <div className="flex flex-1 flex-col">
            
            {/* Navbar trên cùng - Đảm bảo nó cũng có padding left để không đè Sidebar */}
            <div className="sticky top-0 z-40 w-full lg:pl-64">
              <Navbar />
            </div>

            {/* 3. Nội dung chính của trang */}
            {/* pb-32: Padding bottom lớn hơn để không bị AudioPlayer (thường cao ~80-100px) che mất nội dung hay Footer */}
            <main className="flex-1 transition-all duration-300 lg:pl-64 pb-32"> 
              <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
              </div>
              
              {/* Footer nằm cuối phần content của main */}
              <Footer />
            </main>

            {/* 4. Trình phát nhạc cố định dưới đáy màn hình */}
            <AudioPlayer />
          </div>
        </div>
      </body>
    </html>
  );
}