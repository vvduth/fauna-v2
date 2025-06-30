import React from "react";
import { type Player } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "./UI/card";
import { Crown } from "lucide-react";
import { useGameStore } from "@/hooks/gameStore";

const PlayerPanel = () => {
  const { players, currentPlayer } = useGameStore();
  return (
    <>
      
      <div className="lg:col-span-2 animate-fade-in delay-200">
              <div className="backdrop-blur-lg bg-white/10 border-white/20 rounded-2xl p-6 shadow-2xl border">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-emerald-200 flex items-center justify-center gap-2">
                    <span>👥</span>
                    Wildlife Explorers
                  </h3>
                </div>
                
                {/* Players Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {players.map((player, index) => (
        <div
          key={player.id}
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            index === currentPlayer
              ? "bg-white/20 border-emerald-300 shadow-lg transform scale-105"
              : "bg-white/5 border-white/20 hover:bg-white/10"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full border-2 border-white/50 shadow-lg"
              style={{ backgroundColor: player.color }}
            />
            <div>
              <h4 className="font-bold text-white text-lg">{player.name}</h4>
              {index === currentPlayer && (
                <div className="text-emerald-300 text-sm flex items-center gap-1">
                  <span>⭐</span>
                  <span>Active Explorer</span>
                </div>
              )}
            </div>
          </div>

          {/* Player Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-emerald-300 font-bold text-lg">
                {player.score}
              </div>
              <div className="text-emerald-200/70">Points</div>
            </div>
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-amber-300 font-bold text-lg">
                {player.guessPieces}
              </div>
              <div className="text-amber-200/70">Pieces</div>
            </div>
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-red-300 font-bold text-lg">
                {player.stockPieces}
              </div>
              <div className="text-red-200/70">Stock</div>
            </div>
          </div>
        </div>
      ))}
                </div>
              </div>
            </div>
    </>
  );
};

export default PlayerPanel;
