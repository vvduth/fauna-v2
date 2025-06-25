import { Request, Response } from 'express';
import { AnimalResearchService } from '../services/animalResearchService';
import { AnimalCard } from '../types/animal';

// In-memory storage for demonstration (replace with database in production)
let animalCards: AnimalCard[] = [];

/**
 * Controller handling all animal-related HTTP requests
 * Manages animal research, card retrieval, and statistics
 */
export class AnimalController {
  private researchService: AnimalResearchService;

  constructor() {
    this.researchService = new AnimalResearchService();
  }

  /**
   * Research a single animal and create a card
   * POST /api/animals/research
   */
  async researchAnimal(req: Request, res: Response): Promise<void> {
    try {
      const { animalName, scientificName } = req.body;

      // Validate input data
      if ((!animalName || typeof animalName !== 'string') && (!scientificName || typeof scientificName !== 'string')  
      ) {
        res.status(400).json({
          success: false,
          error: 'Animal name is required and must be a string'
        });
        return;
      }

      console.log(`Research request received for: ${animalName}`);

      // Research the animal using the service
      const animalCard = await this.researchService.researchCompleteAnimalData(
        animalName, 
        scientificName
      );

      // Store the researched card
      animalCards.push(animalCard);

      // Return success response with created card
      res.status(201).json({
        success: true,
        message: `Successfully researched ${animalName}`,
        data: {
          animalCard: animalCard,
          totalCards: animalCards.length
        }
      });

    } catch (error) {
      console.error('Error in researchAnimal controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to research animal',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * Get all animal cards with optional filtering
   * GET /api/animals/cards
   */
  async getAllCards(req: Request, res: Response): Promise<void> {
    try {
      const { cardType, difficulty, animalClass } = req.query;

      let filteredCards = animalCards;

      // Apply cardType filter (simple or exotic)
      if (cardType && (cardType === 'simple' || cardType === 'exotic')) {
        filteredCards = filteredCards.filter(card => card.cardType === cardType);
      }

      // Apply difficulty filter (beginner, intermediate, expert)
      if (difficulty && ['beginner', 'intermediate', 'expert'].includes(difficulty as string)) {
        filteredCards = filteredCards.filter(card => card.difficulty === difficulty);
      }

      // Apply animal class filter
      if (animalClass && typeof animalClass === 'string') {
        filteredCards = filteredCards.filter(card => 
          card.animalClass.toLowerCase().includes((animalClass as string).toLowerCase())
        );
      }

      res.json({
        success: true,
        data: {
          cards: filteredCards,
          total: filteredCards.length,
          filters: {
            cardType: cardType || 'all',
            difficulty: difficulty || 'all',
            animalClass: animalClass || 'all'
          }
        }
      });

    } catch (error) {
      console.error('Error in getAllCards controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve animal cards',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * Research multiple animals in batch
   * POST /api/animals/research/batch
   */
  async researchBatch(req: Request, res: Response): Promise<void> {
    try {
      const { animals } = req.body;

      // Validate input array
      if (!Array.isArray(animals) || animals.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Animals array is required and must not be empty'
        });
        return;
      }

      // Validate each animal request
      for (const animal of animals) {
        if (!animal.name || typeof animal.name !== 'string') {
          res.status(400).json({
            success: false,
            error: 'Each animal must have a valid name'
          });
          return;
        }
      }

      console.log(`Batch research request for ${animals.length} animals`);

      // Research all animals using the service
      const { results, errors } = await this.researchService.researchMultipleAnimals(animals);

      // Store successful results
      animalCards.push(...results);

      // Return comprehensive response
      res.status(201).json({
        success: true,
        message: `Batch research completed`,
        data: {
          successfulCards: results,
          errors: errors,
          summary: {
            totalRequested: animals.length,
            successful: results.length,
            failed: errors.length,
            successRate: `${((results.length / animals.length) * 100).toFixed(1)}%`
          },
          totalCardsInDatabase: animalCards.length
        }
      });

    } catch (error) {
      console.error('Error in researchBatch controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to process batch research',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * Get specific animal card by ID
   * GET /api/animals/cards/:id
   */
  async getCardById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Card ID is required'
        });
        return;
      }

      const card = animalCards.find(card => card.id === id);

      if (!card) {
        res.status(404).json({
          success: false,
          error: 'Animal card not found',
          details: `No card found with ID: ${id}`
        });
        return;
      }

      res.json({
        success: true,
        data: {
          card: card
        }
      });

    } catch (error) {
      console.error('Error in getCardById controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve animal card',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * Get cards by difficulty level
   * GET /api/animals/cards/difficulty/:level
   */
  async getCardsByDifficulty(req: Request, res: Response): Promise<void> {
    try {
      const { level } = req.params;

      if (!['beginner', 'intermediate', 'expert'].includes(level)) {
        res.status(400).json({
          success: false,
          error: 'Invalid difficulty level',
          details: 'Level must be: beginner, intermediate, or expert'
        });
        return;
      }

      const filteredCards = animalCards.filter(card => card.difficulty === level);

      res.json({
        success: true,
        data: {
          cards: filteredCards,
          total: filteredCards.length,
          difficulty: level
        }
      });

    } catch (error) {
      console.error('Error in getCardsByDifficulty controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve cards by difficulty',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * Get cards by type (simple/exotic)
   * GET /api/animals/cards/type/:cardType
   */
  async getCardsByType(req: Request, res: Response): Promise<void> {
    try {
      const { cardType } = req.params;

      if (!['simple', 'exotic'].includes(cardType)) {
        res.status(400).json({
          success: false,
          error: 'Invalid card type',
          details: 'Card type must be: simple or exotic'
        });
        return;
      }

      const filteredCards = animalCards.filter(card => card.cardType === cardType);

      res.json({
        success: true,
        data: {
          cards: filteredCards,
          total: filteredCards.length,
          cardType: cardType
        }
      });

    } catch (error) {
      console.error('Error in getCardsByType controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve cards by type',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * Get database statistics
   * GET /api/animals/stats
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = {
        totalCards: animalCards.length,
        cardTypes: {
          simple: animalCards.filter(card => card.cardType === 'simple').length,
          exotic: animalCards.filter(card => card.cardType === 'exotic').length
        },
        difficulties: {
          beginner: animalCards.filter(card => card.difficulty === 'beginner').length,
          intermediate: animalCards.filter(card => card.difficulty === 'intermediate').length,
          expert: animalCards.filter(card => card.difficulty === 'expert').length
        },
        animalClasses: this.getAnimalClassStats(),
        averageAreasPerCard: animalCards.length > 0 
          ? (animalCards.reduce((sum, card) => sum + card.numberOfAreas, 0) / animalCards.length).toFixed(1)
          : '0'
      };

      res.json({
        success: true,
        data: {
          statistics: stats,
          lastUpdated: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error in getStats controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve statistics',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * Helper method to get animal class statistics
   * Groups cards by animal class and counts them
   */
  private getAnimalClassStats(): Record<string, number> {
    const classStats: Record<string, number> = {};
    
    animalCards.forEach(card => {
      const animalClass = card.animalClass || 'Unknown';
      classStats[animalClass] = (classStats[animalClass] || 0) + 1;
    });

    return classStats;
  }
}

