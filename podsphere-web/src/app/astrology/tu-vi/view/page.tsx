"use client";
import { useEffect, useState } from "react";
import { TuViClassicView } from "@/components/astrology/TuViClassicView";
import { ArrowLeft, Download, Share2, Sparkles, Bot } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

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
        toast.loading("AI đang phân tích Tam Phương Tứ Chính...", { id: "ai-toast" });

        try {
            // LƯU Ý: Thay port 8001 thành port bạn đang chạy file agent_service.py
            const response = await axios.post("http://127.0.0.1:8001/api/tuvi-reading", {
                tuvi_json: JSON.stringify(data),
                persona: persona
            });

            if (response.data.status === "success") {
                setAiResult(response.data.ai_reading);
                toast.success("Luận giải hoàn tất!", { id: "ai-toast" });
                // Cuộn xuống chỗ kết quả
                setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 500);
            } else {
                toast.error("Lỗi: " + response.data.message, { id: "ai-toast" });
            }
        } catch (error) {
            toast.error("Lỗi kết nối tới Server AI", { id: "ai-toast" });
        } finally {
            setIsAiLoading(false);
        }
    };

    if (!data) return <div className="p-20 text-center">Đang tải lá số mậy ơi...</div>;

    return (
        <div className="min-h-screen bg-[#f4f4f5] pb-20">
            {/* Toolbar */}
            <div className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <Link href="/astrology/tu-vi" className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                    <ArrowLeft size={18} /> Quay lại
                </Link>
                <div className="flex gap-4">
                    {/* DROP DOWN CHỌN PERSONA */}
                    <select 
                        value={persona} 
                        onChange={(e) => setPersona(e.target.value)}
                        className="border border-gray-300 rounded-xl px-2 text-xs font-bold bg-white"
                    >
                        <option value="traditional">Lão Sư (Truyền thống)</option>
                        <option value="genz">Thầy Mèo (GenZ)</option>
                    </select>

                    {/* NÚT GỌI AI */}
                    <button 
                        onClick={handleAskAi}
                        disabled={isAiLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50"
                    >
                        {isAiLoading ? <span className="animate-spin">⏳</span> : <Bot size={16}/>} 
                        {isAiLoading ? "Đang Luận..." : "AI Luận Giải"}
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 font-bold text-xs"><Share2 size={16}/> Chia sẻ</button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"><Download size={16}/> Lưu ảnh</button>
                </div>
            </div>

            {/* HIỂN THỊ LÁ SỐ */}
            <div className="mt-10 px-4">
                <TuViClassicView data={data} />
            </div>

            {/* KHU VỰC HIỂN THỊ KẾT QUẢ AI (Sẽ hiện ra sau khi load xong) */}
            {aiResult && (
                <div className="max-w-[1100px] mx-auto mt-12 bg-white p-8 rounded-3xl shadow-xl border border-zinc-200">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4">
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                            <Sparkles size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-zinc-800">Kết Quả Luận Giải Từ AI</h2>
                    </div>
                    
                    {/* Render text Markdown (Dùng thẻ div white-space pre-wrap để giữ xuống dòng) */}
                    <div className="prose prose-zinc max-w-none font-serif text-lg leading-relaxed whitespace-pre-wrap text-zinc-700">
                        {aiResult}
                    </div>
                </div>
            )}
        </div>
    );
}