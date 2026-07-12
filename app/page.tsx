"use client";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiGo,
  SiPhp,
  SiCplusplus,
  SiRuby,
  SiRust,
  SiReact,
  SiTailwindcss,
  SiMongodb,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiNodedotjs,
  SiGit,
  SiDocker,
  SiKubernetes,
  SiFigma,
  SiLinux,
  SiApple,
  SiAndroid,
  SiIos,
  SiNginx,
  SiPostgresql,
  SiMysql,
} from "react-icons/si";

import { useState, useEffect } from "react";

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// 📂 تعريف التصنيفات المختلفة للكروت
const CATEGORIES = {
  emojis: {
    name: "إيموجي منوع ✨",
    items: [
      "🍎",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🍒",
      "🍕",
      "🍔",
      "🍟",
      "🍦",
      "⚽",
      "🎮",
      "🎸",
      "🚗",
      "🚀",
      "🛸"
    ],
  },
  programming: {
    name: "لغات برمجة 💻",
    isIcon: true,
    items: [
      SiJavascript,
      SiTypescript,
      SiPython,
      SiGo,
      SiPhp,
      SiCplusplus,
      SiRuby
    ],
  },
  tech_logos: {
    name: "رموز تقنية 🌐",
    items: [
      SiReact,
      SiVuedotjs,
      SiAngular,
      SiNextdotjs,
      SiNodedotjs,
      SiGit,
      SiTailwindcss,
      SiDocker,
      SiKubernetes,
      SiFigma,
      SiLinux,
      SiMongodb,
      SiApple,
      SiAndroid,
      SiIos,
      SiNginx,
      SiPostgresql,
    ],
  },
  animals: {
    name: "حيوانات ظريفة 🦁",
    items: [
      "🦁",
      "🐯",
      "🐱",
      "🐶",
      "🐺",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐹",
      "🐰",
      "🐸",
      "🐵",
      "🐔",
      "🐧",
      "🦅",
      "🦉",
    ],
  },
};

