import React from "react";

type Card = {
  id: number;
  value: unknown;
  color?: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type Props = {
  username: string;
  time: number;
  moves: number;
  resetMenu: () => void;
  cards: Card[];
  handleCardClick: (id: number) => void;
  mismatchedCardIds: number[];
  getGridCols: () => string;
  categoryName: string;
};

export default function GameBoard({
  username,
  time,
  moves,
  resetMenu,
  cards,
  handleCardClick,
  mismatchedCardIds,
  getGridCols,
  categoryName,
}: Props) {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="mb-4 text-center bg-linear-to-r from-amber-500 to-orange-500 text-white px-5 py-1.5 rounded-full font-bold text-sm shadow-sm flex gap-2 items-center">
        <span>المحارب: {username} 👤</span>
        <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
          ثيم: {categoryName}
        </span>
      </div>

      <div className="flex items-center gap-6 mb-6 bg-white px-6 py-3 rounded-xl shadow-md border border-amber-100">
        <div className="text-slate-700">
          الوقت: <span className="font-bold text-amber-600">{time}</span> ثانية
        </div>
        <div className="text-slate-700">
          المحاولات: <span className="font-bold text-amber-600">{moves}</span>
        </div>
        <button
          onClick={resetMenu}
          className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium px-3 py-1 rounded-md text-sm transition-all"
        >
          انسحاب 🏳️
        </button>
      </div>

      <div
        className={`grid ${getGridCols()} gap-3 sm:gap-4 bg-white p-6 rounded-2xl shadow-xl border border-amber-100 max-w-full justify-center justify-items-center`}
      >
        {cards.map((card) => {
          const isMismatched = mismatchedCardIds.includes(card.id);
          const isMatchedCard = card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`w-14 h-18 sm:w-20 sm:h-24 flex items-center justify-center text-2xl rounded-xl font-bold border transition-all duration-300 transform ${
                card.isFlipped || card.isMatched
                  ? isMatchedCard
                    ? "bg-green-200 border-green-400 text-slate-800 shadow-inner"
                    : isMismatched
                      ? "bg-red-200 border-red-400 text-slate-800 shadow-inner"
                      : "bg-amber-50 border-amber-400 text-slate-800 shadow-inner"
                  : "bg-linear-to-br from-amber-500 to-orange-500 text-white border-transparent text-xl shadow active:scale-95 hover:brightness-105"
              } ${isMismatched ? "shake-animation" : ""}`}
            >
              {card.isFlipped || card.isMatched
                ? (() => {
                    const val = card.value as unknown;
                    if (typeof val === "function") {
                      const Icon = val as unknown as React.ComponentType<{
                        className?: string;
                      }>;
                      return (
                        <Icon
                          className={`w-8 h-8 sm:w-12 sm:h-12 ${card.color || "text-slate-700"} animate-scale-up`}
                        />
                      );
                    }
                    return String(val);
                  })()
                : "❓"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
