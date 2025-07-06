// Main type exports for the Fauna game server
// This file provides a central place to import all game-related types

export type {
  Player,
  SessionPlayer,
  GuessPlacement,
  GameState,
  GameRoom,
  ClaimedRegion,
  CustomRegion,
} from './gameSession';

export type {
  AnimalCard,
  AnimalMeasurements,
  AnimalClassification,
} from './animal';