export default function Home() {
  // إدارة الشاشات والمستخدم
  const [screen, setScreen] = useState<"menu" | "game" | "leaderboard">("menu");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );

  // 🎯 ستيت التصنيف المختار (الافتراضي إيموجي)
  const [category, setCategory] = useState<keyof typeof CATEGORIES>("emojis");

  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState("");

  // ستيت اللعبة الحية
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const handleCheckUsername = () => {
    if (!username.trim() || username.length < 3) {
      setAuthError("يجب أن يكون اسم المستخدم 3 أحرف على الأقل!");
      return;
    }
    setAuthError("");
    if (username.toLowerCase() === "عبدالرحمن") {
      setIsNewUser(false);
    } else {
      setIsNewUser(true);
    }
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4 || isNaN(Number(pin))) {
      setAuthError("الرمز السري PIN يجب أن يتكون من 4 أرقام!");
      return;
    }

    if (
      isNewUser === false &&
      username.toLowerCase() === "عبدالرحمن" &&
      pin !== "1234"
    ) {
      setAuthError("الرمز السري PIN غير صحيح لهذا المحارب!");
      return;
    }

    setAuthError("");

    let pairCount = 8;
    if (difficulty === "easy") pairCount = 6;
    if (difficulty === "hard") pairCount = 14;

    // ⚡ جلب عناصر التصنيف المختار حالياً بدلاً من القائمة الثابتة
    const currentItems = CATEGORIES[category].items;
    const selectedItems = currentItems.slice(0, pairCount);
    const gameItems = [...selectedItems, ...selectedItems];

    const shuffledCards = gameItems
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        value: item,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledCards);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
    setSelectedCards([]);
    setScreen("game");
  };

  const resetMenu = () => {
    setScreen("menu");
    setIsNewUser(null);
    setPin("");
    setAuthError("");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && screen === "game") {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, screen]);

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);

    const clickedCard = cards.find((c) => c.id === cardId);
    if (
      !clickedCard ||
      clickedCard.isFlipped ||
      clickedCard.isMatched ||
      selectedCards.length === 2
    )
      return;

    const updatedCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c,
    );
    setCards(updatedCards);

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstId, secondId] = newSelected;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c,
            ),
          );
          setSelectedCards([]);
        }, 300);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c,
            ),
          );
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const getGridCols = () => {
    if (difficulty === "easy") return "grid-cols-4";
    if (difficulty === "hard") return "grid-cols-6";
    return "grid-cols-4";
  };

  return (
    <div
      className="flex flex-col flex-1 items-center justify-center min-h-screen bg-linear-to-b from-amber-50 to-orange-100 p-4 select-none text-right"
      dir="rtl"
    >
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-orange-600 mb-8 drop-shadow">
        Memory Game Pro 🎮
      </h1>

      {/* 1️⃣ الشاشة الرئيسية ونظام الحماية والاختيارات (MENU) */}
      {screen === "menu" && (
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
                <p className="text-rose-500 text-sm font-semibold">
                  {authError}
                </p>
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

              {/* 📂 جديد: قسم اختيار تصنيف الكروت */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-slate-600">
                  تصنيف الكروت (ثيم اللعبة):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>
                  ).map((key) => (
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
                      {CATEGORIES[key].name}
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
                        ? "سهل"
                        : level === "medium"
                          ? "متوسط"
                          : "صعب"}
                    </button>
                  ))}
                </div>
              </div>

              {authError && (
                <p className="text-rose-500 text-sm font-semibold">
                  {authError}
                </p>
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
            className="mt-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold py-3 rounded-xl text-sm transition-all"
          >
            🏆 لوحة الصدارة العالمية
          </button>
        </div>
      )}

      {/* 2️⃣ شاشة اللعب الحية (GAME) */}
      {screen === "game" && (
        <div className="flex flex-col items-center animate-fade-in">
          <div className="mb-4 text-center bg-linear-to-r from-amber-500 to-orange-500 text-white px-5 py-1.5 rounded-full font-bold text-sm shadow-sm flex gap-2 items-center">
            <span>المحارب: {username} 👤</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
              ثيم: {CATEGORIES[category].name.split(" ")[0]}
            </span>
          </div>

          <div className="flex items-center gap-6 mb-6 bg-white px-6 py-3 rounded-xl shadow-md border border-amber-100">
            <div className="text-slate-700">
              الوقت: <span className="font-bold text-amber-600">{time}</span>{" "}
              ثانية
            </div>
            <div className="text-slate-700">
              المحاولات:{" "}
              <span className="font-bold text-amber-600">{moves}</span>
            </div>
            <button
              onClick={resetMenu}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium px-3 py-1 rounded-md text-sm transition-all"
            >
              انسحاب 🏳️
            </button>
          </div>

          <div
            className={`grid ${getGridCols()} gap-4 bg-white p-6 rounded-2xl shadow-xl border border-amber-100 max-w-full`}
          >
            {cards.map((card) => {
              // 1. تحقق أولاً هل القيمة الحالية هي مكوّن أيقونة (دالة) أم نص عادي
              const isIconComponent = typeof card.value === "function";
              // Narrowing for TypeScript: first check runtime type, then cast via unknown to avoid
              // invalid direct cast from string -> ComponentType error.
              const IconComponent = isIconComponent
                ? (card.value as unknown as React.ComponentType<{
                    className?: string;
                  }>)
                : null;

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center text-2xl rounded-xl font-bold border transition-all duration-300 transform ${
                    card.isFlipped || card.isMatched
                      ? "bg-amber-50 border-amber-400 text-slate-800 shadow-inner"
                      : "bg-linear-to-br from-amber-500 to-orange-500 text-white border-transparent text-xl shadow active:scale-95"
                  }`}
                >
                  {/* 2. إذا كان الكرت مقلوباً أو متطابقاً، اعرض محتواه بناءً على نوعه */}
                  {card.isFlipped || card.isMatched ? (
                    IconComponent ? (
                      // إذا كانت أيقونة، نستدعيها كمكوّن ريأكت حقيقي ونعطيها لون وحجم متناسق
                      <IconComponent className="w-10 h-10 text-amber-600 animate-scale-up" />
                    ) : (
                      // إذا كان نصاً أو إيموجي، نعرضه مباشرة
                      (card.value as string)
                    )
                  ) : (
                    "❓"
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
