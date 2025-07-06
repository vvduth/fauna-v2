
import { SCALE_RANGES } from "../constants/scale";
import { AnimalCard } from "./animal";

// Region types compatible with client
export interface CustomRegion {
  name: string;
  color: string;
  cells: Array<{ x: number; y: number }>;
  cellCount: number;
  components: number;
  created: string;
  bounds?: any;
}

export type ClaimedRegion = { playerId: string; color: string; region: CustomRegion }

// Player interface compatible with client-side
export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
  guessPieces: number;
  stockPieces: number;
}

// Session player for server-side room management
export interface SessionPlayer {
  sessionId: string;       // Generated when joining
  displayName: string;     // Player-chosen name
  color: string;          // Assigned player color
  isHost: boolean;        // Can start game, kick players
  isConnected: boolean;   // Real-time connection status
  joinedAt: Date;         // When player joined the room
}



export interface GuessPlacement {
  playerId: string;
  type: "area" | "scale";
  location: string; // area name or scale position
  scaleType?: "weight" | "length" | "totalLength" | "height" | "tailLength";
  color: string; // Color for the guess piece
}

// Server-side GameState (pure data, no functions)
export interface GameState {
  players: Player[];
  currentPlayer: number;
  startingPlayer: number;
  currentAnimal: AnimalCard | null;
  phase: "placement" | "evaluation" | "nextRound";
  round: number;
  placements: GuessPlacement[];
  showCardLowerHalf: boolean;
  gameEnded: boolean;
  winner?: Player[];
  claimedRegions: ClaimedRegion[];
}

export interface GameRoom {
    roomCode: string;
    players: SessionPlayer[];    // Use SessionPlayer for room management
    gameState: GameState | null; // Game state when game is active
    hostPlayerId: string;
    createdAt: Date;
    lastActivity: Date;
    maxPlayers: number;          // Maximum players allowed (6 for Fauna)
    gameStarted: boolean;        // Whether game has started
}

// Player identification (temporary, session-based)
export interface SessionPlayer {
  sessionId: string;       // Generated when joining
  displayName: string;     // Player-chosen name
  color: string;          // Assigned player color
  isHost: boolean;        // Can start game, kick players
  isConnected: boolean;   // Real-time connection status
  joinedAt: Date;         // When player joined the room
}