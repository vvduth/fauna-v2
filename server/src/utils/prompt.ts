export const ANIMAL_SYSTEM_PROMPT = `
You are an expert zoologist and animal researcher. 
Your task is to provide structured data for animals in JSON format.

CRITICAL REQUIREMENTS:
- Return ONLY valid JSON objects that match the provided schemas
- Never include explanations, comments, or extra text
- If data is uncertain, make reasonable scientific inferences
- Use metric units exclusively
- Focus on wild adult populations
- Use current scientific nomenclature

RESPONSE FORMAT:
Return strictly the JSON object with no additional text, markdown formatting, or explanations.
`;

export const HABITAT_RESEARCH_PROMPT = (animalName: string, scientificName: string, gameAreas: string[]) => `
Research the natural habitat of the ${animalName} (${scientificName}).

Answer the following questions:
${constructHabitatQuestion(animalName, scientificName, gameAreas)}

Return the answer as JSON following **exactly** this schema:

{
  "regions": ["string array of real-world natural regions where the animal lives"],
  "gameAreas": ["string array of game areas from the above list where the animal can naturally be found"],
  "climate": "string summarizing the animal's typical climate (e.g., temperate, tropical, arid)",
  "ecosystem": "string summarizing the animal's primary ecosystem (e.g., forest, grassland, desert)"
}

Requirements:
- The "gameAreas" array must only include areas from the provided list that match the animal's real-world habitat.
- Base your answer on biological accuracy.
- Be specific and avoid guessing.
`;

function constructHabitatQuestion(animalName: string, scientificName: string, gameAreas: string[]): string {
    let questions = ''
    gameAreas.forEach(area => {
        questions += `- Can the ${animalName} (${scientificName}) naturally be found in ${area} based on its real-world habitat?\n`;
    });
    return questions;

}
export const MEASUREMENTS_RESEARCH_PROMPT = (animalName: string, scientificName: string) => `
Research physical measurements for ${animalName} (${scientificName}).

Return JSON matching this exact schema:
{
  "weight": {
    "value": number,
    "unit": "kg" or "g",
    "range": {"min": number, "max": number}
  },
  "bodyLength": {
    "value": number,
    "unit": "cm" or "m", 
    "range": {"min": number, "max": number}
  },
  "totalLength": {
    "value": number,
    "unit": "cm" or "m",
    "range": {"min": number, "max": number}
  },
  "height": {
    "value": number,
    "unit": "cm" or "m",
    "range": {"min": number, "max": number}
  },
  "tailLength": {
    "value": number,
    "unit": "cm" or "m", 
    "range": {"min": number, "max": number}
  }
}

Measurements:
- weight: adult body weight
- bodyLength: head to body without tail
- totalLength: complete length including tail
- height: shoulder height for quadrupeds, total height for bipeds
- tailLength: tail only, base to tip

Use metric units. Include ranges for natural variation.
`;

export const CLASSIFICATION_RESEARCH_PROMPT = (animalName: string, scientificName: string) => `
Research taxonomic classification for ${animalName} (${scientificName}).

Return JSON matching this exact schema:
{
  "kingdom": "string",
  "phylum": "string", 
  "class": "string",
  "order": "string",
  "family": "string",
  "genus": "string",
  "species": "string"
}

Use current accepted scientific nomenclature.
`;

export const BASIC_INFO_RESEARCH_PROMPT = (animalName: string, scientificName: string) => `
Research basic information for ${animalName} (${scientificName}).

Return JSON matching this exact schema:
{
  "description": "string - brief description highlighting key characteristics",
  "conservationStatus": "string - IUCN Red List category",
  "animalClass": "string - Mammal, Bird, Reptile, Amphibian, Fish, or Invertebrate"
}

Keep description concise but informative about distinctive features.
`;

