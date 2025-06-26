import fs from 'fs';
import path from 'path';
import { DatabaseConfig } from '../config/database';

/**
 * Database migration runner
 * Handles execution of SQL migration files
 */
export class MigrationRunner {
  private db: DatabaseConfig;

  constructor() {
    this.db = DatabaseConfig.getInstance();
  }

  /**
   * Run all pending migrations
   */
  async runMigrations(): Promise<void> {
    try {
      console.log('🔄 Running database migrations...');

      // Create migrations table if it doesn't exist
      await this.createMigrationsTable();

      // Get migration files
      const migrationsDir = path.join(__dirname, '../database/migrations');
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();

      // Run each migration
      for (const file of migrationFiles) {
        await this.runMigration(file, migrationsDir);
      }

      console.log('✅ All migrations completed successfully');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  /**
   * Create migrations tracking table
   */
  private async createMigrationsTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await this.db.getPool().query(query);
  }

  /**
   * Run a single migration file
   */
  private async runMigration(filename: string, migrationsDir: string): Promise<void> {
    const pool = this.db.getPool();
    
    // Check if migration was already executed
    const checkResult = await pool.query(
      'SELECT id FROM migrations WHERE filename = $1',
      [filename]
    );

    if (checkResult.rows.length > 0) {
      console.log(`⏭️  Skipping migration: ${filename} (already executed)`);
      return;
    }

    // Read and execute migration file
    const migrationPath = path.join(migrationsDir, filename);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Execute migration SQL
      await client.query(migrationSQL);
      
      // Record migration as executed
      await client.query(
        'INSERT INTO migrations (filename) VALUES ($1)',
        [filename]
      );
      
      await client.query('COMMIT');
      console.log(`✅ Executed migration: ${filename}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Failed to execute migration ${filename}: ${error}`);
    } finally {
      client.release();
    }
  }

  /**
   * Check database connection and setup
   */
  async checkDatabaseSetup(): Promise<boolean> {
    try {
      const isConnected = await this.db.testConnection();
      if (!isConnected) {
        console.error('❌ Cannot connect to database. Please check your connection settings.');
        return false;
      }

      await this.runMigrations();
      return true;
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      return false;
    }
  }
}
