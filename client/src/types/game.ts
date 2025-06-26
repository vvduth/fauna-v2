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

export interface Animal {
  id: string;
  name: string;
  scientificName: string;
  animalClass: string;
  illustration: string;
  difficulty: 'simple' | 'exotic'; // green or black margin
  naturalAreas: string[];
  measurements: {
    weight?: { min: number; max: number; unit: string };
    length?: { min: number; max: number; unit: string };
    totalLength?: { min: number; max: number; unit: string };
    height?: { min: number; max: number; unit: string };
    tailLength?: { min: number; max: number; unit: string };
  };
  worldMapData: string[]; // areas where animal lives
  description?: string;
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
  type: 'area' | 'scale';
  location: string; // area name or scale position
  scaleType?: 'weight' | 'length' | 'totalLength' | 'height' | 'tailLength';
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  startingPlayer: number;
  currentAnimal: Animal | null;
  phase: 'placement' | 'evaluation' | 'nextRound';
  round: number;
  placements: GuessPlacement[];
  showCardLowerHalf: boolean;
  gameEnded: boolean;
  winner?: Player[];
}

