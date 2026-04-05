"use client";
import { useEffect, useState } from "react";
import { TuViClassicView } from "@/components/astrology/TuViClassicView";
import { ArrowLeft, Download, Share2, Sparkles, Bot, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function TuViViewPage() {
    const [data, setData] = useState<any>(null);
    const [aiResult, setAiResult] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [persona, setPersona] = useState("traditional");

    useEffect(() => {
        const savedData = localStorage.getItem("last_tuvi_result");
        if (savedData) setData(JSON.parse(savedData));
    }, []);

    const handleAskAi = async () => {
        if (!data) return;
        setIsAiLoading(true);
        const toastId = toast.loading("Pháp sư AI đang bấm độn tìm huyền cơ...");

        try {
            // Gửi dữ liệu sang Server Python (Cổng 8001)
            const response = await axios.post("http://127.0.0.1:8001/api/tuvi-reading", {
                tuvi_json: JSON.stringify(data),
                persona: persona
            });

            if (response.data.status === "success") {
                setAiResult(response.data.ai_reading);
                toast.success("Luận giải hoàn tất!", { id: toastId });
                
                // Tự động cuộn xuống phần luận giải
                setTimeout(() => {
                    const el = document.getElementById("ai-analysis-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                }, 500);
            } else {
                toast.error("Lỗi: " + response.data.message, { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Không thể kết nối với Server AI (Cổng 8001)", { id: toastId });
        } finally {
            setIsAiLoading(false);
        }
    };

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f4f4f5] pb-32">
            {/* Toolbar Cố định phía trên */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <Link href="/astrology/tu-vi" className="flex items-center gap-2 text-sm font-black text-zinc-600 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                    <ArrowLeft size={18} /> Quay lại
                </Link>

                <div className="flex items-center gap-3">
                    {/* Bộ chọn phong cách luận giải */}
                    <select 
                        value={persona}
                        onChange={(e) => setPersona(e.target.value)}
                        className="bg-zinc-100 border-none rounded-xl px-4 py-2 text-xs font-bold text-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="traditional">📜 Lão Sư (Truyền thống)</option>
                        <option value="genz">💅 Thầy Mèo (GenZ)</option>
                    </select>

                    <button 
                        onClick={handleAskAi}
                        disabled={isAiLoading}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                    >
                        {isAiLoading ? <Loader2 className="animate-spin" size={16} /> : <Bot size={16} />}
                        {isAiLoading ? "ĐANG BẤM ĐỘN..." : "AI LUẬN GIẢI"}
                    </button>

                    <button onClick={() => window.print()} className="p-2 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* VÙNG HIỂN THỊ LÁ SỐ */}
            <div className="mt-10 px-4 print:p-0 print:m-0">
                <TuViClassicView data={data} />
            </div>

            {/* VÙNG LUẬN GIẢI AI (Chỉ hiện khi có kết quả) */}
            {aiResult && (
                <div id="ai-analysis-section" className="max-w-[1100px] mx-auto mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-zinc-200 overflow-hidden">
                        {/* Header của vùng AI */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                    <Sparkles size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight uppercase">Huyền Cơ Giải Mã</h2>
                                    <p className="text-indigo-100 text-sm font-medium">Bản luận giải dựa trên Tam Phương Tứ Chính & Phối hợp sao</p>
                                </div>
                            </div>
                            <div className="hidden md:block opacity-20">
                                <Bot size={80} />
                            </div>
                        </div>

                        {/* Nội dung luận giải - Dùng ReactMarkdown để fix lỗi phông chữ thô */}
                        {/* NỘI DUNG LUẬN GIẢI - ĐÃ CHỈNH ĐẬM VÀ RÕ */}
                        <div className="p-10 md:p-16 bg-[#fdfdfb]">
                            {/* 1. Thay đổi text-zinc-700 thành text-zinc-950 để chữ đen đậm hơn */}
                            {/* 2. Thêm font-medium để nét chữ dày hơn một chút */}
                            <div className="prose max-w-none font-serif text-lg leading-relaxed text-zinc-950">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Chỉnh tiêu đề H1 cực đậm và màu xanh đen indigo-950
                                        h1: ({node, ...props}) => (
                                            <h1 className="text-3xl font-black text-indigo-950 border-b-2 border-indigo-200 pb-4 mb-8 uppercase tracking-tight" {...props} />
                                        ),
                                        // Chỉnh tiêu đề H2 đậm rõ, màu indigo-900
                                        h2: ({node, ...props}) => (
                                            <h2 className="text-xl font-black text-indigo-900 mt-12 mb-4 flex items-center gap-2 before:w-2 before:h-6 before:bg-indigo-600 before:rounded-full" {...props} />
                                        ),
                                        // Chỉnh đoạn văn (p) màu đen sâu và nét chữ vừa phải
                                        p: ({node, ...props}) => (
                                            <p className="mb-6 text-zinc-900 font-medium leading-loose" {...props} />
                                        ),
                                        // Chỉnh danh sách (li) đậm hơn
                                        li: ({node, ...props}) => (
                                            <li className="mb-2 ml-4 list-disc text-zinc-900 font-medium" {...props} />
                                        ),
                                        // Chỉnh chữ in đậm (strong) thành màu đen tuyền
                                        strong: ({node, ...props}) => (
                                            <strong className="font-black text-black" {...props} />
                                        )
                                    }}
                                >
                                    {aiResult}
                                </ReactMarkdown>
                            </div>

                            <div className="mt-16 pt-8 border-t border-zinc-200 text-center">
                                <p className="text-zinc-500 text-xs italic font-bold">
                                    * Lưu ý: Kết quả được cung cấp bởi PodSphere AI dựa trên thuật toán lý số. Hãy xem đây là thông tin tham khảo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}