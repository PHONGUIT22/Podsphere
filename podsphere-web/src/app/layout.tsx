import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AudioPlayer } from "@/components/layout/AudioPlayer";
import { AuthProvider } from "@/components/providers/AuthProvider"; // Import cái mới tạo

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
      {/* BỌC AUTH PROVIDER Ở ĐÂY */}
        <AuthProvider> 
        <div className="flex min-h-screen bg-white dark:bg-black">
          
          {/* 1. Sidebar cố định bên trái */}
          <Sidebar />

          {/* 2. CỤM BÊN PHẢI: Chỉ bọc lg:pl-64 đúng 1 lần ở div to nhất này để né Sidebar */}
          <div className="flex w-full flex-col lg:pl-64">
            
            {/* Navbar (Không cần pl-64 nữa vì div mẹ đã lo) */}
            <div className="sticky top-0 z-40 w-full">
              <Navbar />
            </div>

            {/* 3. Nội dung chính: Xóa max-w-7xl ở đây vì page.tsx đã tự bọc rồi */}
            <main className="flex-1 pb-32"> 
              {children}
            </main>
            
            {/* Footer */}
            <Footer />

          </div>

          {/* 4. Trình phát nhạc cố định dưới đáy màn hình */}
          <AudioPlayer />
        </div>
      </AuthProvider>
      </body>
    </html>
  );
}