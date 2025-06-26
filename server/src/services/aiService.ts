import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { ANIMAL_SYSTEM_PROMPT, HABITAT_RESEARCH_PROMPT, MEASUREMENTS_RESEARCH_PROMPT, CLASSIFICATION_RESEARCH_PROMPT, BASIC_INFO_RESEARCH_PROMPT } from "../utils/prompt";

export interface AIResearchResult {
  habitatData?: {
    regions: string[];
    gameAreas: string[];
    climate: string;
    ecosystem: string;
  };
  measurements?: {
    weight?: { value: number; unit: string; range?: { min: number; max: number } };
    bodyLength?: { value: number; unit: string; range?: { min: number; max: number } };
    totalLength?: { value: number; unit: string; range?: { min: number; max: number } };
    height?: { value: number; unit: string; range?: { min: number; max: number } };
    tailLength?: { value: number; unit: string; range?: { min: number; max: number } };
  };
  classification?: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  basicInfo?: {
    description: string;
    conservationStatus: string;
    animalClass: string;
  };
}
export class AiService {
  private static instance: AiService;
  private openai: OpenAI | null = null;
  private gemini: GoogleGenAI | null = null;

  private constructor() {
    // Initialize clients only when needed
  }

  public static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  private getOpenAIClient(): OpenAI {
    if (!this.openai) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY environment variable is missing");
      }
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return this.openai;
  }

  private getGeminiClient(): GoogleGenAI {
    if (!this.gemini) {
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error("GOOGLE_API_KEY environment variable is missing");
      }
      this.gemini = new GoogleGenAI({
        apiKey: process.env.GOOGLE_API_KEY,
      });
    }
    return this.gemini;
  }
  // Research animal habitat using AI
  async researchHabitat(animalName: string, scientificName: string, gameAreas: string[]): Promise<AIResearchResult['habitatData']> {
    try {
      const openai = this.getOpenAIClient();
      
      const prompt = HABITAT_RESEARCH_PROMPT(animalName, scientificName, gameAreas);
        const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: ANIMAL_SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more factual responses
        max_tokens: 1000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI service");
      }

      // Parse JSON response directly
      const habitatData = JSON.parse(content.trim());
      return habitatData;
      
    } catch (error) {
      console.error("Error in habitat research:", error);
      throw new Error(`Failed to research habitat for ${animalName}: ${error}`);
    }
  }
  // Research animal measurements using AI
  async researchMeasurements(animalName: string, scientificName: string): Promise<AIResearchResult['measurements']> {
    try {
      const openai = this.getOpenAIClient();
      
      const prompt = MEASUREMENTS_RESEARCH_PROMPT(animalName, scientificName);
        const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: ANIMAL_SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.2, // Very low temperature for precise measurements
        max_tokens: 800
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI service");
      }

      // Parse JSON response directly
      const measurementData = JSON.parse(content.trim());
      return measurementData;
      
    } catch (error) {
      console.error("Error in measurements research:", error);
      throw new Error(`Failed to research measurements for ${animalName}: ${error}`);
    }
  }

  // Research taxonomic classification
  async researchClassification(animalName: string, scientificName: string): Promise<AIResearchResult['classification']> {
    try {
      const openai = this.getOpenAIClient();
      
      const prompt = CLASSIFICATION_RESEARCH_PROMPT(animalName, scientificName);
        const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: ANIMAL_SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.1, // Very precise for taxonomic data
        max_tokens: 300
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI service");
      }

      // Parse JSON response directly
      const classificationData = JSON.parse(content.trim());
      return classificationData;
      
    } catch (error) {
      console.error("Error in classification research:", error);
      throw new Error(`Failed to research classification for ${animalName}: ${error}`);
    }
  }

  // Get basic animal information
  async researchBasicInfo(animalName: string, scientificName: string): Promise<AIResearchResult['basicInfo']> {
    try {
      const openai = this.getOpenAIClient();
      
      const prompt = BASIC_INFO_RESEARCH_PROMPT(animalName, scientificName);
        const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: ANIMAL_SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 400
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI service");
      }

      // Parse JSON response directly
      const basicInfoData = JSON.parse(content.trim());
      return basicInfoData;
      
    } catch (error) {
      console.error("Error in basic info research:", error);
      throw new Error(`Failed to research basic info for ${animalName}: ${error}`);
    }
  }




}