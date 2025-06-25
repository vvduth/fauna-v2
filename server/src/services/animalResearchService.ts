import { AiService } from './aiService';
import { AREAS } from '../constants/areas';
import { AnimalCard, AnimalMeasurements, AnimalClassification } from '../types/animal';
import {v4 as uuidv4} from 'uuid';
/**
 * Service responsible for coordinating animal research using AI services
 * Handles the complete research workflow from data gathering to card creation
 */
export class AnimalResearchService {
  private aiService: AiService;

  constructor() {
    this.aiService = AiService.getInstance();
  }

  /**
   * Research complete animal data and create an animal card
   * @param animalName - Common name of the animal
   * @param scientificName - Scientific name (optional)
   * @returns Complete animal card with all research data
   */
  async researchCompleteAnimalData(animalName: string, scientificName?: string): Promise<AnimalCard> {
    console.log(`Starting comprehensive research for: ${animalName}`);
    
    try {
      // Use provided scientific name or empty string for AI to determine
      const scientificNameToUse = scientificName || "";
      
      // Run research tasks in parallel for efficiency
      const [basicInfo, habitatData, measurements, classification] = await Promise.all([
        this.aiService.researchBasicInfo(animalName, scientificNameToUse),
        this.aiService.researchHabitat(animalName, scientificNameToUse, AREAS),
        this.aiService.researchMeasurements(animalName, scientificNameToUse),
        this.aiService.researchClassification(animalName, scientificNameToUse)
      ]);

      // Process and validate the research results
      const processedMeasurements = this.processMeasurements(measurements);
      const mappedAreas = this.validateAndMapAreas(habitatData?.gameAreas || []);
      const gameProperties = this.determineGameProperties(mappedAreas, processedMeasurements);

      // Compile the final animal card
      const animalCard: AnimalCard = {
        id: this.generateAnimalId(animalName),
        name: animalName,
        scientificName: this.extractScientificName(classification, scientificNameToUse),
        animalClass: basicInfo?.animalClass || classification?.class || "Unknown",
        cardType: gameProperties.cardType,
        habitatAreas: mappedAreas,
        numberOfAreas: mappedAreas.length,
        measurements: processedMeasurements,
        classification: this.processClassification(classification),
        description: basicInfo?.description || "",
        conservationStatus: basicInfo?.conservationStatus || "Unknown",
        difficulty: gameProperties.difficulty
      };

      console.log(`Research completed successfully for: ${animalName}`);
      return animalCard;

    } catch (error) {
      console.error(`Error researching animal ${animalName}:`, error);
      throw new Error(`Failed to research animal: ${animalName}. ${error}`);
    }
  }

