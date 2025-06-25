// Animal data structure for the game cards
export interface AnimalMeasurements {
  weight?: {
    value: number;
    unit: 'kg' | 'g';
    range?: { min: number; max: number };
  };
  length?: {
    value: number;
    unit: 'cm' | 'm';
    range?: { min: number; max: number };
  };
  totalLength?: {
    value: number;
    unit: 'cm' | 'm';
    range?: { min: number; max: number };
  };
  height?: {
    value: number;
    unit: 'cm' | 'm';
    range?: { min: number; max: number };
  };
  tailLength?: {
    value: number;
    unit: 'cm' | 'm';
    range?: { min: number; max: number };
  };
}

export interface AnimalClassification {
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
}

export interface AnimalCard {
  id: string;
  name: string;
  scientificName: string;
  animalClass: string; // Mammal, Bird, Reptile, etc.
  cardType: 'simple' | 'exotic'; // green or black card margin
  
  // Habitat information
  habitatAreas: string[]; // Areas from your AREAS constant
  numberOfAreas: number;
  
  // Physical measurements (average values)
  measurements: AnimalMeasurements;
  
  // Zoological classification
  classification: AnimalClassification;
  
  // Additional game data
  description?: string;
  imageUrl?: string;
  conservationStatus?: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
}