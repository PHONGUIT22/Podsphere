"use client";
import { useEffect, useState } from "react";
import { TuViClassicView } from "@/components/astrology/TuViClassicView";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";

export default function TuViViewPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const savedData = localStorage.getItem("last_tuvi_result");
        if (savedData) setData(JSON.parse(savedData));
    }, []);

    if (!data) return <div className="p-20 text-center">Đang tải lá số mậy ơi...</div>;

    return (
        <div className="min-h-screen bg-[#f4f4f5] pb-20">
            {/* Toolbar */}
            <div className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <Link href="/astrology/tu-vi" className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                    <ArrowLeft size={18} /> Quay lại
                </Link>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 font-bold text-xs"><Share2 size={16}/> Chia sẻ</button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"><Download size={16}/> Lưu ảnh / In</button>
                </div>
            </div>

            <div className="mt-10 px-4">
                <TuViClassicView data={data} />
            </div>
        </div>
    );
}