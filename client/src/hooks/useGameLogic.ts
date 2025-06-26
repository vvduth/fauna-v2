import { useState, useCallback } from 'react';
import { type GameState, type Player, 
    type Animal, 
    type GuessPlacement, 
} from '@/types/game'
import {PLAYER_COLORS, VICTORY_POINTS } from '@/constants/worldRegions'

// Sample animals for testing
// Sample animals for testing
const SAMPLE_ANIMALS: Animal[] = [
  {
    id: '1',
    name: 'African Elephant',
    scientificName: 'Loxodonta africana',
    animalClass: 'Mammal',
    illustration: '/placeholder-elephant.jpg',
    difficulty: 'simple',
    naturalAreas: ['East Africa', 'Southern Africa', 'West Africa'],
    measurements: {
      weight: { min: 4000, max: 7000, unit: 'kg' },
      length: { min: 6, max: 7.5, unit: 'm' },
      height: { min: 3, max: 4, unit: 'm' },
      totalLength: { min: 6, max: 7.5, unit: 'm' }
    },
    worldMapData: ['East Africa', 'Southern Africa', 'West Africa'],
    description: 'The largest land animal, known for its intelligence and strong social bonds.'
  },
  {
    id: '2',
    name: 'Arctic Fox',
    scientificName: 'Vulpes lagopus',
    animalClass: 'Mammal',
    illustration: '/placeholder-fox.jpg',
    difficulty: 'simple',
    naturalAreas: ['Alaska', 'Canada', 'Greenland', 'Russia'],
    measurements: {
      weight: { min: 3, max: 8, unit: 'kg' },
      length: { min: 45, max: 65, unit: 'cm' },
      height: { min: 25, max: 30, unit: 'cm' },
      tailLength: { min: 25, max: 35, unit: 'cm' }
    },
    worldMapData: ['Alaska', 'Canada', 'Greenland', 'Russia'],
    description: 'Well adapted to cold climates with thick fur and compact body.'
  }
];

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayer: 0,
    startingPlayer: 0,
    currentAnimal: null,
    phase: 'placement',
    round: 1,
    placements: [],
    showCardLowerHalf: false,
    gameEnded: false
  });

  const initializeGame = useCallback((playerNames: string[]) => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: index.toString(),
      name,
      color: PLAYER_COLORS[index],
      score: 0,
      guessPieces: 7,
      stockPieces: 0
    }));

    const randomAnimal = SAMPLE_ANIMALS[Math.floor(Math.random() * SAMPLE_ANIMALS.length)];

    setGameState({
      players,
      currentPlayer: 0,
      startingPlayer: 0,
      currentAnimal: randomAnimal,
      phase: 'placement',
      round: 1,
      placements: [],
      showCardLowerHalf: false,
      gameEnded: false
    });
  }, []);

  const placeGuess = useCallback((type: 'area' | 'scale', location: string, scaleType?: keyof typeof import('@/constants/worldRegions').SCALE_RANGES) => {
    setGameState(prev => {
      const currentPlayerData = prev.players[prev.currentPlayer];
      if (currentPlayerData.guessPieces <= 0) return prev;

      // Check if location is already occupied
      const existingPlacement = prev.placements.find(p => 
        p.location === location && 
        p.type === type &&
        (type === 'area' || p.scaleType === scaleType)
      );
      
      if (existingPlacement) return prev;

      const newPlacement: GuessPlacement = {
        playerId: prev.currentPlayer.toString(),
        type,
        location,
        scaleType
      };

      const updatedPlayers = prev.players.map((player, index) => 
        index === prev.currentPlayer 
          ? { ...player, guessPieces: player.guessPieces - 1 }
          : player
      );

      return {
        ...prev,
        players: updatedPlayers,
        placements: [...prev.placements, newPlacement]
      };
    });
  }, []);

  const passPlacement = useCallback(() => {
    setGameState(prev => {
      let nextPlayer = (prev.currentPlayer + 1) % prev.players.length;
      
      // Check if all players have passed (simplified logic)
      // In a real implementation, you'd track who has passed
      const activePlayers = prev.players.filter(p => p.guessPieces > 0);
      if (activePlayers.length === 0) {
        return { ...prev, phase: 'evaluation' };
      }

      return {
        ...prev,
        currentPlayer: nextPlayer
      };
    });
  }, []);

  const evaluateRound = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentAnimal) return prev;

      const updatedPlayers = prev.players.map(player => {
        let points = 0;
        const playerPlacements = prev.placements.filter(p => p.playerId === player.id);

        // Calculate area points
        const areaPlacements = playerPlacements.filter(p => p.type === 'area');
        const correctAreas = prev.currentAnimal!.worldMapData.length;
        
        areaPlacements.forEach(placement => {
          if (prev.currentAnimal!.worldMapData.includes(placement.location)) {
            // Direct hit scoring based on number of correct areas
            if (correctAreas === 1) points += 12;
            else if (correctAreas === 2) points += 10;
            else if (correctAreas <= 4) points += 8;
            else if (correctAreas <= 8) points += 6;
            else if (correctAreas <= 16) points += 4;
            else points += 3;
          }
        });

        // Calculate scale points (simplified)
        const scalePlacements = playerPlacements.filter(p => p.type === 'scale');
        scalePlacements.forEach(() => {
          // For demo purposes, give some points for scale guesses
          points += Math.random() > 0.5 ? 7 : 0;
        });

        return {
          ...player,
          score: player.score + points
        };
      });

      // Check for victory
      const victoryThreshold = VICTORY_POINTS[prev.players.length as keyof typeof VICTORY_POINTS] || 100;
      const winners = updatedPlayers.filter(p => p.score >= victoryThreshold);

      return {
        ...prev,
        players: updatedPlayers,
        phase: 'nextRound',
        gameEnded: winners.length > 0,
        winner: winners.length > 0 ? winners : undefined
      };
    });
  }, []);

  const nextRound = useCallback(() => {
    setGameState(prev => {
      const nextStartingPlayer = (prev.startingPlayer + 1) % prev.players.length;
      const randomAnimal = SAMPLE_ANIMALS[Math.floor(Math.random() * SAMPLE_ANIMALS.length)];

      // Return pieces from stock and refill to minimum 3
      const updatedPlayers = prev.players.map(player => ({
        ...player,
        guessPieces: Math.max(3, player.guessPieces + Math.min(1, player.stockPieces)),
        stockPieces: Math.max(0, player.stockPieces - 1)
      }));

      return {
        ...prev,
        players: updatedPlayers,
        currentPlayer: nextStartingPlayer,
        startingPlayer: nextStartingPlayer,
        currentAnimal: randomAnimal,
        phase: 'placement',
        round: prev.round + 1,
        placements: [],
        showCardLowerHalf: false
      };
    });
  }, []);

  const toggleCardHalf = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showCardLowerHalf: !prev.showCardLowerHalf
    }));
  }, []);

  return {
    gameState,
    initializeGame,
    placeGuess,
    passPlacement,
    evaluateRound,
    nextRound,
    toggleCardHalf
  };
};