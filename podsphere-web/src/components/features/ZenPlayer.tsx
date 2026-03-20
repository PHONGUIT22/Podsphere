"use client";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, X, Wind, CloudRain, Waves, RotateCcw } from "lucide-react";
import { MeditationDto } from "@/services/meditation.service";

interface Props {
  meditation: MeditationDto;
  onClose: () => void;
}

export function ZenPlayer({ meditation, onClose }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [ambientType, setAmbientType] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(meditation.duration > 0 ? meditation.duration : 300);
  const [breathText, setBreathText] = useState("Sẵn sàng?");
  
  const mainAudioRef = useRef<HTMLAudioElement>(null);
  const ambientAudioRef = useRef<HTMLAudioElement>(null);

  // LINK NHẠC NỀN CHUẨN (Mày nên tải về bỏ vào folder public/audio/ cho chắc ăn nhất)
 // LINK NHẠC NỀN CHUẨN (OPEN SOURCE, KHÔNG BỊ CHẶN)
  const ambientSources: Record<string, string> = {
    // Tiếng mưa nhẹ nhàng
    rain: "https://upload.wikimedia.org/wikipedia/commons/d/de/Rain_on_a_tin_roof.ogg",
    
    // Tiếng gió thổi
    wind: "https://upload.wikimedia.org/wikipedia/commons/3/30/Wind_blowing_through_trees.ogg",
    
    // Tiếng sóng biển vỗ
    waves: "https://upload.wikimedia.org/wikipedia/commons/5/52/Ocean_waves_on_the_beach.ogg"
  };

  // 1. LOGIC NÚT PLAY/PAUSE CHÍNH
  const togglePlay = () => {
    if (isPlaying) {
      mainAudioRef.current?.pause();
      ambientAudioRef.current?.pause();
      setIsPlaying(false);
    } else {
      mainAudioRef.current?.play().catch(e => console.log("Lỗi nhạc chính:", e));
      if (ambientType) {
        ambientAudioRef.current?.play().catch(e => console.log("Lỗi nhạc nền:", e));
      }
      setIsPlaying(true);
    }
  };

  // 2. LOGIC ĐỔI NHẠC NỀN (BẤM LÀ KÊU LUÔN)
  const toggleAmbient = (type: string) => {
    if (ambientType === type) {
      // Nếu bấm lại icon đang bật -> Tắt nhạc nền đi
      setAmbientType(null);
    } else {
      // Đổi sang nhạc nền khác
      setAmbientType(type);
      
      // Nếu nhạc chính đang tắt, thì tiện tay bật luôn
      if (!isPlaying) {
        setIsPlaying(true);
        mainAudioRef.current?.play().catch(() => {});
      }
    }
  };

  // Theo dõi sự thay đổi của ambientType và isPlaying để Play/Pause nhạc nền
  useEffect(() => {
    const ambientAudio = ambientAudioRef.current;
    if (!ambientAudio) return;

    // Giảm âm lượng nhạc nền xuống 40% để không đè mất giọng thiền
    ambientAudio.volume = 0.4;

    if (ambientType && isPlaying) {
      // Thay đổi nguồn nhạc và phát
      ambientAudio.src = ambientSources[ambientType];
      ambientAudio.play().catch(e => console.log("Lỗi tải nhạc nền:", e));
    } else {
      ambientAudio.pause();
    }
  }, [ambientType, isPlaying]);

  // 3. LOGIC ĐỒNG HỒ ĐẾM NGƯỢC
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      mainAudioRef.current?.pause();
      ambientAudioRef.current?.pause();
      setIsPlaying(false);
      setBreathText("Hoàn thành! Giỏi lắm.");
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  // 4. LOGIC NHỊP THỞ
  useEffect(() => {
    if (!isPlaying || timeLeft === 0) return;
    const breathCycle = setInterval(() => {
      const sec = timeLeft % 12;
      if (sec >= 8) setBreathText("Hít vào...");
      else if (sec >= 4) setBreathText("Giữ hơi...");
      else setBreathText("Thở ra chậm...");
    }, 1000);
    return () => clearInterval(breathCycle);
  }, [isPlaying, timeLeft]);

  const resetTimer = () => {
    setIsPlaying(false);
    mainAudioRef.current?.pause();
    ambientAudioRef.current?.pause();
    setTimeLeft(meditation.duration > 0 ? meditation.duration : 300);
    setBreathText("Sẵn sàng?");
    if (mainAudioRef.current) mainAudioRef.current.currentTime = 0;
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050b10] text-white overflow-hidden animate-in fade-in duration-500">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src={meditation.thumbnail || "/placeholder.png"} className="w-full h-full object-cover opacity-20 blur-2xl scale-110" alt="" />
        <div className="absolute inset-0 bg-indigo-900/40 blur-[100px]"></div>
      </div>

      <button onClick={onClose} className="absolute top-10 left-10 z-10 flex items-center gap-2 p-3 rounded-full bg-white/10 hover:bg-red-500/80 transition-all font-bold text-xs uppercase tracking-widest">
        <X size={18} /> ĐÓNG
      </button>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md mt-10">
        
        <div className="text-center mb-8 space-y-2">
          <span className="px-4 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30 shadow-lg">
            {meditation.target}
          </span>
          <h2 className="text-3xl font-black tracking-tight drop-shadow-md px-4">{meditation.title}</h2>
          <p className="text-5xl font-black tabular-nums tracking-tighter mt-4">{formatTime(timeLeft)}</p>
        </div>

        {/* Vòng tròn nhịp thở (Breathing Guide) */}
        <div className="relative flex items-center justify-center mb-16 h-64 w-64">
          <div className={`absolute w-64 h-64 rounded-full bg-indigo-500/20 blur-2xl transition-all duration-[4000ms] ${isPlaying && breathText === "Hít vào..." ? 'scale-150 opacity-50' : 'scale-100 opacity-20'}`} />
          <div className={`relative w-48 h-48 rounded-full border-2 border-indigo-400/50 flex items-center justify-center transition-all duration-[4000ms] ${isPlaying && breathText === "Hít vào..." ? 'scale-125 border-indigo-400 bg-indigo-500/10' : 'scale-100'}`}>
             <span className="text-sm font-bold tracking-widest uppercase text-indigo-100 shadow-black drop-shadow-md">
                {breathText}
             </span>
          </div>
        </div>

        {/* Nút điều khiển */}
        <div className="flex items-center gap-8 mb-12">
          <button onClick={resetTimer} className="p-4 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all" title="Bắt đầu lại">
            <RotateCcw size={24} />
          </button>
          <button onClick={togglePlay} className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            {isPlaying ? <Pause size={40} fill="black" /> : <Play size={40} fill="black" className="ml-2" />}
          </button>
          <div className="w-14"></div> {/* Spacer để cân bằng với nút Reset bên trái */}
        </div>

        {/* Mix Nhạc nền */}
        <div className="flex gap-3 items-center bg-black/40 p-4 rounded-[2rem] backdrop-blur-md border border-white/5 shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mr-2 ml-2">Âm thanh:</p>
          <AmbientButton icon={<CloudRain size={20} />} active={ambientType === 'rain'} onClick={() => toggleAmbient('rain')} title="Tiếng Mưa" />
          <AmbientButton icon={<Wind size={20} />} active={ambientType === 'wind'} onClick={() => toggleAmbient('wind')} title="Tiếng Gió" />
          <AmbientButton icon={<Waves size={20} />} active={ambientType === 'waves'} onClick={() => toggleAmbient('waves')} title="Sóng Biển" />
        </div>
      </div>

      {/* AUDIO TAGS LUÔN RENDER */}
      <audio ref={mainAudioRef} src={meditation.audioUrl} loop className="hidden" />
      {/* Không set src cứng ở đây nữa, useEffect sẽ tự lo việc gán src */}
      <audio ref={ambientAudioRef} loop className="hidden" />
    </div>
  );
}

// Sub-component cho nút chọn nhạc nền
function AmbientButton({ icon, active, onClick, title }: any) {
  return (
    <button 
      onClick={onClick} 
      title={title}
      className={`p-3.5 rounded-[1.2rem] transition-all duration-300 ${
        active 
        ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] scale-110' 
        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700 hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}