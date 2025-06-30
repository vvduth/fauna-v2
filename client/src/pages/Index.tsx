import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Separator } from "@/components/UI/separator";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/hooks/gameStore";


const Index = () => {
  const navigate = useNavigate();
  const { players ,resetGame,updatePlayerName , addPlayer } = useGameStore();
  
  
  // Handle starting the game - navigates to game page
  const handleStartGame = () => {
    // Initialize game with current player count
    navigate("/game");
  };

  // Create a new game setup - resets to 2 players
  const handleNewGame = () => {
    resetGame(2);
  };

  // Update individual player name in the game store
  const handlePlayerNameChange = (index: number, name: string) => {
    // Get the actual player ID from the players array
  const playerId = players[index].id;
  updatePlayerName(playerId, name);
  console.log(`Update player ${index} (${playerId}) to ${name}`);
  };

  

  // Add a new player to the game (max 6 players)
  const handleAddPlayer = () => {
    addPlayer("new adventurer")
  };

  // Remove a player from the game (min 2 players)
  const removePlayer = (index: number) => {
    if (players.length > 2) {
      resetGame(players.length - 1);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/fauna-bg.jpg')",
          filter: "brightness(0.7) blur(1px)"
        }}
      />
      
      {/* Gradient Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-amber-900/30 to-green-800/50" />
      
      {/* Animated Nature Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Leaves Animation */}
        <div className="absolute top-20 left-10 animate-bounce delay-1000">
          <span className="text-4xl opacity-60">🍃</span>
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-2000">
          <span className="text-3xl opacity-50">🦋</span>
        </div>
        <div className="absolute bottom-32 left-1/4 animate-bounce delay-3000">
          <span className="text-2xl opacity-40">🌿</span>
        </div>
        <div className="absolute top-60 right-1/3 animate-pulse delay-1500">
          <span className="text-3xl opacity-30">🦅</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full">
          {/* Main Game Card with Glassmorphism Effect */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl transform transition-all duration-700 hover:shadow-3xl hover:-translate-y-3 hover:bg-white/15">
            <CardHeader className="text-center pb-6">
              {/* Game Title with Nature-Inspired Typography */}
              <div className="mb-4">
                <CardTitle className="text-6xl font-bold bg-gradient-to-r from-emerald-200 via-green-300 to-amber-200 bg-clip-text text-transparent mb-3 animate-fade-in font-serif tracking-wide">
                  🦁 Fauna 🐾
                </CardTitle>
                <div className="h-1 w-32 bg-gradient-to-r from-emerald-400 to-amber-400 mx-auto rounded-full animate-fade-in opacity-80" />
              </div>
              
              <p className="text-xl text-emerald-100 animate-fade-in font-medium tracking-wide">
                The Ultimate Animal Knowledge Adventure
              </p>
              <p className="text-sm text-emerald-200/80 mt-2 animate-fade-in delay-300">
                Explore the wild kingdom and test your animal expertise!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8 px-8 pb-8">
              {/* Player Setup Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">👥</span>
                  <h3 className="text-2xl font-bold text-white">
                    Wildlife Explorers 
                    <span className="text-emerald-300 ml-2">({players.length}/6)</span>
                  </h3>
                </div>
                
                {/* Player Input List */}
                <div className="space-y-4">
                  {players.map(({ name, color }, index) => (
                    <div 
                      key={index} 
                      className="flex gap-3 animate-fade-in group" 
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      {/* Player Color Indicator */}
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white/50 flex-shrink-0 mt-3 shadow-lg group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: color }}
                      />
                      
                      {/* Player Name Input */}
                      <Input
                        value={name}
                        onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                        placeholder={`Explorer ${index + 1}`}
                        className="flex-1 bg-white/10 border-white/30 text-white placeholder-emerald-200/60 backdrop-blur-sm 
                                 focus:bg-white/20 focus:border-emerald-300 focus:scale-105 transition-all duration-300 
                                 hover:bg-white/15 text-lg font-medium shadow-lg"
                      />
                      
                      {/* Remove Player Button */}
                      {players.length > 2 && (
                        <Button 
                          variant="outline" 
                          onClick={() => removePlayer(index)}
                          className="px-4 bg-red-500/20 border-red-400/50 text-red-200 hover:bg-red-500/30 
                                   hover:border-red-300 hover:scale-110 transition-all duration-300 shadow-lg"
                        >
                          ❌
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 flex-wrap justify-center">
                  {/* Add Player Button */}
                  {players.length < 6 && (
                    <Button 
                      variant="outline" 
                      onClick={handleAddPlayer}
                      className="bg-emerald-600/20 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/30 
                               hover:border-emerald-300 transition-all duration-300 hover:scale-110 shadow-lg font-medium px-6 py-3"
                    >
                      ➕ Add Explorer
                    </Button>
                  )}
                  
                  {/* New Game Button */}
                  <Button 
                    variant="outline"
                    onClick={handleNewGame}
                    className="bg-amber-600/20 border-amber-400/50 text-amber-200 hover:bg-amber-500/30 
                             hover:border-amber-300 transition-all duration-300 hover:scale-110 shadow-lg font-medium px-6 py-3"
                  >
                    🔄 New Setup
                  </Button>
                  
                  {/* Start Game Button - Primary CTA */}
                  <Button 
                    onClick={handleStartGame} 
                    className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 
                             text-white font-bold px-8 py-3 text-lg shadow-xl transform transition-all duration-300 
                             hover:scale-110 hover:shadow-2xl border-0 tracking-wide"
                  >
                    🎯 Begin Adventure!
                  </Button>
                </div>
              </div>

              {/* Elegant Separator */}
              <div className="relative my-8">
                <Separator className="bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
                <div className="absolute inset-0 flex justify-center">
                  <span className="bg-gradient-to-r from-emerald-900/80 to-green-900/80 px-4 text-emerald-300 text-sm font-medium">
                    🌍 Game Rules 🌍
                  </span>
                </div>
              </div>

              {/* How to Play Section - Enhanced */}
              <div className="text-emerald-100 space-y-4 animate-fade-in bg-black/20 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                <h4 className="font-bold text-xl text-emerald-200 flex items-center gap-2 mb-4">
                  <span>📚</span> How to Become a Wildlife Expert:
                </h4>
                
                <div className="grid gap-3 text-sm leading-relaxed">
                  <div className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300">
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">🗺️</span>
                    <span>Guess where each amazing animal lives in the wild</span>
                  </div>
                  
                  <div className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300">
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">📏</span>
                    <span>Estimate their size, weight, and measurements</span>
                  </div>
                  
                  <div className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300">
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">🎯</span>
                    <span>Place guess pieces on the world map and scales</span>
                  </div>
                  
                  <div className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300">
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">🏆</span>
                    <span>Score points for correct and close guesses</span>
                  </div>
                  
                  <div className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300">
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">👑</span>
                    <span>First to reach the victory threshold becomes the ultimate naturalist!</span>
                  </div>
                </div>
                
                {/* Victory Point Goals */}
                <div className="mt-6 pt-4 border-t border-emerald-400/20">
                  <h5 className="font-semibold text-emerald-200 mb-2 flex items-center gap-2">
                    <span>🎯</span> Victory Goals:
                  </h5>
                  <div className="text-xs space-y-1 text-emerald-200/80">
                    <div>🥇 2-3 Explorers: 120 points to win</div>
                    <div>🥈 4-5 Explorers: 100 points to win</div>
                    <div>🥉 6 Explorers: 80 points to win</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Footer Credits */}
          <div className="text-center mt-6 text-emerald-200/60 text-sm animate-fade-in delay-1000">
            <p>🌿 Inspired by the beloved Fauna board game 🌿</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;