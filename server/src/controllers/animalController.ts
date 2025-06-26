import { Request, Response } from 'express';
import { AnimalResearchService } from '../services/animalResearchService';
import { AnimalCardRepository } from '../repositories/animalCardRepository';
import { AnimalCard } from '../types/animal';

// Database repository for persistent storage
const animalRepository = new AnimalCardRepository();

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

      console.log(`Research request received for: ${animalName}`);      // Research the animal using the service
      const animalCard = await this.researchService.researchCompleteAnimalData(
        animalName, 
        scientificName
      );

      // Save the researched card to database
      await animalRepository.saveAnimalCard(animalCard);

      // Get updated total count from database
      const stats = await animalRepository.getStats();

      // Return success response with created card
      res.status(201).json({
        success: true,
        message: `Successfully researched ${animalName}`,
        data: {
          animalCard: animalCard,
          totalCards: stats.totalCards
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
      const { cardType, difficulty, animalClass, limit, offset } = req.query;

      // Build filters object
      const filters: any = {};
      
      if (cardType && (cardType === 'simple' || cardType === 'exotic')) {
        filters.cardType = cardType as string;
      }

      if (difficulty && ['beginner', 'intermediate', 'expert'].includes(difficulty as string)) {
        filters.difficulty = difficulty as string;
      }

      if (animalClass && typeof animalClass === 'string') {
        filters.animalClass = animalClass;
      }

      if (limit && !isNaN(Number(limit))) {
        filters.limit = Number(limit);
      }

      if (offset && !isNaN(Number(offset))) {
        filters.offset = Number(offset);
      }

      // Get filtered cards from database
      const filteredCards = await animalRepository.getAllAnimalCards(filters);

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

      console.log(`Batch research request for ${animals.length} animals`);      // Research all animals using the service
      const { results, errors } = await this.researchService.researchMultipleAnimals(animals);

      // Save successful results to database
      for (const animalCard of results) {
        await animalRepository.saveAnimalCard(animalCard);
      }

      // Get updated total count from database
      const stats = await animalRepository.getStats();

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
          totalCardsInDatabase: stats.totalCards
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

      const card = await animalRepository.getAnimalCardById(id);

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

      const filteredCards = await animalRepository.getAllAnimalCards({ difficulty: level });

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

      const filteredCards = await animalRepository.getAllAnimalCards({ cardType });

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
      const stats = await animalRepository.getStats();

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
}

