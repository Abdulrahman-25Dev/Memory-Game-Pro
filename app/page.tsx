"use client";

import React, { useState, useEffect, useRef } from "react";
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

import MainMenu from "../components/MainMenu";
import GameBoard from "../components/GameBoard";
import WinModal from "../components/WinModal";
import LoseModal from "../components/LoseModal";
import LeaderBoard from "../components/LeaderBoard";

type Category = {
  name: string;
  isIcon: boolean;
  items: unknown[];
};

type Player = {
  username?: string;
  moves?: number;
  timeInSeconds?: number;
};

type Card = {
  id: number;
  value: unknown;
  color?: string;
  pairKey?: number;
  isFlipped: boolean;
  isMatched: boolean;
};

export const CATEGORIES: Record<string, Category> = {
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
      { value: SiReact, color: "text-[#61DAFB]" },
      { value: SiTailwindcss, color: "text-[#38B2AC]" },
      { value: SiMongodb, color: "text-[#47A248]" },
      { value: SiNextdotjs, color: "text-black" },
    ],
  },
  tech_logos: {
    name: "تقنيات و شعارات ⚙️",
    isIcon: true,
    items: [
      { value: SiNodedotjs, color: "text-green-600" },
      { value: SiGit, color: "text-orange-600" },
      { value: SiDocker, color: "text-blue-500" },
      { value: SiKubernetes, color: "text-blue-600" },
      { value: SiFigma, color: "text-rose-500" },
      { value: SiLinux, color: "text-amber-550" }, // درجة أغمق قليلاً لتضح على الخلفيات الفاتحة
      { value: SiApple, color: "text-gray-900" },
      { value: SiPostgresql, color: "text-sky-600" },
      { value: SiMysql, color: "text-blue-400" },
    ],
  },
  nature: {
    name: "طبيعة و حيوانات 🌿",
    isIcon: false,
    items: [
      { value: "🌵" },
      { value: "🌸" },
      { value: "🌻" },
      { value: "🍄" },
      { value: "🦋" },
      { value: "🐝" },
      { value: "🐢" },
      { value: "🌊" },
      { value: "🌲" },
      { value: "🍂" },
      { value: "🌞" },
      { value: "🌙" },
    ],
  },

  // Add more categories here
};

