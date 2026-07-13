import React from "react";

type Player = {
  username?: string;
  moves?: number;
  timeInSeconds?: number;
};

type Props = {
  leaders: Player[];
  leaderboardDifficulty: string;
  setLeaderboardDifficulty: (d: string) => void;
  resetMenu: () => void;
};

export default function LeaderBoard({
  leaders,
  leaderboardDifficulty,
  setLeaderboardDifficulty,
  resetMenu,
}: Props) {
  return (
    <div className="flex flex-col items-center animate-fade-in w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-150">
      <h2 className="text-3xl font-extrabold text-amber-500 mb-6 text-center drop-shadow-sm flex items-center gap-2">
        🏆 لوحة صدارة المحاربين
      </h2>

      <div className="flex gap-2 justify-center mb-6 w-full">
        {[
          { id: "easy", label: "سهل (12)" },
          { id: "medium", label: "متوسط (16)" },
          { id: "hard", label: "صعب (24) 🔥" },
        ].map((level) => (
          <button
            key={level.id}
            onClick={() => setLeaderboardDifficulty(level.id)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm ${leaderboardDifficulty === level.id ? "bg-amber-500 text-white scale-105" : "bg-gray-100 text-gray-750 hover:bg-gray-200"}`}
          >
            {level.label}
          </button>
        ))}
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 mb-6 bg-gray-50/50">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="bg-amber-500 text-white p-3">
              <th className="p-3 text-center rounded-tr-xl">الترتيب</th>
              <th className="p-3">المحارب</th>
              <th className="p-3 text-center">المحاولات</th>
              <th className="p-3 text-center rounded-tl-xl">الوقت</th>
            </tr>
          </thead>
          <tbody>
            {leaders.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-gray-400 font-medium"
                >
                  لا توجد سجلات أبطال لهذا المستوى بعد. كن الأول! 🎯
                </td>
              </tr>
            ) : (
              leaders.map((player: Player, index: number) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 last:border-0 hover:bg-amber-50/60 transition-colors bg-white"
                >
                  <td className="p-3 text-center font-bold text-gray-400">
                    {index === 0
                      ? "🥇"
                      : index === 1
                        ? "🥈"
                        : index === 2
                          ? "🥉"
                          : `#${index + 1}`}
                  </td>
                  <td className="p-3 font-semibold text-gray-800">
                    {player.username}
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-amber-600">
                    {player.moves}
                  </td>
                  <td className="p-3 text-center font-mono text-gray-600">
                    {player.timeInSeconds ?? 0} ثانية
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={resetMenu}
        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-xl transition-all text-center shadow-md active:scale-98 w-full sm:w-auto"
      >
        العودة للقائمة الرئيسية 🏠
      </button>
    </div>
  );
}
