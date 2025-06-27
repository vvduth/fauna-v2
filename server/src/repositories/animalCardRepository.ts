import { Pool } from 'pg';
import { DatabaseConfig } from '../config/database';
import { AnimalCard, AnimalMeasurements, AnimalClassification } from '../types/animal';

/**
 * Database repository for animal cards
 * Handles all CRUD operations for animal data in PostgreSQL
 */
export class AnimalCardRepository {
  private pool: Pool;

  constructor() {
    this.pool = DatabaseConfig.getInstance().getPool();
  }

  /**
   * Save a complete animal card to the database
   * @param animalCard - The animal card to save
   * @returns Promise<string> - The ID of the saved card
   */
  async saveAnimalCard(animalCard: AnimalCard): Promise<string> {
    const client = await this.pool.connect();
    
    try {
      // Start transaction
      await client.query('BEGIN');

      // Insert main animal card data
      const cardQuery = `
        INSERT INTO animal_cards (
          id, name, scientific_name, animal_class, card_type,
          number_of_areas, description, image_url, conservation_status, difficulty
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          scientific_name = EXCLUDED.scientific_name,
          animal_class = EXCLUDED.animal_class,
          card_type = EXCLUDED.card_type,
          number_of_areas = EXCLUDED.number_of_areas,
          description = EXCLUDED.description,
          image_url = EXCLUDED.image_url,
          conservation_status = EXCLUDED.conservation_status,
          difficulty = EXCLUDED.difficulty,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `;

      const cardResult = await client.query(cardQuery, [
        animalCard.id,
        animalCard.name,
        animalCard.scientificName,
        animalCard.animalClass,
        animalCard.cardType,
        animalCard.numberOfAreas,
        animalCard.description || null,
        animalCard.imageUrl || null,
        animalCard.conservationStatus || null,
        animalCard.difficulty
      ]);

      const savedCardId = cardResult.rows[0].id;

      // Delete existing related data to avoid duplicates
      await client.query('DELETE FROM habitat_areas WHERE animal_card_id = $1', [savedCardId]);
      await client.query('DELETE FROM measurements WHERE animal_card_id = $1', [savedCardId]);
      await client.query('DELETE FROM classifications WHERE animal_card_id = $1', [savedCardId]);

      // Insert habitat areas
      if (animalCard.habitatAreas && animalCard.habitatAreas.length > 0) {
        for (const area of animalCard.habitatAreas) {
          await client.query(
            'INSERT INTO habitat_areas (animal_card_id, area_name) VALUES ($1, $2)',
            [savedCardId, area]
          );
        }
      }

      // Insert measurements
      await this.saveMeasurements(client, savedCardId, animalCard.measurements);

      // Insert classification
      await this.saveClassification(client, savedCardId, animalCard.classification);

      // Commit transaction
      await client.query('COMMIT');
      
      console.log(`✅ Animal card saved to database: ${animalCard.name} (ID: ${savedCardId})`);
      return savedCardId;

    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      console.error('Error saving animal card to database:', error);
      throw new Error(`Failed to save animal card: ${error}`);
    } finally {
      client.release();
    }
  }

