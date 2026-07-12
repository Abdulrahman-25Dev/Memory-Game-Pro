"use client";

import { useState, useEffect } from "react";

// تعريف نوع الكارت
interface Card {
  id: number;
  value: string; // ممكن تكون إيموجي أو اسم صورة
  isFlipped: boolean;
  isMatched: boolean;
}

export default function Home() {
  // الستيت الخاصة بمستويات الصعوبة
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [cards, setCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-amber-50 p-4">
      <h1 className="text-3xl font-bold text-amber-600 mb-6">Memory Game Pro 🎮</h1>
      
      {/* خيارات مستوى الصعوبة */}
      <div className="flex gap-4 mb-6">
        {(["easy", "medium", "hard"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
              difficulty === level 
                ? "bg-amber-500 text-white shadow-md scale-105" 
                : "bg-white text-amber-700 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            {level === "easy" ? "سهل (3x4)" : level === "medium" ? "متوسط (4x4)" : "صعب (6x4)"}
          </button>
        ))}
      </div>

      {/* العدادات */}
      <div className="flex gap-8 text-lg font-medium text-slate-700 mb-6 bg-white px-6 py-3 rounded-xl shadow-sm">
        <div>الوقت: <span className="font-bold text-amber-600">{time}</span> ثانية</div>
        <div>المحاولات: <span className="font-bold text-amber-600">{moves}</span></div>
      </div>

      {/* منطقة اللعب (الشبكة) */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-amber-100">
        <p className="text-slate-500 text-center">جاهزون لبناء شبكة الكروت هنا...</p>
      </div>
    </div>
  );
}