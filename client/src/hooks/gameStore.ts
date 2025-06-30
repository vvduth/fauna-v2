import type { Animal, GameState, Player } from "@/types/game";
import { create } from "zustand";
import { SCALE_RANGES } from "@/constants/worldRegions";
/**
 * Creates the initial game state based on Fauna board game rules
 * Sets up players, starting pieces, and game phase
 */
const createInitialGameState = (playerCount: number = 2) => {
  // Generate initial players with starting pieces
  const players: Player[] = Array.from({ length: playerCount }, (_, index) => ({
    id: `player-${index + 1}`,
    name: `Player ${index + 1}`,
    color: getPlayerColor(index), // Player colors for guess pieces
    score: 0, // All players start with 0 points
    guessPieces: 7, // Each player starts with 7 guess pieces (42 total ÷ 6 max players)
    stockPieces: 0, // No pieces in stock at start
  }));

  // Determine starting player (randomly or first player)
  const startingPlayer = 0; // Could be Math.floor(Math.random() * playerCount)

  return {
    players,
    currentPlayer: startingPlayer, // Starting player goes first
    startingPlayer, // Track who has the starting player lion
    currentAnimal: null, // No animal card drawn yet
    phase: "placement" as const, // Game starts with placement phase
    round: 1, // First round
    placements: [], // No guess pieces placed yet
    showCardLowerHalf: false, // Upper half only during placement
    gameEnded: false, // Game just started
    winner: undefined, // No winner yet
  };
};

/**
 * Get player color based on index
 * Standard board game colors for guess pieces
 */
const getPlayerColor = (index: number): string => {
  const colors = [
    "#FF4444", // Red
    "#4444FF", // Blue
    "#44FF44", // Green
    "#FFFF44", // Yellow
    "#FF44FF", // Magenta
    "#44FFFF", // Cyan
  ];
  return colors[index] || "#888888"; // Default gray for extra players
};

/**
 * Calculate victory point goal based on player count
 * As specified in the rules
 */
export const getVictoryPointGoal = (playerCount: number): number => {
  if (playerCount <= 3) return 120; // 2-3 players: 120 points
  if (playerCount <= 5) return 100; // 4-5 players: 100 points
  return 80; // 6 players: 80 points
};

/**
 * Check if any player has reached the victory threshold
 * Game ends when one player reaches or surpasses the goal
 */
export const checkGameEnd = (
  players: Player[]
): { ended: boolean; winners: Player[] } => {
  const goal = getVictoryPointGoal(players.length);
  const highestScore = Math.max(...players.map((p) => p.score));

  if (highestScore >= goal) {
    // Find all players with the highest score (handles ties)
    const winners = players.filter((p) => p.score === highestScore);
    return { ended: true, winners };
  }

  return { ended: false, winners: [] };
};
export const useGameStore = create<GameState>((set, get) => ({
  ...createInitialGameState(2), // Default to 2 players
  resetGame: (playerCount: number = 2) => {
    set(createInitialGameState(playerCount));
  },
  updatePlayerName: (playerId: string, name: string) => {
    set((state) => ({
      players: state.players.map((player) =>
        player.id === playerId ? { ...player, name } : player
      ),
    }));
  },
  addPlayer: (name: string) => {
    set((state) => {
      if (state.players.length < 6) {
        const newPlayer: Player = {
          id: `player-${state.players.length + 1}`,
          name,
          color: getPlayerColor(state.players.length),
          score: 0,
          guessPieces: 7,
          stockPieces: 0,
        };
        return {
          players: [...state.players, newPlayer],
        };
      }
      return state; // Do nothing if max players reached
    });
  },
  startRound: (animal: Animal) => {
    set((state) => ({
      ...state,
      currentAnimal: animal,
      phase: "placement",
      placements: [],
      showCardLowerHalf: false,
      currentPlayer: state.startingPlayer,
    }));
  },
  nextPlayer: () => {
    set(state => {
      const nextPlayerIndex = (state.currentPlayer + 1) % state.players.length;
      return {
        ...state,
        currentPlayer: nextPlayerIndex
      };
    });
  },
  placeGuess: (type: 'area'| 'scale',
    location: string, 
    scaleType?: keyof typeof SCALE_RANGES
  ) => {
    if (type === 'area' ) {
      console.log(`Placing guess in area: ${location}`);
    }
  },
  // Action to move to evaluation phase
  startEvaluation: () => {
    set(state => ({
      ...state,
      phase: 'evaluation',
      showCardLowerHalf: true // Reveal lower half for scoring
    }));
  },
  // Action to end round and prepare for next
  endRound: () => {
    set(state => {
      // Move starting player lion to next player (clockwise)
      const nextStartingPlayer = (state.startingPlayer + 1) % state.players.length;
      
      // Each player takes back one piece from stock (if available)
      const updatedPlayers = state.players.map(player => {
        const piecesToRecover = Math.min(1, player.stockPieces);
        return {
          ...player,
          guessPieces: Math.min(7, player.guessPieces + piecesToRecover), // Max 7 pieces
          stockPieces: player.stockPieces - piecesToRecover
        };
      });
      
      // Check if game has ended
      const gameEndResult = checkGameEnd(updatedPlayers);
      
      return {
        ...state,
        players: updatedPlayers,
        startingPlayer: nextStartingPlayer,
        currentPlayer: nextStartingPlayer,
        round: state.round + 1,
        phase: gameEndResult.ended ? 'evaluation' : 'placement',
        currentAnimal: null, // Clear current animal
        placements: [], // Clear placements
        showCardLowerHalf: false,
        gameEnded: gameEndResult.ended,
        winner: gameEndResult.ended ? gameEndResult.winners : undefined
      };
    });
  }
}));
