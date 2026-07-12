"use client";

import { useState, useEffect, useRef } from "react";
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
  SiPostgresql,
  SiMysql,
} from "react-icons/si";

interface Card {
  id: number;
  value: React.ComponentType<{ className?: string }> | string;
  color?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// 📂 تعريف التصنيفات مع الألوان الرسمية
const CATEGORIES = {
  emojis: {
    name: "إيموجي منوع 😀",
    isIcon: false,
    items: [
      { value: "🍎" },
      { value: "🍌" },
      { value: "🍉" },
      { value: "🍇" },
      { value: "🍓" },
      { value: "🍒" },
      { value: "🍕" },
      { value: "🍔" },
      { value: "🍟" },
      { value: "🍦" },
      { value: "⚽" },
      { value: "🎮" },
    ],
  },
  programming: {
    name: "لغات برمجة 💻",
    isIcon: true,
    items: [
      { value: SiJavascript, color: "text-[#F7DF1E]" },
      { value: SiTypescript, color: "text-[#3178C6]" },
      { value: SiPython, color: "text-[#3776AB]" },
      { value: SiGo, color: "text-[#00ADD8]" },
      { value: SiPhp, color: "text-[#777BB4]" },
      { value: SiCplusplus, color: "text-[#00599C]" },
      { value: SiRuby, color: "text-[#CC342D]" },
      { value: SiRust, color: "text-[#000000]" },
      { value: SiPostgresql, color: "text-[#4169E1]" },
      { value: SiMysql, color: "text-[#4479A1]" },
      { value: SiLinux, color: "text-[#FCC624]" },
      { value: SiNodedotjs, color: "text-[#339933]" },
    ],
  },
  tech_logos: {
    name: "رموز تقنية 🌐",
    isIcon: true,
    items: [
      { value: SiReact, color: "text-[#61DAFB]" },
      { value: SiVuedotjs, color: "text-[#4FC08D]" },
      { value: SiAngular, color: "text-[#DD0031]" },
      { value: SiNextdotjs, color: "text-[#000000]" },
      { value: SiNodedotjs, color: "text-[#339933]" },
      { value: SiGit, color: "text-[#F05032]" },
      { value: SiTailwindcss, color: "text-[#06B6D4]" },
      { value: SiDocker, color: "text-[#2496ED]" },
      { value: SiKubernetes, color: "text-[#326CE5]" },
      { value: SiFigma, color: "text-[#F24E1E]" },
      { value: SiMongodb, color: "text-[#47A248]" },
      { value: SiApple, color: "text-[#000000]" },
    ],
  },
  animals: {
    name: "حيوانات 🦁",
    isIcon: false,
    items: [
      { value: "🦁" },
      { value: "🐯" },
      { value: "🐱" },
      { value: "🐶" },
      { value: "🐺" },
      { value: "🦊" },
      { value: "🐻" },
      { value: "🐼" },
      { value: "🐨" },
      { value: "🐹" },
      { value: "🐰" },
      { value: "🐸" },
    ],
  },
};

export default function Home() {
  const [screen, setScreen] = useState<"menu" | "game" | "leaderboard">("menu");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [category, setCategory] = useState<keyof typeof CATEGORIES>("emojis");

  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState("");

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const handleCheckUsername = async () => {
    // 1. التحقق الأولي من المدخلات في الفرونت إند
    if (!username.trim() || username.length < 3) {
      setAuthError("يجب أن يكون اسم المستخدم 3 أحرف على الأقل!");
      return;
    }

    setAuthError(""); // تصغير أو مسح الأخطاء السابقة لو وجدت

    try {
      // 2. إرسال اسم المستخدم للباك إند للتحقق منه في MongoDB
      const response = await fetch("http://localhost:5000/api/auth/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. تحديث الـ State بناءً على رد الباك إند الحقيقي
        setIsNewUser(data.isNewUser);

        // يمكنك استخدام رسالة الباك إند الترحيبية وتخزينها في State لو أحببت عرضها
        // مثلاً: console.log(data.message);
      } else {
        setAuthError(data.message || "حدث خطأ أثناء التحقق من الاسم");
      }
    } catch (error) {
      console.error("خطأ في الاتصال بالباك إند:", error);
      setAuthError("فشل الاتصال بالسيرفر، تأكد من تشغيل الباك إند أولاً!");
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
    if (difficulty === "hard") pairCount = 12; // 24 بطاقة متساوية تماماً! 🔥

    const currentItems = CATEGORIES[category].items;
    const selectedItems = currentItems.slice(
      0,
      Math.min(pairCount, currentItems.length),
    );
    const gameItems = [...selectedItems, ...selectedItems];

    const shuffledCards = gameItems
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        value: item.value,
        color: (item as { color?: string }).color,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledCards);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
    setSelectedCards([]);
    setIsGameOver(false);
    setScreen("game");
  };

  const resetMenu = () => {
    setScreen("menu");
    setIsNewUser(null);
    setPin("");
    setAuthError("");
  };

  useEffect(() => {
    if (gameStarted && screen === "game" && !isGameOver) {
      timerIdRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [gameStarted, screen, isGameOver]);

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
          setCards((prevCards) => {
            const newCards = prevCards.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c,
            );

            // التحقق من الفوز
            const allMatched = newCards.every((c) => c.isMatched);
            if (allMatched) {
              setIsGameOver(true);
              // إيقاف العداد
              if (timerIdRef.current) {
                clearInterval(timerIdRef.current);
                timerIdRef.current = null;
              }
            }

            return newCards;
          });
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
    if (difficulty === "hard") return "grid-cols-4 sm:grid-cols-6";
    return "grid-cols-4";
  };

  const saveGameScore = () => {
    // 🎯 دالة فارغة للربط مع الـ Backend لاحقاً
    console.log("حفظ النقاط:", { username, time, moves, difficulty, category });
    // TODO: أرسل البيانات إلى الـ API
  };

  const handlePlayAgain = () => {
    let pairCount = 8;
    if (difficulty === "easy") pairCount = 6;
    if (difficulty === "hard") pairCount = 12;

    const currentItems = CATEGORIES[category].items;
    const selectedItems = currentItems.slice(
      0,
      Math.min(pairCount, currentItems.length),
    );
    const gameItems = [...selectedItems, ...selectedItems];

    const shuffledCards = gameItems
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        value: item.value,
        color: (item as { color?: string }).color,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledCards);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
    setSelectedCards([]);
    setIsGameOver(false);
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
                        ? "سهل (12)"
                        : level === "medium"
                          ? "متوسط (16)"
                          : "صعب (24) 🔥"}
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

