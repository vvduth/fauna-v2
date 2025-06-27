import React from 'react';
import { Button } from './UI/button';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { Play, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface GameControlsProps {
  phase: 'placement' | 'evaluation' | 'nextRound';
  onPass: () => void;
  onEvaluate: () => void;
  onNextRound: () => void;
  onNewGame: () => void;
  showCardLowerHalf: boolean;
  onToggleCardHalf: () => void;
  canPass: boolean;
  className?: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  phase,
  onPass,
  onEvaluate,
  onNextRound,
  onNewGame,
  showCardLowerHalf,
  onToggleCardHalf,
  canPass,
  className = ''
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg text-center">Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {phase === 'placement' && (
          <>
            <Button 
              onClick={onPass} 
              disabled={!canPass}
              className="w-full"
              variant="outline"
            >
              Pass Turn
            </Button>
            <div className="text-center text-sm text-gray-600">
              Place guess pieces or pass
            </div>
          </>
        )}
        
        {phase === 'evaluation' && (
          <>
            <Button 
              onClick={onToggleCardHalf}
              className="w-full"
              variant="outline"
            >
              {showCardLowerHalf ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Solution
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Reveal Solution
                </>
              )}
            </Button>
            <Button 
              onClick={onEvaluate} 
              className="w-full"
            >
              Calculate Scores
            </Button>
          </>
        )}
        
        {phase === 'nextRound' && (
          <Button 
            onClick={onNextRound} 
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            Next Round
          </Button>
        )}
        
        <Button 
          onClick={onNewGame} 
          variant="destructive"
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameControls;