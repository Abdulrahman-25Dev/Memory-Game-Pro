import React from "react";

type Category = {
  name: string;
  isIcon: boolean;
  items: unknown[];
};

type Props = {
  username: string;
  setUsername: (s: string) => void;
  pin: string;
  setPin: (s: string) => void;
  isNewUser: boolean | null;
  setIsNewUser: (v: boolean | null) => void;
  authError: string;
  handleCheckUsername: () => void;
  handleStartGame: (e: React.FormEvent) => Promise<void> | void;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  difficulty: "easy" | "medium" | "hard" | string;
  setDifficulty: React.Dispatch<
    React.SetStateAction<"easy" | "medium" | "hard" | string>
  >;
  categories: Record<string, Category>;
  setScreen: (s: "menu" | "game" | "leaderboard") => void;
};

export default function MainMenu({
  username,
  setUsername,
  pin,
  setPin,
  isNewUser,
  setIsNewUser,
  authError,
  handleCheckUsername,
  handleStartGame,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  categories,
  setScreen,
}: Props) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-amber-100 max-w-md w-full flex flex-col gap-6 transition-all duration-300">
      <h2 className="text-xl font-bold text-slate-700 border-b pb-2 border-amber-100 flex items-center gap-2">
        🛡️ بوابة المحاربين
      </h2>

      {isNewUser === null ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-600">
              اسم المستخدم الموحد:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="اكتب اسمك الفريد..."
              maxLength={15}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium transition-all"
            />
          </div>
          {authError && (
            <p className="text-rose-500 text-sm font-semibold">{authError}</p>
          )}
          <button
            type="button"
            onClick={handleCheckUsername}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-98"
          >
            التحقق من الهوية 🔍
          </button>
        </div>
      ) : (
        <form onSubmit={handleStartGame} className="flex flex-col gap-5">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              مرحباً بك،{" "}
              <span className="text-amber-600 font-bold">{username}</span>
            </p>
            <p className="text-xs text-emerald-600 font-bold mt-1">
              {isNewUser
                ? "✨ حساب جديد! اختر رمز سري لحفظ نقاطك."
                : "🔒 حساب محجوز! أدخل الرمز السري لتأكيد هويتك."}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-600">
              الرمز السري (4 أرقام):
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              className="px-4 py-3 text-center tracking-widest rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-bold text-xl transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-600">
              تصنيف الكروت (ثيم اللعبة):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(categories).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`py-2 px-3 rounded-xl font-semibold transition-all text-xs text-center border ${
                    category === key
                      ? "bg-linear-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {categories[key].name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-600">
              مستوى الصعوبة:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["easy", "medium", "hard"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`py-2.5 rounded-xl font-bold transition-all text-sm ${
                    difficulty === level
                      ? "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-md"
                      : "bg-amber-50 text-amber-800 border border-amber-100 hover:bg-amber-100"
                  }`}
                >
                  {level === "easy"
                    ? "سهل (12)"
                    : level === "medium"
                      ? "متوسط (16)"
                      : "صعب (24) 🔥"}
                </button>
              ))}
            </div>
          </div>

          {authError && (
            <p className="text-rose-500 text-sm font-semibold">{authError}</p>
          )}

          <div className="flex flex-col gap-2 mt-2">
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-lg shadow-lg transition-all active:scale-98"
            >
              دخول و بدء التحدي 🚀
            </button>
            <button
              type="button"
              onClick={() => setIsNewUser(null)}
              className="text-sm text-slate-400 hover:text-slate-600 font-medium text-center transition-all"
            >
              تغيير اسم المستخدم ↩️
            </button>
          </div>
        </form>
      )}

      <button
        type="button"
        onClick={() => setScreen("leaderboard")}
        className=" bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl text-sm transition-all shadow-sm active:scale-98"
      >
        🏆 لوحة الصدارة العالمية
      </button>
    </div>
  );
}