          {/* 🏆 تمت إعادة زر لوحة الصدارة هنا ليكون متاحاً دائماً */}
          <button
            type="button"
            onClick={() => setScreen("leaderboard")}
            className=" bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl text-sm transition-all shadow-sm active:scale-98"
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

          {/* 🎉 نافذة الفوز / نهاية اللعبة (WIN MODAL) */}
          {isGameOver && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
              <div className="bg-linear-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl shadow-2xl border-2 border-emerald-300 max-w-md w-full animate-scale-up">
                {/* 🏆 رسالة النجاح والإيموجي */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3 animate-bounce">🏆</div>
                  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">
                    مبروك! لقد فزت! 🎉
                  </h2>
                  <p className="text-slate-600 mt-2 font-medium">
                    أنت محارب حقيقي يا {username}
                  </p>
                </div>

                {/* 📊 الإحصائيات النهائية */}
                <div className="bg-white rounded-2xl p-5 mb-6 space-y-3 border border-emerald-200">
                  <div className="flex justify-between items-center bg-emerald-50 px-4 py-2 rounded-lg">
                    <span className="text-slate-600 font-semibold">
                      ⏱️ الوقت المستغرق:
                    </span>
                    <span className="text-emerald-600 font-bold text-lg">
                      {time} ثانية
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
                    <span className="text-slate-600 font-semibold">
                      ⚡ الصعوبة:
                    </span>
                    <span className="text-orange-600 font-bold text-lg">
                      {difficulty === "easy"
                        ? "سهل 😊"
                        : difficulty === "medium"
                          ? "متوسط 💪"
                          : "صعب 🔥"}
                    </span>
                  </div>
                </div>

                {/* 🔘 الأزرار */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      saveGameScore();
                      resetMenu();
                    }}
                    className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3.5 rounded-xl text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    💾 حفظ التقدم في الصدارة
                  </button>
                  <button
                    onClick={handlePlayAgain}
                    className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3.5 rounded-xl text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    🔄 إعادة اللعب
                  </button>
                </div>

                {/* 📝 نصيحة صغيرة */}
                <p className="text-center text-xs text-slate-500 mt-4 font-medium">
                  ✨ حاول الفوز بوقت أقل في المرة القادمة!
                </p>
              </div>
            </div>
          )}

          <div
            className={`grid ${getGridCols()} gap-3 sm:gap-4 bg-white p-6 rounded-2xl shadow-xl border border-amber-100 max-w-full justify-center justify-items-center`}
          >
            {cards.map((card) => {
              const isIconComponent = typeof card.value === "function";
              const IconComponent = isIconComponent
                ? (card.value as unknown as React.ComponentType<{
                    className?: string;
                  }>)
                : null;

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`w-14 h-18 sm:w-20 sm:h-24 flex items-center justify-center text-2xl rounded-xl font-bold border transition-all duration-300 transform ${
                    card.isFlipped || card.isMatched
                      ? "bg-amber-50 border-amber-400 text-slate-800 shadow-inner"
                      : "bg-linear-to-br from-amber-500 to-orange-500 text-white border-transparent text-xl shadow active:scale-95 hover:brightness-105"
                  }`}
                >
                  {card.isFlipped || card.isMatched ? (
                    IconComponent ? (
                      <IconComponent
                        className={`w-8 h-8 sm:w-12 sm:h-12 ${card.color || "text-slate-700"} animate-scale-up`}
                      />
                    ) : (
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

      {/* 3️⃣ شاشة لوحة الصدارة (LEADERBOARD) */}
      {screen === "leaderboard" && (
        <div className="flex flex-col items-center animate-fade-in ">
          <button
            onClick={resetMenu}
            className="bg-amber-500 px-6 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all text-center shadow-md active:scale-98"
          >
            العودة للقائمة الرئيسية 🏠
          </button>
        </div>
      )}
    </div>
  );
}
