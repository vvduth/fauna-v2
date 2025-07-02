import { useState, useCallback } from 'react';
import { type GameState, type Player, 
    type Animal, 
    type GuessPlacement, 
} from '@/types/game'
import {PLAYER_COLORS, VICTORY_POINTS } from '@/constants/worldRegions'
import { getRandomAnimalCard } from '@/utils/animalUtils';

// Sample animals for testing
// Sample animals for testing
const SAMPLE_ANIMALS: Animal[] = [
  {
            "id": "43d28ee7f64f4afd81fd88cf03f65b9a-1750925087011",
            "name": "Civet",
            "scientificName": "Civettictis civetta",
            "animalClass": "Mammal",
            "cardType": "simple",
            "habitatAreas": [
                "MELANESIA",
                "GUYANA",
                "AMAZON BASIN",
                "BRAZIL",
                "CONGO BASIN",
                "SOUTHEAST ASIA"
            ],
            "numberOfAreas": 6,
            "measurements": {
                "weight": {
                    "value": 5,
                    "unit": "kg",
                    "range": {
                        "min": 4,
                        "max": 6
                    }
                },
                "length": {
                    "value": 60,
                    "unit": "cm",
                    "range": {
                        "min": 50,
                        "max": 70
                    }
                },
                "totalLength": {
                    "value": 90,
                    "unit": "cm",
                    "range": {
                        "min": 80,
                        "max": 100
                    }
                },
                "height": {
                    "value": 30,
                    "unit": "cm",
                    "range": {
                        "min": 25,
                        "max": 35
                    }
                },
                "tailLength": {
                    "value": 30,
                    "unit": "cm",
                    "range": {
                        "min": 25,
                        "max": 35
                    }
                }
            },
            "classification": {
                "kingdom": "Animalia",
                "phylum": "Chordata",
                "class": "Mammalia",
                "order": "Carnivora",
                "family": "Viverridae",
                "genus": "Civettictis",
                "species": "civetta"
            },
            "description": "The African civet is a nocturnal mammal with a distinctive coat featuring black and white markings, a long body, and a bushy tail. It is known for its strong scent glands, which produce a musk used in perfume.",
            "imageUrl": "https://www.meisterdrucke.us/kunstwerke/1260px/William_Smellie_-_African_civet_Civettictis_civetta_-_%28MeisterDrucke-1016178%29.jpg",
            "conservationStatus": "Least Concern",
            "difficulty": "beginner"
        },
        {
            "id": "189abf977ea046f0971b2a3f0a79bca2-1750924520710",
            "name": "Serval",
            "scientificName": "Leptailurus serval",
            "animalClass": "Mammal",
            "cardType": "exotic",
            "habitatAreas": [],
            "numberOfAreas": 0,
            "measurements": {
                "weight": {
                    "value": 11,
                    "unit": "kg",
                    "range": {
                        "min": 8,
                        "max": 15
                    }
                },
                "length": {
                    "value": 67,
                    "unit": "cm",
                    "range": {
                        "min": 60,
                        "max": 75
                    }
                },
                "totalLength": {
                    "value": 90,
                    "unit": "cm",
                    "range": {
                        "min": 80,
                        "max": 100
                    }
                },
                "height": {
                    "value": 40,
                    "unit": "cm",
                    "range": {
                        "min": 35,
                        "max": 45
                    }
                },
                "tailLength": {
                    "value": 23,
                    "unit": "cm",
                    "range": {
                        "min": 20,
                        "max": 25
                    }
                }
            },
            "classification": {
                "kingdom": "Animalia",
                "phylum": "Chordata",
                "class": "Mammalia",
                "order": "Carnivora",
                "family": "Felidae",
                "genus": "Leptailurus",
                "species": "Leptailurus serval"
            },
            "description": "The serval is a medium-sized wild cat characterized by its long legs, large ears, and spotted coat. It has a slender body and is known for its exceptional jumping ability, allowing it to catch birds and rodents.",
            "imageUrl": "https://media.istockphoto.com/id/499884748/vector/llustrated-portrait-of-serval.jpg?s=612x612&w=0&k=20&c=4mTDiIwSnTnjWkcedv9rcRboUYO9qhOUvkVzjpIk46Y=",
            "conservationStatus": "Least Concern",
            "difficulty": "expert"
        }
  
];

export const useGameLogic =  () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayer: 0,
    startingPlayer: 0,
    currentAnimal: null,
    phase: 'placement',
    round: 1,
    placements: [],
    showCardLowerHalf: false,
    gameEnded: false,
    
  });

  const initializeGame = useCallback(async (playerNames: string[]) => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: index.toString(),
      name,
      color: PLAYER_COLORS[index],
      score: 0,
      guessPieces: 7,
      stockPieces: 0
    }));

    const randomAnimalRes = await getRandomAnimalCard()
    console.log('Random Animal Response:', randomAnimalRes);
    const randomAnimal = randomAnimalRes.card as Animal;
    

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
        const correctAreas = prev.currentAnimal!.habitatAreas.length;
        
        areaPlacements.forEach(placement => {
          if (prev.currentAnimal!.habitatAreas.includes(placement.location)) {
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