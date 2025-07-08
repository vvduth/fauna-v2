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
      <div className="backdrop-blur-lg bg-white/10 border-white/20 rounded-xl p-1 shadow-xl border">
        <div className="text-center mb-3">
          <h3 className="text-lg font-bold text-emerald-200 flex items-center justify-center gap-2">
            <span>📏</span>
            Scales
            <span>⚖️</span>
          </h3>
          <p className="text-emerald-200/70 mt-1 text-xs">Estimate measurements</p>
        </div>
        
        {/* Scales Grid - Compact Layout for Sidebar */}
        <div className="grid grid-cols-1 gap-3">
          {/* Render each scale type using SCALE_RANGES constant */}
          {Object.entries(SCALE_RANGES).map(([scaleTypeKey, ranges], scaleIndex) => {
            const scaleType = scaleTypeKey as keyof typeof SCALE_RANGES;
            const scaleInfo = scaleLabels[scaleType];
            const units = getScaleUnits(scaleType);
            
            return (
              <div 
                key={scaleType}
                className="transform transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${scaleIndex * 100}ms` }}
              >
                {/* Compact Scale Header */}
                <div className="bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-700 text-white px-2 py-2 text-center rounded-t-lg border-b border-emerald-500 shadow-md">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-sm">{scaleInfo.emoji}</span>
                    <h4 className="font-bold text-xs tracking-wide">{scaleInfo.title}</h4>
                  </div>
                  
                  {/* Simplified status indicators */}
                  {!canPlaceGuess && (
                    <div className="text-xs text-yellow-200 flex items-center justify-center gap-1">
                      <span>⚠️</span>
                      <span className="truncate">{phase !== 'placement' ? 'Evaluation' : 'No pieces'}</span>
                    </div>
                  )}
                  
                  {canPlaceGuess && hasExactlyOnePiece && (
                    <div className="text-xs text-green-200 flex items-center justify-center gap-1">
                      <span>✅</span>
                      <span className="truncate">Placed</span>
                    </div>
                  )}
                  
                  {canPlaceGuess && hasNoPieces && (
                    <div className="text-xs text-blue-200 flex items-center justify-center gap-1">
                      <span>🎯</span>
                      <span className="truncate">Place piece</span>
                    </div>
                  )}
                </div>
                
                {/* Compact Unit Labels */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-2 py-1 flex justify-between text-white text-xs font-semibold border-b border-emerald-500">
                  <span className="flex items-center gap-1 text-xs">{units[0]}</span>
                  <span className="flex items-center gap-1 text-xs">{units[1]}</span>
                </div>
                
                {/* Compact Scale Range Buttons */}
                <div className="flex bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-sm border-2 border-emerald-600 rounded-b-lg overflow-hidden shadow-lg">
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
                          flex-1 py-2 px-1 text-xs font-bold text-white transition-all duration-300 
                          border-r border-emerald-600/50 last:border-r-0 relative group
                          ${canPlaceGuess && !placement ? 'hover:scale-105 hover:shadow-lg cursor-pointer transform hover:z-10' : 'cursor-not-allowed'}
                          ${placement ? 'ring-1 ring-white ring-inset animate-pulse shadow-md' : ''}
                        `}
                        onClick={() => canPlaceGuess && !placement && handleScaleClick(scaleType, range)}
                        disabled={!canPlaceGuess || !!placement}
                        title={`${scaleInfo.title}: ${range}${placement ? ` (${players.find(p => p.id === `player-${parseInt(placement.playerId) + 1}`)?.name || 'Player'})` : ''}`}
                      >
                        {/* Hover overlay for better feedback */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Compact range text */}
                        <span className="block leading-tight relative z-10">
                          {range.split('-').map((part: string, i: number) => (
                            <span key={i} className="block text-center text-xs leading-tight">
                              {part.trim()}
                            </span>
                          ))}
                        </span>
                        
                        {/* Smaller placement indicator */}
                        {placement && (
                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full border border-emerald-600 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Removed footer for compact design */}
              </div>
            );
          })}
        </div>
        
        {/* Compact Game Status Panel */}
        <div className="mt-4 bg-black/20 rounded-lg p-3 border border-white/10">
          <div className="text-center">
            <h4 className="text-emerald-200 font-semibold mb-2 flex items-center justify-center gap-2 text-sm">
              <span>🎮</span>
              Status
            </h4>
            <div className="grid grid-cols-3 gap-2 text-emerald-100 text-xs">
              <div className="bg-white/10 rounded p-2">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full border border-white"
                    style={{ backgroundColor: currentPlayerData?.color }}
                  />
                  <span className="font-bold text-xs truncate">{currentPlayerData?.name}</span>
                </div>
                <p className="text-xs opacity-80">Player</p>
              </div>
              
              <div className="bg-white/10 rounded p-2">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span>🎯</span>
                  <span className="font-bold">{currentPlayerData?.guessPieces}</span>
                </div>
                <p className="text-xs opacity-80">Pieces</p>
              </div>
              
              <div className="bg-white/10 rounded p-2">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span>📍</span>
                  <span className="font-bold">{placementCount}/1</span>
                </div>
                <p className="text-xs opacity-80">Turn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Instructions Panel */}
        <div className="mt-3 bg-black/20 rounded-lg p-3 border border-white/10">
          <div className="text-center">
            <h4 className="text-emerald-200 font-semibold mb-2 flex items-center justify-center gap-2 text-sm">
              <span>💡</span>
              Scoring
            </h4>
            <div className="grid grid-cols-2 gap-2 text-emerald-100 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span>🎯</span>
                  <span>Exact = 7pts</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>Near = 3pts</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span>❌</span>
                  <span>Wrong = 0pts</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📦</span>
                  <span>To stock</span>
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