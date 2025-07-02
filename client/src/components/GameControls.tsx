import { useGameStore } from "@/hooks/gameStore";
import { Button } from "./UI/button";

const GameControls = () => {
  const {
    currentPlayer,
    players,
    phase,
    endTurn,
    startEvaluation,
    endRound,
    placements,
  } = useGameStore();
  
  const currentPlayerData = players[currentPlayer];
  
  // Check current player's placements for this turn
  const currentPlayerPlacements = placements.filter(
    (p) => p.playerId === currentPlayer.toString()
  );
  
  const placementCount = currentPlayerPlacements.length;
  
  // Determine if player can end turn (must have exactly 1 piece placed)
  const canEndTurn = (placementCount === 1) || (placementCount === 0);
  const passWithoutPlacement = placementCount === 0;
  const tooManyPieces = placementCount > 1;
  
  // Get turn status message
  const getTurnStatusMessage = () => {
    if (passWithoutPlacement) {
      return "Pass turn without placing a piece";
    } else if (tooManyPieces) {
      return `Too many pieces (${placementCount})! Only 1 allowed per turn`;
    } else {
      return "Ready to end turn";
    }
  };
  
  const getEndTurnButtonText = () => {
    if (passWithoutPlacement) {
      return "🚫 Pass Turn";
    } else if (tooManyPieces) {
      return `🚫 Too Many Pieces (${placementCount})`;
    } else {
      return "🎯 End Turn";
    }
  };
  return (
    <div className="lg:col-span-2 animate-fade-in delay-400">
      <div className="backdrop-blur-lg bg-white/10 border-white/20 rounded-2xl p-6 shadow-2xl border">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-emerald-200 flex items-center justify-center gap-2">
            <span>🎮</span>
            Game Control
          </h3>
          <p className="text-sm text-emerald-100">
            Current Player:{" "}
            <span className="font-semibold">{currentPlayerData.name}</span>
          </p>
          <p className="text-xs text-emerald-200/70 mt-1">
            Pieces Left: {currentPlayerData.guessPieces} | Placed This Turn: {placementCount}
          </p>
          <p className={`text-xs mt-1 ${canEndTurn ? 'text-green-300' : 'text-yellow-300'}`}>
            {getTurnStatusMessage()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* End Turn Button - Only enabled when exactly 1 piece is placed */}
          {phase === 'placement' && (
            <Button
              onClick={endTurn}
              disabled={!canEndTurn}
              className={`w-full font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all duration-300 ${
                canEndTurn 
                  ? 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 hover:scale-105 text-white' 
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 cursor-not-allowed opacity-60'
              }`}
            >
              {getEndTurnButtonText()}
            </Button>
          )}
         {/* Start Evaluation Button - Only show during placement phase when all players have had turns */}
          {phase === 'placement' && (
            <Button
              onClick={startEvaluation}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              ⚡ Start Evaluation
            </Button>
          )}

          {/* Next Round Button - Only show during evaluation phase */}
          {phase === 'evaluation' && (
            <Button
              onClick={endRound}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              ⏭️ Next Round
            </Button>
          )}
        </div>

        {/* Turn Instructions */}
        <div className="mt-6 p-4 bg-black/20 rounded-xl">
          <h4 className="text-emerald-200 font-semibold mb-2 text-center">
            🎯 Turn Rules
          </h4>
          <div className="text-emerald-100 text-xs space-y-1">
            {phase === 'placement' ? (
              <>
                <div>• Place exactly 1 guess piece per turn</div>
                <div>• Click any location to move your piece</div>
                <div>• Cannot end turn without 1 piece placed</div>
                <div>• Cannot end turn with more than 1 piece</div>
              </>
            ) : (
              <>
                <div>• Evaluation phase in progress</div>
                <div>• Check animal card lower half</div>
                <div>• Points awarded for correct guesses</div>
                <div>• Click "Next Round" to continue</div>
              </>
            )}
          </div>
        </div>

        {/* Victory Goals */}
        <div className="mt-4 p-4 bg-black/20 rounded-xl">
          <h4 className="text-emerald-200 font-semibold mb-2 text-center">
            🏆 Victory Goals
          </h4>
          <div className="text-emerald-100 text-xs space-y-1">
            <div>🥇 2-3 Players: 120 points</div>
            <div>🥈 4-5 Players: 100 points</div>
            <div>🥉 6 Players: 80 points</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