export default function Home() {
  const [screen, setScreen] = useState<"menu" | "game" | "leaderboard">("menu");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState("");

  const [category, setCategory] = useState<keyof typeof CATEGORIES | string>(
    "programming",
  );
  const [difficulty, setDifficulty] = useState<string>("medium");

  const [cards, setCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(45);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [mismatchedCardIds, setMismatchedCardIds] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);

  const [leaders, setLeaders] = useState<Player[]>([]);
  const [leaderboardDifficulty, setLeaderboardDifficulty] = useState("medium");

  const timerIdRef = useRef<number | null>(null as unknown as number | null);

  const getInitialTime = () => {
    if (difficulty === "easy") return 30;
    if (difficulty === "hard") return 70;
    return 45;
  };

  const createCardsForGame = (cat: string, diff: string) => {
    let pairCount = 8;
    if (diff === "easy") pairCount = 6;
    if (diff === "hard") pairCount = 12;

    const items = CATEGORIES[cat]?.items || CATEGORIES.programming.items;
    const selected = items.slice(0, Math.min(pairCount, items.length));

    // attach a stable pairKey per original selected item, then create two copies per pair
    const withKeys = selected.map((v, idx) => ({ item: v, pairKey: idx }));
    const doubled = withKeys.flatMap((x) => [{ ...x }, { ...x }]);

    const shuffled = doubled
      .map((v) => ({ v, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((entry, idx) => {
        const v = entry.v.item as unknown;
        let val: unknown = v;
        let color: string | undefined = undefined;
        if (v && typeof v === "object") {
          const obj = v as Record<string, unknown>;
          if ("value" in obj) val = obj["value"];
          if ("color" in obj) color = obj["color"] as string | undefined;
        }
        return {
          id: idx,
          value: val,
          color,
          pairKey: (entry.v as unknown as { pairKey: number }).pairKey,
          isFlipped: false,
          isMatched: false,
        } as Card;
      });
    return shuffled as Card[];
  };

  const handleCheckUsername = async () => {
    if (!username) {
      setAuthError("ادخل اسم مستخدم صالح");
      return;
    }
    setAuthError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsNewUser(data.isNewUser ?? true);
        setAuthError("");
      } else {
        setAuthError(data.message || "خطأ في التحقق");
      }
    } catch (e) {
      console.error("check username failed", e);
      setAuthError("فشل الاتصال بالسيرفر. تأكد من تشغيل الباك‑إند.");
    }
  };

  const handleStartGame = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // login / register via backend, then start game
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.message || "فشل الدخول");
        return;
      }

      // store userId for later score saves
      if (data.userId) localStorage.setItem("userId", String(data.userId));
      localStorage.setItem("username", String(data.username ?? username));

      // start game
      const initial = createCardsForGame(category, difficulty);
      setCards(initial);
      setMoves(0);
      setTime(getInitialTime());
      setSelectedCards([]);
      setMismatchedCardIds([]);
      setIsGameOver(false);
      setIsGameLost(false);
      setScreen("game");
      setGameStarted(false);
      setAuthError("");
    } catch (err) {
      console.error(err);
      setAuthError("فشل الاتصال بالباك‑إند");
    }
  };

  const resetMenu = () => {
    setScreen("menu");
    setIsNewUser(null);
    setPin("");
    setAuthError("");
  };

  useEffect(() => {
    if (gameStarted && screen === "game" && !isGameOver && !isGameLost) {
      timerIdRef.current = window.setInterval(() => {
        setTime((prev) => {
          const nt = prev - 1;
          if (nt <= 0) {
            setIsGameLost(true);
            if (timerIdRef.current) {
              clearInterval(timerIdRef.current);
              timerIdRef.current = null;
            }
            return 0;
          }
          return nt;
        });
      }, 1000) as unknown as number;
    }
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [gameStarted, screen, isGameOver, isGameLost]);

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);
    const clicked = cards.find((c) => c.id === cardId);
    if (
      !clicked ||
      clicked.isFlipped ||
      clicked.isMatched ||
      selectedCards.length === 2
    )
      return;
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)),
    );
    const newSel = [...selectedCards, cardId];
    setSelectedCards(newSel);

    if (newSel.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSel;
      const ca = cards.find((c) => c.id === a);
      const cb = cards.find((c) => c.id === b);
      if (
        ca &&
        cb &&
        ca.pairKey !== undefined &&
        cb.pairKey !== undefined &&
        ca.pairKey === cb.pairKey
      ) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === b ? { ...c, isMatched: true } : c,
            ),
          );
          setSelectedCards([]);
          setMismatchedCardIds([]);
          const allMatched = cards.every((c) =>
            c.id === a || c.id === b ? true : c.isMatched,
          );
          if (allMatched) {
            setIsGameOver(true);
            if (timerIdRef.current) {
              clearInterval(timerIdRef.current);
              timerIdRef.current = null;
            }
          }
        }, 350);
      } else {
        setMismatchedCardIds([a, b]);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === a || c.id === b ? { ...c, isFlipped: false } : c,
            ),
          );
          setSelectedCards([]);
          setMismatchedCardIds([]);
        }, 900);
      }
    }
  };

  const handlePlayAgain = () => {
    const initial = createCardsForGame(category, difficulty);
    setCards(initial);
    setMoves(0);
    setTime(getInitialTime());
    setGameStarted(false);
    setSelectedCards([]);
    setMismatchedCardIds([]);
    setIsGameOver(false);
    setIsGameLost(false);
  };

  useEffect(() => {
    if (screen === "leaderboard") {
      (async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/api/leaderboard?difficulty=${leaderboardDifficulty}`,
          );
          if (res.ok) setLeaders(await res.json());
        } catch (e) {
          console.warn("leaderboard fetch failed", e);
        }
      })();
    }
  }, [screen, leaderboardDifficulty]);

  const saveGameScore = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const elapsedTime = Math.max(0, getInitialTime() - time);
      await fetch("http://localhost:5000/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          moves,
          timeInSeconds: elapsedTime,
          difficulty,
          category,
        }),
      });
    } catch (e) {
      console.warn("save score failed", e);
    }
  };

  const getGridCols = () => {
    if (difficulty === "easy") return "grid-cols-4";
    if (difficulty === "hard") return "grid-cols-4 sm:grid-cols-6";
    return "grid-cols-4";
  };

  return (
    <div
      className="flex flex-col flex-1 items-center justify-center min-h-screen bg-linear-to-b from-amber-50 to-orange-100 p-4 select-none text-right"
      dir="rtl"
    >
      <h1 className="text-3xl md:text-4xl  font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-orange-600 mb-8 drop-shadow">
        Memory Game Pro 🎮
      </h1>

      {screen === "menu" && (
        <MainMenu
          username={username}
          setUsername={setUsername}
          pin={pin}
          setPin={setPin}
          isNewUser={isNewUser}
          setIsNewUser={setIsNewUser}
          authError={authError}
          handleCheckUsername={handleCheckUsername}
          handleStartGame={handleStartGame}
          category={String(category)}
          setCategory={setCategory}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          categories={CATEGORIES}
          setScreen={setScreen}
        />
      )}

      {screen === "game" && (
        <div>
          <GameBoard
            username={username}
            time={time}
            moves={moves}
            resetMenu={resetMenu}
            cards={cards}
            handleCardClick={handleCardClick}
            mismatchedCardIds={mismatchedCardIds}
            getGridCols={getGridCols}
            categoryName={
              CATEGORIES[category as keyof typeof CATEGORIES]?.name ||
              "غير محدد"
            }
          />

          {isGameOver && (
            <WinModal
              username={username}
              time={time}
              moves={moves}
              difficulty={difficulty}
              onSave={saveGameScore}
              onPlayAgain={handlePlayAgain}
              onMenu={resetMenu}
            />
          )}
          {isGameLost && (
            <LoseModal
              username={username}
              moves={moves}
              difficulty={difficulty}
              onPlayAgain={handlePlayAgain}
              onMenu={resetMenu}
            />
          )}
        </div>
      )}

      {screen === "leaderboard" && (
        <LeaderBoard
          leaders={leaders}
          leaderboardDifficulty={leaderboardDifficulty}
          setLeaderboardDifficulty={setLeaderboardDifficulty}
          resetMenu={resetMenu}
        />
      )}
    </div>
  );
}
