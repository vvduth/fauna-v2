import React from 'react';
import { type Player } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { Crown } from 'lucide-react';

interface PlayerPanelProps {
  players: Player[];
  currentPlayer: number;
  startingPlayer: number;
  className?: string;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({ 
  players, 
  currentPlayer, 
  startingPlayer,
  className = '' 
}) => {
  return (
     <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg text-center">Players</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((player, index) => (
            <div 
              key={player.id}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200
                ${index === currentPlayer ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'}
                ${index === startingPlayer ? 'ring-2 ring-orange-300' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="font-medium">{player.name}</span>
                  {index === startingPlayer && (
                    <Crown className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <span className="font-bold text-lg">{player.score}</span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Pieces: {player.guessPieces}</span>
                <span>Stock: {player.stockPieces}</span>
              </div>
              
              {index === currentPlayer && (
                <div className="mt-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                  Current Turn
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default PlayerPanel