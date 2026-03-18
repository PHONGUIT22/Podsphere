import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AudioPlayer } from "@/components/layout/AudioPlayer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast"; // 1. IMPORT NÓ Ở ĐÂY

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
        <AuthProvider> 
          {/* 2. BỎ TOASTER Ở ĐÂY ĐỂ HIỆN THÔNG BÁO TOÀN APP */}
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-zinc-900 dark:text-white dark:border dark:border-zinc-800',
              duration: 3000,
            }}
          />

          <div className="flex min-h-screen bg-white dark:bg-black">
            
            {/* Sidebar cố định bên trái */}
            <Sidebar />

            {/* CỤM BÊN PHẢI */}
            <div className="flex w-full flex-col lg:pl-64">
              
              <div className="sticky top-0 z-40 w-full">
                <Navbar />
              </div>

              <main className="flex-1 pb-32"> 
                {children}
              </main>
              
              <Footer />
            </div>

            {/* Trình phát nhạc cố định dưới đáy màn hình */}
            <AudioPlayer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}