  /**
   * Research multiple animals in batch
   * @param animalRequests - Array of animal research requests
   * @returns Results and errors for batch processing
   */
  async researchMultipleAnimals(animalRequests: Array<{name: string, scientificName?: string}>): Promise<{
    results: AnimalCard[];
    errors: Array<{animal: string, error: string}>;
  }> {
    console.log(`Starting batch research for ${animalRequests.length} animals`);
    
    const results: AnimalCard[] = [];
    const errors: Array<{animal: string, error: string}> = [];

    // Process animals sequentially to avoid rate limiting
    for (const request of animalRequests) {
      try {
        const animalCard = await this.researchCompleteAnimalData(request.name, request.scientificName);
        results.push(animalCard);
        console.log(`✓ Completed research for: ${request.name}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          animal: request.name,
          error: errorMessage
        });
        console.error(`✗ Failed research for: ${request.name} - ${errorMessage}`);
      }
    }

    console.log(`Batch research completed: ${results.length} successful, ${errors.length} failed`);
    return { results, errors };
  }

  /**
   * Process and normalize measurement data from AI response
   * Maps the AI response to our AnimalMeasurements interface
   */
  private processMeasurements(measurements: any): AnimalMeasurements {
    const processed: AnimalMeasurements = {};

    // Process weight data
    if (measurements?.weight) {
      processed.weight = {
        value: measurements.weight.value,
        unit: measurements.weight.unit as 'kg' | 'g',
        range: measurements.weight.range
      };
    }

    // Process body length (head to body without tail)
    if (measurements?.bodyLength) {
      processed.length = {
        value: measurements.bodyLength.value,
        unit: measurements.bodyLength.unit as 'cm' | 'm',
        range: measurements.bodyLength.range
      };
    }

    // Process total length (including tail)
    if (measurements?.totalLength) {
      processed.totalLength = {
        value: measurements.totalLength.value,
        unit: measurements.totalLength.unit as 'cm' | 'm',
        range: measurements.totalLength.range
      };
    }

    // Process height
    if (measurements?.height) {
      processed.height = {
        value: measurements.height.value,
        unit: measurements.height.unit as 'cm' | 'm',
        range: measurements.height.range
      };
    }

    // Process tail length
    if (measurements?.tailLength) {
      processed.tailLength = {
        value: measurements.tailLength.value,
        unit: measurements.tailLength.unit as 'cm' | 'm',
        range: measurements.tailLength.range
      };
    }

    return processed;
  }

  /**
   * Validate and map researched areas to game areas
   * Ensures all returned areas are valid game areas
   */
  private validateAndMapAreas(researchedAreas: string[]): string[] {
    const validAreas: string[] = [];
    
    for (const area of researchedAreas) {
      // Find exact matches first
      const exactMatch = AREAS.find(gameArea => 
        gameArea.toLowerCase() === area.toLowerCase()
      );
      
      if (exactMatch) {
        validAreas.push(exactMatch);
        continue;
      }

      // Find partial matches using word comparison
      const partialMatch = AREAS.find(gameArea => {
        const areaWords = area.toLowerCase().split(/\s+/);
        const gameAreaWords = gameArea.toLowerCase().split(/\s+/);
        
        return areaWords.some(word => 
          gameAreaWords.some(gameWord => 
            word.includes(gameWord) || gameWord.includes(word)
          )
        );
      });

      if (partialMatch) {
        validAreas.push(partialMatch);
      }
    }

    // Remove duplicates and return
    return [...new Set(validAreas)];
  }

  /**
   * Process classification data from AI response
   * Ensures all taxonomic levels are properly formatted
   */
  private processClassification(classification: any): AnimalClassification {
    return {
      kingdom: classification?.kingdom || "Animalia",
      phylum: classification?.phylum || "Unknown",
      class: classification?.class || "Unknown",
      order: classification?.order || "Unknown",
      family: classification?.family || "Unknown",
      genus: classification?.genus || "Unknown",
      species: classification?.species || "Unknown"
    };
  }

  /**
   * Extract scientific name from classification or use provided name
   * Constructs binomial nomenclature from genus and species
   */
  private extractScientificName(classification: any, providedName: string): string {
    if (providedName) return providedName;
    
    const genus = classification?.genus;
    const species = classification?.species;
    
    if (genus && species && genus !== "Unknown" && species !== "Unknown") {
      return `${genus} ${species}`;
    }
    
    return "Unknown";
  }

  /**
   * Determine game properties based on research data
   * Sets difficulty and card type based on habitat specificity and other factors
   */
  private determineGameProperties(areas: string[], measurements: AnimalMeasurements): {
    difficulty: 'beginner' | 'intermediate' | 'expert';
    cardType: 'simple' | 'exotic';
  } {
    let difficulty: 'beginner' | 'intermediate' | 'expert' = 'beginner';
    let cardType: 'simple' | 'exotic' = 'simple';

    // Determine difficulty based on habitat specificity
    const areaCount = areas.length;
    if (areaCount <= 2) {
      // Very specific habitat = harder to guess
      difficulty = 'expert';
      cardType = 'exotic';
    } else if (areaCount <= 5) {
      // Moderate distribution
      difficulty = 'intermediate';
      cardType = Math.random() > 0.5 ? 'simple' : 'exotic';
    } else {
      // Widespread = easier to guess
      difficulty = 'beginner';
      cardType = 'simple';
    }

    // Adjust difficulty based on measurement complexity
    const measurementCount = Object.keys(measurements).length;
    if (measurementCount <= 2) {
      // Limited measurements might indicate rare/exotic animal
      if (difficulty === 'beginner') difficulty = 'intermediate';
    }

    return { difficulty, cardType };
  }

  /**
   * Generate unique ID for animal card
   * Creates URL-friendly identifier with timestamp
   */
  private generateAnimalId(animalName: string): string {
    const cleanName = uuidv4().replace(/-/g, '').toLowerCase();
    const timestamp = Date.now();
    return `${cleanName}-${timestamp}`;
  }
}