  /**
   * Save measurements data to database
   */
  private async saveMeasurements(client: any, cardId: string, measurements: AnimalMeasurements): Promise<void> {
    const measurementTypes = [
      { type: 'weight', data: measurements.weight },
      { type: 'length', data: measurements.length },
      { type: 'totalLength', data: measurements.totalLength },
      { type: 'height', data: measurements.height },
      { type: 'tailLength', data: measurements.tailLength }
    ];

    for (const measurement of measurementTypes) {
      if (measurement.data) {
        await client.query(
          `INSERT INTO measurements (animal_card_id, measurement_type, value, unit, min_range, max_range)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            cardId,
            measurement.type,
            measurement.data.value,
            measurement.data.unit,
            measurement.data.range?.min || null,
            measurement.data.range?.max || null
          ]
        );
      }
    }
  }

  /**
   * Save classification data to database
   */
  private async saveClassification(client: any, cardId: string, classification: AnimalClassification): Promise<void> {
    await client.query(
      `INSERT INTO classifications (animal_card_id, kingdom, phylum, class, order_name, family, genus, species)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        cardId,
        classification.kingdom,
        classification.phylum,
        classification.class,
        classification.order,
        classification.family,
        classification.genus,
        classification.species
      ]
    );
  }

  /**
   * Get all animal cards from database
   * @param filters - Optional filters for querying
   * @returns Promise<AnimalCard[]>
   */
  async getAllAnimalCards(filters?: {
    cardType?: string;
    difficulty?: string;
    animalClass?: string;
    limit?: number;
    offset?: number;
  }): Promise<AnimalCard[]> {
    try {
      let query = 'SELECT * FROM animal_cards WHERE 1=1';
      const values: any[] = [];
      let valueIndex = 1;

      // Apply filters
      if (filters?.cardType) {
        query += ` AND card_type = $${valueIndex}`;
        values.push(filters.cardType);
        valueIndex++;
      }

      if (filters?.difficulty) {
        query += ` AND difficulty = $${valueIndex}`;
        values.push(filters.difficulty);
        valueIndex++;
      }

      if (filters?.animalClass) {
        query += ` AND animal_class ILIKE $${valueIndex}`;
        values.push(`%${filters.animalClass}%`);
        valueIndex++;
      }

      // Add pagination
      if (filters?.limit) {
        query += ` LIMIT $${valueIndex}`;
        values.push(filters.limit);
        valueIndex++;
      }

      if (filters?.offset) {
        query += ` OFFSET $${valueIndex}`;
        values.push(filters.offset);
        valueIndex++;
      }

      query += ' ORDER BY created_at DESC';

      const result = await this.pool.query(query, values);
      
      // Get complete animal cards with related data
      const animalCards: AnimalCard[] = [];
      for (const row of result.rows) {
        const completeCard = await this.buildCompleteAnimalCard(row);
        animalCards.push(completeCard);
      }

      return animalCards;
    } catch (error) {
      console.error('Error getting animal cards from database:', error);
      throw new Error(`Failed to get animal cards: ${error}`);
    }
  }

  /**
   * Get animal card by ID
   * @param id - The card ID
   * @returns Promise<AnimalCard | null>
   */
  async getAnimalCardById(id: string): Promise<AnimalCard | null> {
    try {
      const result = await this.pool.query('SELECT * FROM animal_cards WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return await this.buildCompleteAnimalCard(result.rows[0]);
    } catch (error) {
      console.error('Error getting animal card by ID:', error);
      throw new Error(`Failed to get animal card: ${error}`);
    }
  }

  /**
   * Get a random animal card
   * @returns Promise<AnimalCard | null>
   */

  async getRandomAnimalCard(): Promise<AnimalCard | null> {
    try {
      const result = await this.pool.query('SELECT * FROM animal_cards ORDER BY RANDOM() LIMIT 1');
      
      if (result.rows.length === 0) {
        return null;
      }

      return await this.buildCompleteAnimalCard(result.rows[0]);
    } catch (error) {
      console.error('Error getting random animal card:', error);
      throw new Error(`Failed to get random animal card: ${error}`);
    }
  }

  async updateImageUrl(id: string, imageUrl: string): Promise<boolean> {
    try {
      const result = await this.pool.query(
        'UPDATE animal_cards SET image_url = $1 WHERE id = $2 RETURNING id',
        [imageUrl, id]
      );

      if (result.rowCount === 0) {
        return false; // No rows updated, card not found
      }

      console.log(`✅ Updated image URL for card ID: ${id}`);
      return true;
    } catch (error) {
      console.error('Error updating image URL:', error);
      throw new Error(`Failed to update image URL: ${error}`);
    }
  }

  /**
   * Get all animal card IDs and scientific names
   * @returns Promise<{ id: string, scientificName: string }[]>
   */
  async getAllAnimalCardIds(): Promise<{ id: string, scientificName: string }[]> {
    try {
      const result = await this.pool.query('SELECT id, scientific_name FROM animal_cards');
      return result.rows.map(row => ({
        id: row.id,
        scientificName: row.scientific_name
      }));
    } catch (error) {
      console.error('Error getting all animal card IDs:', error);
      throw new Error(`Failed to get animal card IDs: ${error}`);
    }
  }

  /**
   * Build complete animal card with all related data
   */
  private async buildCompleteAnimalCard(cardRow: any): Promise<AnimalCard> {
    // Get habitat areas
    const habitatResult = await this.pool.query(
      'SELECT area_name FROM habitat_areas WHERE animal_card_id = $1',
      [cardRow.id]
    );
    const habitatAreas = habitatResult.rows.map(row => row.area_name);

    // Get measurements
    const measurementsResult = await this.pool.query(
      'SELECT * FROM measurements WHERE animal_card_id = $1',
      [cardRow.id]
    );
    const measurements = this.buildMeasurementsObject(measurementsResult.rows);

    // Get classification
    const classificationResult = await this.pool.query(
      'SELECT * FROM classifications WHERE animal_card_id = $1',
      [cardRow.id]
    );
    const classification = this.buildClassificationObject(classificationResult.rows[0] || {});

    return {
      id: cardRow.id,
      name: cardRow.name,
      scientificName: cardRow.scientific_name,
      animalClass: cardRow.animal_class,
      cardType: cardRow.card_type,
      habitatAreas,
      numberOfAreas: cardRow.number_of_areas,
      measurements,
      classification,
      description: cardRow.description,
      imageUrl: cardRow.image_url,
      conservationStatus: cardRow.conservation_status,
      difficulty: cardRow.difficulty
    };
  }

  /**
   * Build measurements object from database rows
   */
  private buildMeasurementsObject(measurementRows: any[]): AnimalMeasurements {
    const measurements: AnimalMeasurements = {};

    measurementRows.forEach(row => {
      const measurement = {
        value: parseFloat(row.value),
        unit: row.unit,
        ...(row.min_range && row.max_range && {
          range: {
            min: parseFloat(row.min_range),
            max: parseFloat(row.max_range)
          }
        })
      };

      switch (row.measurement_type) {
        case 'weight':
          measurements.weight = measurement;
          break;
        case 'length':
          measurements.length = measurement;
          break;
        case 'totalLength':
          measurements.totalLength = measurement;
          break;
        case 'height':
          measurements.height = measurement;
          break;
        case 'tailLength':
          measurements.tailLength = measurement;
          break;
      }
    });

    return measurements;
  }

  /**
   * Build classification object from database row
   */
  private buildClassificationObject(classificationRow: any): AnimalClassification {
    return {
      kingdom: classificationRow.kingdom || 'Unknown',
      phylum: classificationRow.phylum || 'Unknown',
      class: classificationRow.class || 'Unknown',
      order: classificationRow.order_name || 'Unknown',
      family: classificationRow.family || 'Unknown',
      genus: classificationRow.genus || 'Unknown',
      species: classificationRow.species || 'Unknown'
    };
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<any> {
    try {
      const totalCards = await this.pool.query('SELECT COUNT(*) as count FROM animal_cards');
      
      const cardTypes = await this.pool.query(`
        SELECT card_type, COUNT(*) as count 
        FROM animal_cards 
        GROUP BY card_type
      `);

      const difficulties = await this.pool.query(`
        SELECT difficulty, COUNT(*) as count 
        FROM animal_cards 
        GROUP BY difficulty
      `);

      const animalClasses = await this.pool.query(`
        SELECT animal_class, COUNT(*) as count 
        FROM animal_cards 
        GROUP BY animal_class
      `);

      const avgAreas = await this.pool.query(`
        SELECT AVG(number_of_areas) as avg_areas 
        FROM animal_cards
      `);

      return {
        totalCards: parseInt(totalCards.rows[0].count),
        cardTypes: cardTypes.rows.reduce((acc, row) => {
          acc[row.card_type] = parseInt(row.count);
          return acc;
        }, {}),
        difficulties: difficulties.rows.reduce((acc, row) => {
          acc[row.difficulty] = parseInt(row.count);
          return acc;
        }, {}),
        animalClasses: animalClasses.rows.reduce((acc, row) => {
          acc[row.animal_class] = parseInt(row.count);
          return acc;
        }, {}),
        averageAreasPerCard: parseFloat(avgAreas.rows[0].avg_areas || '0').toFixed(1)
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      throw new Error(`Failed to get database stats: ${error}`);
    }
  }

  /**
   * Delete animal card by ID
   */
  async deleteAnimalCard(id: string): Promise<boolean> {    try {
      const result = await this.pool.query('DELETE FROM animal_cards WHERE id = $1', [id]);
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Error deleting animal card:', error);
      throw new Error(`Failed to delete animal card: ${error}`);
    }
  }
}
