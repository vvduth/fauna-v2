import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { players_dummy } from "@/placeholder/dummy";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Separator } from "@/components/UI/separator";
import { useGameLogic } from "@/hooks/useGameLogic";
import { SCALE_RANGES } from "@/constants/worldRegions";
import MapCanvas from "@/components/MapCanvas";
import GameArea from "@/components/GameArea";
import PlayerPanel from "@/components/PlayerPanel";
import GameControls from "@/components/GameControls";
import ScaleSelector from "@/components/ScaleSelector";
import CollapsibleAnimalCard from "@/components/AnimalCard";
const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2"]);
  const {
    gameState,
    initializeGame,
    placeGuess,
    passPlacement,
    evaluateRound,
    nextRound,
    toggleCardHalf,
  } = useGameLogic();

  const handleStartGame = () => {
    initializeGame(playerNames.filter((name) => name.trim() !== ""));
    setGameStarted(true);
  };

  const handleNewGame = () => {
    setGameStarted(false);
    setPlayerNames(["Player 1", "Player 2"]);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const addPlayer = () => {
    if (playerNames.length < 6) {
      setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const handleAreaClick = (area: string) => {
    if (gameState.phase === "placement") {
      placeGuess("area", area);
    }
  };

  const handleScaleClick = (
    scaleType: keyof typeof SCALE_RANGES,
    position: string
  ) => {
    if (gameState.phase === "placement") {
      placeGuess("scale", position, scaleType);
    }
  };

  const getRelevantScales = () => {
    if (!gameState.currentAnimal) return [];
    return Object.keys(gameState.currentAnimal.measurements) as Array<
      keyof typeof SCALE_RANGES
    >;
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-8 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-bold text-green-800 mb-2 animate-fade-in">Fauna</CardTitle>
              <p className="text-lg text-gray-600 animate-fade-in">The Animal Knowledge Board Game</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Players (2-6)</h3>
                <div className="space-y-3">
                  {playerNames.map((name, index) => (
                    <div key={index} className="flex gap-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <Input
                        value={name}
                        onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                        placeholder={`Player ${index + 1}`}
                        className="flex-1 transition-all duration-300 focus:scale-105"
                      />
                      {playerNames.length > 2 && (
                        <Button 
                          variant="outline" 
                          onClick={() => removePlayer(index)}
                          className="px-3 transition-all duration-300 hover:scale-110"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-4">
                  {playerNames.length < 6 && (
                    <Button 
                      variant="outline" 
                      onClick={addPlayer}
                      className="transition-all duration-300 hover:scale-105"
                    >
                      Add Player
                    </Button>
                  )}
                  <Button 
                    onClick={handleStartGame} 
                    className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Start Game
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="text-sm text-gray-600 space-y-2 animate-fade-in">
                <h4 className="font-semibold">How to Play:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Each round, guess where an animal lives and its measurements</li>
                  <li>Place guess pieces on the world map or measurement scales</li>
                  <li>Score points for correct and adjacent guesses</li>
                  <li>First to reach the victory threshold wins!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState.gameEnded && gameState.winner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-8 flex items-center justify-center animate-fade-in">
        <Card className="shadow-xl max-w-lg transform transition-all duration-500 hover:shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-green-800 animate-bounce">Game Over!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {gameState.winner.length === 1 ? 'Winner:' : 'Winners:'}
              </h3>
              {gameState.winner.map((winner, index) => (
                <div key={winner.id} className="text-lg font-bold animate-fade-in" style={{ color: winner.color, animationDelay: `${index * 200}ms` }}>
                  {winner.name} - {winner.score} points
                </div>
              ))}
            </div>
            <Button 
              onClick={handleNewGame} 
              className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105"
            >
              New Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-4 animate-fade-in">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Fauna - Round {gameState.round}</h1>
          <p className="text-gray-600">
            Phase: <span className="font-semibold capitalize">{gameState.phase}</span>
          </p>
        </div>

        {/* Top Row - Animal Card and Player Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            {gameState.currentAnimal && (
              <CollapsibleAnimalCard 
                animal={gameState.currentAnimal}
                showLowerHalf={gameState.showCardLowerHalf}
                className="animate-fade-in"
              />
            )}
          </div>
          
          <div className="lg:col-span-2">
            <PlayerPanel 
              players={gameState.players}
              currentPlayer={gameState.currentPlayer}
              startingPlayer={gameState.startingPlayer}
              className="animate-fade-in"
            />
          </div>

          <div className="lg:col-span-1">
            <GameControls
              phase={gameState.phase}
              onPass={passPlacement}
              onEvaluate={evaluateRound}
              onNextRound={nextRound}
              onNewGame={handleNewGame}
              showCardLowerHalf={gameState.showCardLowerHalf}
              onToggleCardHalf={toggleCardHalf}
              canPass={true}
              className="animate-fade-in"
            />
          </div>
        </div>

        {/* Main Game Area - World Map */}
        <div className="animate-fade-in">
          <MapCanvas />
        </div>

        {/* Bottom Row - Measurement Scales */}
        <div className="animate-fade-in">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Measurement Scales</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(SCALE_RANGES).map((scaleType, index) => (
              <ScaleSelector
                key={scaleType}
                scaleType={scaleType as keyof typeof SCALE_RANGES}
                placements={gameState.placements}
                onScaleClick={handleScaleClick}
                isRelevant={getRelevantScales().includes(scaleType as keyof typeof SCALE_RANGES)}
                className="animate-fade-in"
                //style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Index;
