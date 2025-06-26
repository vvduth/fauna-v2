-- Create the main animal_cards table
CREATE TABLE IF NOT EXISTS animal_cards (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255),
    animal_class VARCHAR(100),
    card_type VARCHAR(20) CHECK (card_type IN ('simple', 'exotic')),
    number_of_areas INTEGER DEFAULT 0,
    description TEXT,
    image_url VARCHAR(500),
    conservation_status VARCHAR(100),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'expert')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create habitat_areas table to store multiple areas per animal
CREATE TABLE IF NOT EXISTS habitat_areas (
    id SERIAL PRIMARY KEY,
    animal_card_id VARCHAR(255) REFERENCES animal_cards(id) ON DELETE CASCADE,
    area_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create measurements table to store physical measurements
CREATE TABLE IF NOT EXISTS measurements (
    id SERIAL PRIMARY KEY,
    animal_card_id VARCHAR(255) REFERENCES animal_cards(id) ON DELETE CASCADE,
    measurement_type VARCHAR(50) NOT NULL, -- 'weight', 'length', 'totalLength', 'height', 'tailLength'
    value DECIMAL(10,3) NOT NULL,
    unit VARCHAR(10) NOT NULL,
    min_range DECIMAL(10,3),
    max_range DECIMAL(10,3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create classification table to store taxonomic information
CREATE TABLE IF NOT EXISTS classifications (
    id SERIAL PRIMARY KEY,
    animal_card_id VARCHAR(255) REFERENCES animal_cards(id) ON DELETE CASCADE,
    kingdom VARCHAR(100),
    phylum VARCHAR(100),
    class VARCHAR(100),
    order_name VARCHAR(100), -- 'order' is a reserved word in SQL
    family VARCHAR(100),
    genus VARCHAR(100),
    species VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_animal_cards_name ON animal_cards(name);
CREATE INDEX IF NOT EXISTS idx_animal_cards_animal_class ON animal_cards(animal_class);
CREATE INDEX IF NOT EXISTS idx_animal_cards_card_type ON animal_cards(card_type);
CREATE INDEX IF NOT EXISTS idx_animal_cards_difficulty ON animal_cards(difficulty);
CREATE INDEX IF NOT EXISTS idx_habitat_areas_animal_id ON habitat_areas(animal_card_id);
CREATE INDEX IF NOT EXISTS idx_measurements_animal_id ON measurements(animal_card_id);
CREATE INDEX IF NOT EXISTS idx_classifications_animal_id ON classifications(animal_card_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_animal_cards_updated_at 
    BEFORE UPDATE ON animal_cards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
