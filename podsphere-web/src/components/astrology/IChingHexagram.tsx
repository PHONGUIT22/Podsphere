// src/components/astrology/IChingHexagram.tsx
import React from 'react';

export const IChingHexagram = ({ lines, name }: { lines: number[], name: string }) => {
  // lines: [1, 0, 1, 1, 0, 0] (1 là Dương, 0 là Âm - Thứ tự từ dưới lên)
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-col-reverse gap-2">
        {lines.map((type, i) => (
          <div key={i} className="w-24 h-3 flex gap-2">
            {type === 1 ? (
              /* Vạch Dương */
              <div className="w-full h-full bg-indigo-500 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.3)]" />
            ) : (
              /* Vạch Âm */
              <>
                <div className="w-[45%] h-full bg-zinc-700 rounded-sm" />
                <div className="w-[10%] h-full" />
                <div className="w-[45%] h-full bg-zinc-700 rounded-sm" />
              </>
            )}
          </div>
        ))}
      </div>
      <span className="text-sm font-black text-white uppercase tracking-widest">{name}</span>
    </div>
  );
};