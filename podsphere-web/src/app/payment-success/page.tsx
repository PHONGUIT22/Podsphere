"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    toast.success("Nạp tiền thành công! Đang cập nhật tài khoản...");
    const timer = setTimeout(() => {
      router.push("/profile");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] text-white">
      <div className="text-emerald-500 animate-bounce">
        <CheckCircle size={80} />
      </div>
      <h1 className="mt-6 text-3xl font-black">THANH TOÁN XONG RỒI !</h1>
      <p className="mt-2 text-zinc-400">Đợi tí app đang "lên đời" VIP...</p>
    </div>
  );
}