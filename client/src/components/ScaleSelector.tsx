import React from 'react';
import { SCALE_RANGES } from '@/constants/worldRegions';
import { useGameStore } from '@/hooks/gameStore';
import type { GuessPlacement } from '@/types/game';

// Props interface for ScaleSelector component
interface ScaleSelectorProps {
  className?: string;
}

// Functional ScaleSelector component connected to game store
const ScaleSelector: React.FC<ScaleSelectorProps> = ({ className = '' }) => {
  // Get game state and actions from the store
  const { placements, placeGuess, currentPlayer, players, phase } = useGameStore();

  // Enhanced scale labels with emojis and better descriptions
  const scaleLabels: Record<keyof typeof SCALE_RANGES, { title: string; emoji: string; description: string }> = {
    weight: { 
      title: 'WEIGHT SCALE', 
      emoji: '⚖️', 
      description: 'How heavy is this creature?' 
    },
    length: { 
      title: 'BODY LENGTH', 
      emoji: '📏', 
      description: 'From nose to body end (no tail)' 
    },
    height: { 
      title: 'HEIGHT SCALE', 
      emoji: '📐', 
      description: 'How tall does it stand?' 
    },
    tailLength: { 
      title: 'TAIL LENGTH', 
      emoji: '🦘', 
      description: 'Just the tail measurement' 
    }
  };

  // Enhanced unit system with proper measurement labels
  const getScaleUnits = (scaleType: keyof typeof SCALE_RANGES) => {
    switch (scaleType) {
      case 'weight':
        return ['🪶 Light', '🏋️ Heavy'];
      case 'length':
        return ['📏 Short', '📏 Long'];
      case 'height':
        return ['⬇️ Low', '⬆️ Tall'];
      case 'tailLength':
        return ['🔸 Tiny', '🔸 Long'];
      default:
        return ['', ''];
    }
  };

  // Get current player info for UI feedback
  const currentPlayerData = players[currentPlayer];
  const currentPlayerPlacements = placements.filter(
    (p) => p.playerId === currentPlayer.toString()
  );
  const canPlaceGuess = phase === 'placement' && currentPlayerData?.guessPieces > 0;
  
  // Check placement status for one-piece-per-turn rule
  const placementCount = currentPlayerPlacements.length;
  const hasExactlyOnePiece = placementCount === 1;
  const hasNoPieces = placementCount === 0;

  // Handle scale click with proper game store integration
  const handleScaleClick = (scaleType: keyof typeof SCALE_RANGES, range: string) => {
    if (!canPlaceGuess) {
      console.warn('Cannot place guess: wrong phase or no pieces left');
      return;
    }

    console.log(`${currentPlayerData.name} placing guess on ${scaleType} scale at ${range}`);
    placeGuess('scale', range, scaleType);
  };

  // Check if a scale range has a placement
  const hasPlacement = (scaleType: keyof typeof SCALE_RANGES, range: string): GuessPlacement | undefined => {
    return placements.find(p => 
      p.location === range && 
      p.type === 'scale' && 
      p.scaleType === scaleType
    );
  };

  // Get player color for placement indicators
  const getPlayerColor = (playerId: string): string => {
    const playerIndex = parseInt(playerId) || 0;
    const playerColors = [
      'bg-gradient-to-br from-red-500 to-red-600 shadow-red-400/50', // Player 1: Red
      'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-400/50', // Player 2: Blue
      'bg-gradient-to-br from-green-500 to-green-600 shadow-green-400/50', // Player 3: Green
      'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-yellow-400/50', // Player 4: Yellow
      'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-400/50', // Player 5: Purple
      'bg-gradient-to-br from-pink-500 to-pink-600 shadow-pink-400/50' // Player 6: Pink
    ];
    return playerColors[playerIndex] || 'bg-gradient-to-br from-gray-500 to-gray-600 shadow-gray-400/50';
  };

  return (
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
        
        {/* Scales Grid with Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Render each scale type using SCALE_RANGES constant */}
          {Object.entries(SCALE_RANGES).map(([scaleTypeKey, ranges], scaleIndex) => {
            const scaleType = scaleTypeKey as keyof typeof SCALE_RANGES;
            const scaleInfo = scaleLabels[scaleType];
            const units = getScaleUnits(scaleType);
            
            return (
              <div 
                key={scaleType}
                className="transform transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${scaleIndex * 150}ms` }}
              >
                {/* Scale Header with Nature Theme */}
                <div className="bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-700 text-white px-4 py-3 text-center rounded-t-xl border-b-2 border-emerald-500 shadow-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-xl">{scaleInfo.emoji}</span>
                    <h4 className="font-bold text-sm tracking-wide">{scaleInfo.title}</h4>
                  </div>
                  <p className="text-xs text-emerald-100 opacity-90">{scaleInfo.description}</p>
                  
                  {/* Game state indicator */}
                  {!canPlaceGuess && (
                    <div className="text-xs mt-1 text-yellow-200 flex items-center justify-center gap-1">
                      <span>⚠️</span>
                      <span>{phase !== 'placement' ? 'Evaluation phase' : 'No pieces left'}</span>
                    </div>
                  )}
                  
                  {/* One piece per turn indicator */}
                  {canPlaceGuess && hasExactlyOnePiece && (
                    <div className="text-xs mt-1 text-green-200 flex items-center justify-center gap-1">
                      <span>✅</span>
                      <span>1 piece placed - click to move it</span>
                    </div>
                  )}
                  
                  {canPlaceGuess && hasNoPieces && (
                    <div className="text-xs mt-1 text-blue-200 flex items-center justify-center gap-1">
                      <span>🎯</span>
                      <span>Place your 1 guess piece</span>
                    </div>
                  )}
                </div>
                
                {/* Unit Labels with Enhanced Design */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-2 flex justify-between text-white text-xs font-semibold border-b border-emerald-500">
                  <span className="flex items-center gap-1">{units[0]}</span>
                  <span className="flex items-center gap-1">{units[1]}</span>
                </div>
                
                {/* Scale Range Buttons with Game State Integration */}
                <div className="flex bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-sm border-2 border-emerald-600 rounded-b-xl overflow-hidden shadow-xl">
                  {ranges.map((range: string, index: number) => {
                    // Check if this range has a placement
                    const placement = hasPlacement(scaleType, range);
                    
                    // Determine button styling based on game state
                    const getButtonStyling = () => {
                      if (placement) {
                        // Show player color for existing placements
                        return getPlayerColor(placement.playerId);
                      } else if (canPlaceGuess) {
                        // Available for placement
                        return 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-emerald-400/30';
                      } else {
                        // Disabled state
                        return 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-400/20 opacity-60';
                      }
                    };
                    
                    return (
                      <button
                        key={index}
                        className={`
                          ${getButtonStyling()}
                          flex-1 py-4 px-2 text-xs font-bold text-white transition-all duration-300 
                          border-r border-emerald-600/50 last:border-r-0 relative group
                          ${canPlaceGuess && !placement ? 'hover:scale-110 hover:shadow-xl cursor-pointer transform hover:z-10' : 'cursor-not-allowed'}
                          ${placement ? 'ring-2 ring-white ring-inset animate-pulse shadow-lg' : ''}
                        `}
                        onClick={() => canPlaceGuess && !placement && handleScaleClick(scaleType, range)}
                        disabled={!canPlaceGuess || !!placement}
                        title={`${scaleInfo.title}: ${range}${placement ? ` (${players.find(p => p.id === `player-${parseInt(placement.playerId) + 1}`)?.name || 'Player'})` : ''}`}
                      >
                        {/* Hover overlay for better feedback */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Range text with better formatting */}
                        <span className="block leading-tight relative z-10">
                          {range.split('-').map((part: string, i: number) => (
                            <span key={i} className="block text-center text-xs">
                              {part.trim()}
                            </span>
                          ))}
                        </span>
                        
                        {/* Placement indicator */}
                        {placement && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border border-emerald-600 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Scale Footer with Game Status */}
                <div className="bg-black/20 px-3 py-2 text-center rounded-b-xl">
                  <p className="text-emerald-200/70 text-xs">
                    {canPlaceGuess ? 'Click to place your guess piece' : phase === 'evaluation' ? 'Evaluation phase - no more guesses' : 'No guess pieces remaining'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Game Status Panel */}
        <div className="mt-8 bg-black/20 rounded-xl p-4 border border-white/10">
          <div className="text-center mb-4">
            <h4 className="text-emerald-200 font-semibold mb-2 flex items-center justify-center gap-2">
              <span>🎮</span>
              Game Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-emerald-100 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white"
                    style={{ backgroundColor: currentPlayerData?.color }}
                  />
                  <span className="font-bold">{currentPlayerData?.name}</span>
                </div>
                <p className="text-xs opacity-80">Current Player</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span>🎯</span>
                  <span className="font-bold">{currentPlayerData?.guessPieces}</span>
                </div>
                <p className="text-xs opacity-80">Guess Pieces Left</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span>📍</span>
                  <span className="font-bold">{placementCount}/1</span>
                </div>
                <p className="text-xs opacity-80">Pieces This Turn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Panel */}
        <div className="mt-6 bg-black/20 rounded-xl p-4 border border-white/10">
          <div className="text-center">
            <h4 className="text-emerald-200 font-semibold mb-2 flex items-center justify-center gap-2">
              <span>💡</span>
              Measurement Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-emerald-100 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <span>Exact match = 7 points</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Adjacent range = 3 points</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>❌</span>
                  <span>Wrong guess = 0 points</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📦</span>
                  <span>Wrong pieces go to stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScaleSelector;