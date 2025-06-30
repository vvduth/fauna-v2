import AnimalCard from "@/components/AnimalCard";
import MapCanvas from "@/components/MapCanvas";
import { useGameLogic } from "@/hooks/useGameLogic";
import React, { useEffect } from "react";
import { useGameStore } from "@/hooks/gameStore";
import { Button } from "@/components/UI/button";
import { getRandomAnimalCard } from "@/utils/animalUtils";
import type { Animal } from "@/types/game";
import CollapsibleAnimalCard from "@/components/AnimalCard";
import PlayerPanel from "@/components/PlayerPanel";
import GameControls from "@/components/GameControls";
import ScaleSelector from "@/components/ScaleSelector";

const GameArea = () => {
  // Get game state from store
  const { players, phase, round, currentPlayer, currentAnimal,
    startRound
   } = useGameStore();
  
  useEffect(() => { 
    console.log("GameArea mounted with players:", players);
  }, [players]);

  const handleGetAnimal =async () => {
    const randomAnimalCard = await getRandomAnimalCard();
    const animalData = randomAnimalCard.card as Animal;
    startRound(animalData);
    
  }
  

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
              <div className="h-6 w-px bg-emerald-300/50"></div>
              <Button variant={"outline"}
              className="bg-gradient-to-r from-emerald-600 to-sky-700 text-amber-400"
              onClick={handleGetAnimal}
              >
                <span>Get Animal</span>
              </Button>
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
                  <>
                    <CollapsibleAnimalCard 
                      animal={currentAnimal}
                      className="w-full h-auto  overflow-y-auto"
                      showLowerHalf={false}
                    />
                  </>
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
            <PlayerPanel/>

            {/* Game Control Section */}
            <GameControls />
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
          <ScaleSelector
            
          />
          
        </div>
      </div>
    </div>
  );
};

export default GameArea;