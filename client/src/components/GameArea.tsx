import AnimalCard from "@/components/AnimalCard";
import MapCanvas from "@/components/MapCanvas";
import { useGameLogic } from "@/hooks/useGameLogic";
import React, { useEffect } from "react";

const GameArea = () => {
  const { gameState } = useGameLogic();

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Fauna - Round 1
          </h1>
          <p className="text-gray-600">
            Phase: <span className="font-semibold capitalize">1</span>
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            {/* animalcard */}
            {gameState.currentAnimal && (
              <AnimalCard
                animal={gameState.currentAnimal}
                showLowerHalf={gameState.showCardLowerHalf}
              />
            )}
            {/* player panel */}
            {/* game control */}
          </div>
          <div className="col-span-3">
            <MapCanvas />
          </div>

          {/* Right Column - Scales */}
          <div className="space-y-4 ">
            <h3 className="text-xl font-bold text-center text-gray-800">
              Measurement Scales
            </h3>
            {/* scale */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameArea;
