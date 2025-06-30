import AnimalCard from "@/components/AnimalCard";
import MapCanvas from "@/components/MapCanvas";
import { useGameLogic } from "@/hooks/useGameLogic";
import React, { useEffect } from "react";
import { useGameStore } from "@/hooks/gameStore";

const GameArea = () => {
  // Get game state from store
  const { players, phase, round, currentPlayer, currentAnimal } = useGameStore();
  
  useEffect(() => { 
    console.log("GameArea mounted with players:", players);
  }, [players]);

  // Get current player info for display
  const activePlayer = players[currentPlayer];
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Nature Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/fauna-bg.jpg')",
          filter: "brightness(0.8) blur(0.5px)"
        }}
      />
      
      {/* Gradient Overlay for Better Content Visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-amber-900/20 to-green-800/40" />
      
      {/* Floating Nature Elements for Ambiance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-20 animate-pulse delay-1000">
          <span className="text-2xl opacity-40">🌺</span>
        </div>
        <div className="absolute top-32 right-16 animate-bounce delay-2000">
          <span className="text-xl opacity-30">🦋</span>
        </div>
        <div className="absolute bottom-40 left-1/3 animate-pulse delay-3000">
          <span className="text-lg opacity-25">🍀</span>
        </div>
        <div className="absolute top-1/2 right-20 animate-bounce delay-1500">
          <span className="text-xl opacity-35">🐝</span>
        </div>
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen p-4 animate-fade-in">
        <div className="max-w-[1800px] mx-auto space-y-6">
          
          {/* Enhanced Header with Nature Theme */}
          <div className="text-center animate-fade-in backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="text-4xl animate-bounce">🦁</span>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-200 via-green-300 to-amber-200 bg-clip-text text-transparent font-serif">
                Fauna Expedition
              </h1>
              <span className="text-4xl animate-bounce delay-500">🌍</span>
            </div>
            
            {/* Game Status Bar */}
            <div className="flex justify-center items-center gap-8 text-emerald-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span className="font-semibold">Round {round}</span>
              </div>
              
              <div className="h-6 w-px bg-emerald-300/50"></div>
              
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <span className="font-semibold capitalize">{phase} Phase</span>
              </div>
              
              <div className="h-6 w-px bg-emerald-300/50"></div>
              
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white animate-pulse"
                  style={{ backgroundColor: activePlayer?.color }}
                />
                <span className="font-semibold">{activePlayer?.name}'s Turn</span>
              </div>
            </div>
          </div>

          {/* Top Row - Animal Card, Player Panel, and Game Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Current Animal Card Section */}
            <div className="lg:col-span-1 animate-fade-in">
              <div className="backdrop-blur-lg bg-white/10 border-white/20 rounded-2xl p-6 shadow-2xl border">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-emerald-200 flex items-center justify-center gap-2">
                    <span>🔍</span>
                    Mystery Animal
                  </h3>
                </div>
                
                {currentAnimal ? (
                  <AnimalCard />
                ) : (
                  <div className="text-center py-8 text-emerald-200/70">
                    <div className="text-6xl mb-4 animate-pulse">🎴</div>
                    <p className="text-sm">
                      Waiting for animal card...
                    </p>
                    <p className="text-xs mt-2 opacity-70">
                      The expedition begins soon!
                    </p>
                  </div>
                )}
              </div>
            </div>
          
            {/* Player Panel Section */}
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
                          ? 'bg-white/20 border-emerald-300 shadow-lg transform scale-105' 
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
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
                          <div className="text-emerald-300 font-bold text-lg">{player.score}</div>
                          <div className="text-emerald-200/70">Points</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-2">
                          <div className="text-amber-300 font-bold text-lg">{player.guessPieces}</div>
                          <div className="text-amber-200/70">Pieces</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-2">
                          <div className="text-red-300 font-bold text-lg">{player.stockPieces}</div>
                          <div className="text-red-200/70">Stock</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Control Section */}
            <div className="lg:col-span-1 animate-fade-in delay-400">
              <div className="backdrop-blur-lg bg-white/10 border-white/20 rounded-2xl p-6 shadow-2xl border">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-emerald-200 flex items-center justify-center gap-2">
                    <span>🎮</span>
                    Game Control
                  </h3>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-4">
                  <button className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                    🎴 Draw Animal Card
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                    ⚡ Start Evaluation
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                    ⏭️ Next Round
                  </button>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-6 p-4 bg-black/20 rounded-xl">
                  <h4 className="text-emerald-200 font-semibold mb-2 text-center">🏆 Victory Goals</h4>
                  <div className="text-emerald-100 text-xs space-y-1">
                    <div>🥇 2-3 Players: 120 points</div>
                    <div>🥈 4-5 Players: 100 points</div>
                    <div>🥉 6 Players: 80 points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Game Area - World Map */}
          <div className="animate-fade-in delay-600">
            <div className="backdrop-blur-lg bg-white/10 border-white/20 rounded-2xl p-6 shadow-2xl border">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-emerald-200 flex items-center justify-center gap-3">
                  <span>🗺️</span>
                  World Habitat Map
                  <span>🌍</span>
                </h3>
                <p className="text-emerald-200/70 mt-2">Place your guess pieces on the regions where you think the animal lives</p>
              </div>
              
              {/* Map Container with Enhanced Styling */}
              <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                <MapCanvas />
              </div>
            </div>
          </div>

          {/* Bottom Row - Measurement Scales */}
          <div className="animate-fade-in delay-800">
            <div className="backdrop-blur-lg bg-white/10 border-white/20 rounded-2xl p-6 shadow-2xl border">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-emerald-200 flex items-center justify-center gap-3">
                  <span>📏</span>
                  Measurement Scales
                  <span>⚖️</span>
                </h3>
                <p className="text-emerald-200/70 mt-2">Estimate the animal's physical characteristics</p>
              </div>
              
              {/* Scales Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Placeholder for scale components */}
                {['Weight', 'Length', 'Height', 'Tail Length'].map((scale, index) => (
                  <div 
                    key={scale}
                    className="bg-black/20 rounded-xl p-4 border border-white/10 hover:bg-white/5 transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">
                        {index === 0 ? '⚖️' : index === 1 ? '📏' : index === 2 ? '📐' : '🦘'}
                      </div>
                      <h4 className="text-emerald-200 font-semibold mb-2">{scale}</h4>
                      <div className="text-emerald-200/50 text-sm">Scale component here</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default GameArea;