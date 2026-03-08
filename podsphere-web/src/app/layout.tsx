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
  description: "Ứng dụng nghe podcast kết hợp theo dõi sức khỏe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-white dark:bg-black">
          {/* Sidebar cố định bên trái */}
          <Sidebar />

          <div className="flex flex-1 flex-col">
            {/* Navbar trên cùng */}
            <Navbar />

            {/* Nội dung thay đổi theo từng trang */}
            {/* Thêm padding bottom (pb-24) để không bị AudioPlayer che mất nội dung cuối trang */}
            <main className="flex-1 lg:pl-64 pb-24"> 
              <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>

            <AudioPlayer />

            {/* Footer dưới cùng */}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}