import React from "react";

type Props = {
  username: string;
  moves: number;
  difficulty: string;
  onPlayAgain: () => void;
  onMenu: () => void;
};

export default function LoseModal({
  username,
  moves,
  difficulty,
  onPlayAgain,
  onMenu,
}: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
      <div className="bg-linear-to-br from-red-50 to-rose-50 p-8 rounded-3xl shadow-2xl border-2 border-red-300 max-w-md w-full animate-scale-up">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3 animate-bounce">💔</div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-red-600 to-rose-600">
            للأسف خسرت!
          </h2>
          <p className="text-slate-600 mt-2 font-medium">
            انتهى الوقت يا {username}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 mb-6 space-y-3 border border-red-200">
          <div className="flex justify-between items-center bg-red-50 px-4 py-2 rounded-lg">
            <span className="text-slate-600 font-semibold">
              ⏱️ الوقت المتبقي:
            </span>
            <span className="text-red-600 font-bold text-lg">0 ثانية</span>
          </div>
          <div className="flex justify-between items-center bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-slate-600 font-semibold">
              🎯 عدد المحاولات:
            </span>
            <span className="text-blue-600 font-bold text-lg">
              {moves} محاولة
            </span>
          </div>
          <div className="flex justify-between items-center bg-orange-50 px-4 py-2 rounded-lg">
            <span className="text-slate-600 font-semibold">⚡ الصعوبة:</span>
            <span className="text-orange-600 font-bold text-lg">
              {difficulty === "easy"
                ? "سهل 😊"
                : difficulty === "medium"
                  ? "متوسط 💪"
                  : "صعب 🔥"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold py-3.5 rounded-xl text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            🔄 إعادة التحدي
          </button>
          <button
            onClick={onMenu}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3.5 rounded-xl text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            🏠 العودة للقائمة الرئيسية
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4 font-medium">
          ⏰ حاول مرة أخرى بسرعة أكبر!
        </p>
      </div>
    </div>
  );
}
