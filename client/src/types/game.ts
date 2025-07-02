import type { SCALE_RANGES } from "@/constants/worldRegions";

// Types for the map configuration and regions
export interface MapConfig {
  gridWidth: number;
  gridHeight: number;
  cellWidth: number;
  cellHeight: number;
  mapLeft: number;
  mapRight: number;
  mapTop: number;
  mapBottom: number;
}

export interface Region {
  zones: Array<{ x: number; y: number; width: number; height: number }>;
  color: string;
  label: string;
}

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

// Animal data structure for the game cards
export interface AnimalMeasurements {
  weight?: {
    value: number;
    unit: "kg" | "g";
    range?: { min: number; max: number };
  };
  length?: {
    value: number;
    unit: "cm" | "m";
    range?: { min: number; max: number };
  };
  totalLength?: {
    value: number;
    unit: "cm" | "m";
    range?: { min: number; max: number };
  };
  height?: {
    value: number;
    unit: "cm" | "m";
    range?: { min: number; max: number };
  };
  tailLength?: {
    value: number;
    unit: "cm" | "m";
    range?: { min: number; max: number };
  };
}

export interface AnimalClassification {
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
}

export interface Animal {
  id: string;
  name: string;
  scientificName: string;
  animalClass: string; // Mammal, Bird, Reptile, etc.
  cardType: "simple" | "exotic"; // green or black card margin

  // Habitat information
  habitatAreas: string[]; // Areas from your AREAS constant
  numberOfAreas: number;

  // Physical measurements (average values)
  measurements: AnimalMeasurements;

  // Zoological classification
  classification: AnimalClassification;

  // Additional game data
  description?: string;
  imageUrl?: string;
  conservationStatus?: string;
  difficulty: "beginner" | "intermediate" | "expert";
}

export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
  guessPieces: number;
  stockPieces: number;
}

export interface GuessPlacement {
  playerId: string;
  type: "area" | "scale";
  location: string; // area name or scale position
  scaleType?: "weight" | "length" | "totalLength" | "height" | "tailLength";
  color: string; // Color for the guess piece
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  startingPlayer: number;
  currentAnimal: Animal | null;
  phase: "placement" | "evaluation" | "nextRound";
  round: number;
  placements: GuessPlacement[];
  showCardLowerHalf: boolean;
  gameEnded: boolean;
  winner?: Player[];

  resetGame: (playerCount: number) => void;
  updatePlayerName: (playerId: string, name: string) => void;
  addPlayer: (name: string) => void;
  placeGuess: (
    type: "area" | "scale",
    location: string,
    scaleType?: keyof typeof SCALE_RANGES
  ) => void;
  removeGuess: (
    type: "area" | "scale",
    location: string,
    scaleType?: keyof typeof SCALE_RANGES
  ) => void; // 🔥 NEW
  endTurn: () => void; // 🔥 NEW - replaces automatic advancement
  startRound: (animal: Animal) => void;
  nextPlayer: () => void;
  startEvaluation: () => void;
  endRound: () => void;
}
