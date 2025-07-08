import AnimalCard from "@/components/AnimalCard";
import MapCanvas from "@/components/MapCanvas";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGameStore } from "@/hooks/gameStore";
import { Button } from "@/components/UI/button";
import { getRandomAnimalCard } from "@/utils/animalUtils";
import type { Animal } from "@/types/game";
import CollapsibleAnimalCard from "@/components/AnimalCard";
import PlayerPanel from "@/components/PlayerPanel";
import GameControls from "@/components/GameControls";
import ScaleSelector from "@/components/ScaleSelector";
import { Crown, Users } from "lucide-react";

const GameArea = () => {
  // Get game state from store
  const { players, phase, round, currentPlayer, currentAnimal, startRound } =
    useGameStore();

  useEffect(() => {}, [players]);

  const handleGetAnimal = async () => {
    const randomAnimalCard = await getRandomAnimalCard();
    const animalData = randomAnimalCard.card as Animal;
    startRound(animalData);
  };

  // Get current player info for display
  const activePlayer = players[currentPlayer];

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Beautiful Nature Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/fauna-bg.jpg')",
          filter: "brightness(0.7) blur(0.5px)",
        }}
      />

      {/* Warm Nature Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-amber-800/30 to-green-900/50" />

      {/* Main Game Interface */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Enhanced Nature-Themed Header */}
        <div className="backdrop-blur-lg bg-emerald-900/20 border-b border-emerald-300/30 shadow-xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-pulse">🦁</span>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-200 via-amber-200 to-green-300 bg-clip-text text-transparent font-serif tracking-wide">
                  Fauna
                </h1>
                <span className="text-3xl animate-pulse delay-500">🌍</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-100 bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <span className="text-lg">🎯</span>
                <span className="font-semibold">Round {round}</span>
                {phase === "placement" && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-white animate-pulse"
                        style={{ backgroundColor: activePlayer?.color }}
                      />
                      <span className="font-medium text-amber-200">
                        {activePlayer?.name}'s Turn
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGetAnimal}
                className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-amber-100 border-emerald-400 font-semibold shadow-lg backdrop-blur-sm"
              >
                🎴 Get Animal
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Animal Discovery Panel */}
          <div className="w-100 backdrop-blur-lg bg-emerald-900/25 border-r border-emerald-300/30 p-6 space-y-6 overflow-y-auto shadow-2xl">
            {/* Current Animal Card */}
            {currentAnimal && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="bg-amber-50/10 backdrop-blur-sm rounded-xl p-4 border border-amber-200/30 shadow-lg">
                  <div className="text-center mb-3">
                    <h3 className="text-lg font-bold text-amber-200 flex items-center justify-center gap-2">
                      <span>🔍</span>
                      Mystery Creature
                    </h3>
                  </div>
                  <CollapsibleAnimalCard
                    animal={currentAnimal}
                    className="w-full h-auto overflow-y-auto"
                    showLowerHalf={false}
                  />
                </div>
                <div className="bg-green-50/10 backdrop-blur-sm rounded-xl p-4 border border-green-200/30 shadow-lg">
                  
                  <ScaleSelector />
                </div>
              </motion.div>
            )}

            
          </div>

          {/* Main Game Area - World Exploration */}
          <div className="flex-1 p-8">
            <div className="h-full bg-black/20 backdrop-blur-sm rounded-2xl border border-emerald-300/20 shadow-2xl p-4">
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-emerald-200 flex items-center justify-center gap-3">
                  <span>🗺️</span>
                  Wildlife Habitat Explorer
                  <span>🌍</span>
                </h2>
              </div>
              <MapCanvas />
            </div>
          </div>

          {/* Right Sidebar - Expedition Team */}
          <div className="w-80 backdrop-blur-lg bg-emerald-900/25 border-l border-emerald-300/30 p-6 space-y-6 overflow-y-auto shadow-2xl">
            {/* Player Scores */}
            <div className="bg-purple-50/10 backdrop-blur-sm rounded-xl p-4 border border-purple-200/30 shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-300" />
                <h3 className="font-semibold text-purple-200">Wildlife Explorers</h3>
              </div>

              <div className="space-y-3">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      index === currentPlayer
                        ? "bg-emerald-500/20 border-emerald-300 shadow-lg transform scale-105"
                        : "bg-white/5 border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: player.color }}
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm">{player.name}</h4>
                        {index === currentPlayer && (
                          <div className="text-emerald-300 text-xs flex items-center gap-1">
                            <span>⭐</span>
                            <span>Active Explorer</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Player Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-black/30 rounded p-2">
                        <div className="text-emerald-300 font-bold">
                          {player.score}
                        </div>
                        <div className="text-emerald-200/70">Points</div>
                      </div>
                      <div className="bg-black/30 rounded p-2">
                        <div className="text-amber-300 font-bold">
                          {player.guessPieces}
                        </div>
                        <div className="text-amber-200/70">Pieces</div>
                      </div>
                      <div className="bg-black/30 rounded p-2">
                        <div className="text-red-300 font-bold">
                          {player.stockPieces}
                        </div>
                        <div className="text-red-200/70">Stock</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Controls */}
            <div className="bg-orange-50/10 backdrop-blur-sm rounded-xl p-4 border border-orange-200/30 shadow-lg">
              <h3 className="font-semibold text-orange-200 mb-3 flex items-center gap-2">
                <span>⚙️</span>
                Expedition Control
              </h3>
              <GameControls />
            </div>

            
          </div>
        </div>

        {/* Game Phase Overlays - Magical Nature Transitions */}
        <AnimatePresence>
          {phase === 'nextRound' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-8 z-50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-gradient-to-br from-emerald-900/90 to-green-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full text-center space-y-6 border border-emerald-300/30"
              >
                <div className="space-y-3">
                  <motion.span 
                    className="text-7xl block"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🏆
                  </motion.span>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-200 to-amber-200 bg-clip-text text-transparent">
                    Round Complete!
                  </h2>
                  <p className="text-emerald-200/80">The wildlife expedition continues...</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-200">Explorer Standings</h3>
                  {[...players]
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                      <motion.div 
                        key={player.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center bg-black/30 rounded-lg p-3 border border-emerald-300/20"
                      >
                        <div className="flex items-center gap-3">
                          {index === 0 && <Crown className="w-5 h-5 text-yellow-400" />}
                          <div
                            className="w-4 h-4 rounded-full border border-white"
                            style={{ backgroundColor: player.color }}
                          />
                          <span className="text-white font-medium">{player.name}</span>
                        </div>
                        <span className="font-bold text-emerald-300 text-lg">{player.score}</span>
                      </motion.div>
                    ))}
                </div>
                
                <Button 
                  onClick={() => handleGetAnimal()} 
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-semibold py-3 rounded-xl shadow-lg"
                >
                  🎴 Next Adventure
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameArea;
