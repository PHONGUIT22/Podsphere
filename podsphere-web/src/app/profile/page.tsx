"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { userService } from "@/services/user.service";
import { paymentService } from "@/services/payment.service";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  User, BookOpen, Award, CreditCard, Settings, 
  LogOut, Camera, Flame, CheckCircle2, Clock, Save, Star, Receipt, ChevronRight
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { UserDto } from "@/types/auth";
import { toast } from "react-hot-toast"; 

// Component chính bọc trong Suspense vì dùng useSearchParams
export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const { logout } = useAuthStore();
  const searchParams = useSearchParams();
  
  // Quản lý Tabs: 'profile' hoặc 'history'
  const [activeTab, setActiveTab] = useState("profile");
  
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    avatar: ""
  });

  // Lấy dữ liệu (Profile + Lịch sử)
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [profileData, historyData] = await Promise.all([
        userService.getProfile(),
        paymentService.getHistory()
      ]);
      
      setProfile(profileData);
      setPaymentHistory(historyData);
      setFormData({
        username: profileData.username || "",
        fullName: profileData.fullName || "",
        email: profileData.email || "",
        avatar: profileData.avatar || ""
      });
    } catch (error) {
      console.error("Lỗi fetch data:", error);
      toast.error("Không đồng bộ được dữ liệu mậy ơi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Kiểm tra nếu quay về từ Stripe thành công
    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");
    if (paymentStatus === "success" || sessionId) {
      toast.success("Chúc mừng mậy đã lên đời PREMIUM thành công! 🎉", {
        duration: 5000,
        icon: '👑',
      });
      // Xóa query params để không hiện lại thông báo khi F5
      window.history.replaceState({}, '', '/profile');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await userService.updateProfile(formData);
      toast.success("Cập nhật thông tin xong rồi nhé!");
      fetchAllData(); 
    } catch (error) {
      toast.error("Lỗi cập nhật rồi mậy!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpgrade = async () => {
    const loadingToast = toast.loading("Đang kết nối cổng thanh toán Stripe...");
    try {
      const checkoutUrl = await paymentService.createCheckout();
      window.location.href = checkoutUrl;
    } catch (error) {
      toast.error("Lỗi thanh toán!", { id: loadingToast });
    }
  };

  if (loading && !profile) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 p-4 lg:p-10">
      <div className="mx-auto max-w-6xl">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">
            {activeTab === "profile" ? "Thông tin cá nhân" : "Lịch sử giao dịch"}
          </h1>
          {activeTab === "profile" && (
            <button 
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 shadow-lg disabled:opacity-50"
            >
              {isUpdating ? <LoadingSpinner /> : <Save size={18} />} Lưu thay đổi
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR TRÁI */}
          <aside className="lg:col-span-1 space-y-4">
            <nav className="rounded-[2rem] bg-zinc-900/50 border border-zinc-800 p-4 shadow-xl">
              <NavItem 
                icon={<User size={18}/>} 
                label="Thông tin cá nhân" 
                active={activeTab === "profile"} 
                onClick={() => setActiveTab("profile")}
              />
              <NavItem 
                icon={<CreditCard size={18}/>} 
                label="Lịch sử thanh toán" 
                active={activeTab === "history"} 
                onClick={() => setActiveTab("history")}
              />
              <NavItem icon={<Award size={18}/>} label="Chứng chỉ" />
              <NavItem icon={<Settings size={18}/>} label="Cài đặt" />
              
              <div className="mt-8 pt-4 border-t border-zinc-800">
                <button 
                  onClick={logout}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500/80 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={18} /> Đăng xuất
                </button>
              </div>
            </nav>
          </aside>

          {/* NỘI DUNG CHÍNH */}
          <main className="lg:col-span-3">
            {activeTab === "profile" ? (
              /* TAB 1: THÔNG TIN CÁ NHÂN */
              <div className="space-y-8 animate-in fade-in duration-500">
                <section className="rounded-[2.5rem] bg-zinc-900/30 border border-zinc-800/50 p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] pointer-events-none"></div>

                  <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-zinc-800/50 pb-10">
                    <div className="relative">
                      <div className="h-32 w-32 rounded-full border-4 border-indigo-600 p-1">
                        <img 
                          src={profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                          className="h-full w-full rounded-full object-cover"
                          alt="Avatar"
                        />
                      </div>
                      <button className="absolute bottom-1 right-1 p-2.5 rounded-full bg-indigo-600 text-white shadow-lg border-4 border-[#050505]"><Camera size={16} /></button>
                    </div>

                    <div className="text-center md:text-left space-y-3">
                      <h2 className="text-4xl font-black text-white tracking-tighter">{profile?.fullName || profile?.username}</h2>
                      <p className="text-zinc-500 font-medium">{profile?.email}</p>
                      
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-1">
                        {/* HIỂN THỊ BADGE DỰA VÀO ROLE */}
                        {profile?.role?.toLowerCase() === "premium" ? (
                          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <Star size={12} fill="currentColor" /> PREMIUM MEMBER ⭐
                          </span>
                        ) : (
                          <button 
                            onClick={handleUpgrade}
                            className="px-5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 animate-pulse"
                          >
                            🚀 Nâng cấp Premium
                          </button>
                        )}
                        <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                          <Flame size={12} fill="currentColor" /> 7 NGÀY STREAK
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Tên đăng nhập</label>
                      <input name="username" value={formData.username} onChange={handleChange} className="w-full rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4 text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Họ và tên</label>
                      <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4 text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Email (Cố định)</label>
                      <input value={formData.email} disabled className="w-full rounded-2xl bg-zinc-800/30 border border-zinc-800/50 p-4 text-zinc-600 cursor-not-allowed outline-none" />
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={<BookOpen size={20}/>} count="3" label="Khóa học" />
                  <StatCard icon={<CheckCircle2 size={20}/>} count="7" label="Hoàn thành" />
                  <StatCard icon={<Clock size={20}/>} count="2h 45m" label="Thời gian" />
                  <StatCard icon={<Award size={20}/>} count="1" label="Chứng chỉ" />
                </div>
              </div>
            ) : (
              /* TAB 2: LỊCH SỬ THANH TOÁN */
              <section className="rounded-[2.5rem] bg-zinc-900/30 border border-zinc-800/50 p-8 shadow-2xl animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-500">
                    <Receipt size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Lịch sử giao dịch</h3>
                    <p className="text-xs text-zinc-500">Quản lý các gói dịch vụ đã mua</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {paymentHistory.length > 0 ? (
                    paymentHistory.map((item) => (
                      <div 
                        key={item.id} 
                        className="group flex items-center justify-between p-5 rounded-[1.5rem] bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle2 size={22} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">Nâng cấp Premium - 1 Tháng</p>
                            <p className="text-[11px] text-zinc-500 font-medium">
                              Giao dịch ngày: {new Date(item.createdAt).toLocaleString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-white italic">50.000đ</p>
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Thành công</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center space-y-4">
                      <div className="mx-auto w-20 h-20 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-600">
                        <CreditCard size={40} />
                      </div>
                      <p className="text-sm font-bold text-zinc-500">Mày chưa có giao dịch nào hết mậy ơi!</p>
                      <button onClick={() => setActiveTab("profile")} className="text-xs font-black text-indigo-500 hover:underline">QUAY LẠI NÂNG CẤP NGAY</button>
                    </div>
                  )}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function NavItem({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
      active ? "bg-indigo-600/10 text-indigo-500 shadow-inner" : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
    }`}>
      {icon} {label}
    </button>
  );
}

function StatCard({ icon, count, label }: { icon: any, count: string, label: string }) {
  return (
    <div className="group rounded-[2rem] bg-zinc-900/40 border border-zinc-800/50 p-6 flex flex-col items-center text-center gap-2 hover:border-indigo-500/30 transition-all">
      <div className="p-3 rounded-2xl bg-zinc-800 text-indigo-500 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-2xl font-black text-white tracking-tighter">{count}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{label}</div>
    </div>
  );
}