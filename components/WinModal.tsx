import React from "react";

type Props = {
  username: string;
  time: number;
  moves: number;
  difficulty: string;
  onSave: () => void;
  onPlayAgain: () => void;
  onMenu: () => void;
};

export default function WinModal({
  username,
  time,
  moves,
  difficulty,
  onSave,
  onPlayAgain,
  onMenu,
}: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
      <div className="bg-linear-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl shadow-2xl border-2 border-emerald-300 max-w-md w-full animate-scale-up">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3 animate-bounce">🏆</div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">
            مبروك! لقد فزت! 🎉
          </h2>
          <p className="text-slate-600 mt-2 font-medium">
            أنت محارب حقيقي يا {username}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 mb-6 space-y-3 border border-emerald-200">
          <div className="flex justify-between items-center bg-emerald-50 px-4 py-2 rounded-lg">
            <span className="text-slate-600 font-semibold">
              ⏱️ الوقت المستغرق:
            </span>
            <span className="text-emerald-600 font-bold text-lg">
              {(() => {
                const total = difficulty === "easy" ? 30 : difficulty === "hard" ? 90 : 45;
                const elapsed = total - time;
                return `${elapsed} ثانية`;
              })()}
            </span>
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
            onClick={() => {
              onSave();
              onMenu();
            }}
            className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3.5 rounded-xl text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            💾 حفظ التقدم في الصدارة
          </button>
          <button
            onClick={onPlayAgain}
            className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3.5 rounded-xl text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            🔄 إعادة اللعب
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4 font-medium">
          ✨ حاول الفوز بوقت أقل في المرة القادمة!
        </p>
      </div>
    </div>
  );
}
