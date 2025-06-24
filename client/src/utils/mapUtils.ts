import { MAP_CONFIG } from "../constants/mapConfig";

// Add helper function to convert grid index to letter (A, B, C, etc.)
export const getGridLetter = (index: number): string => {
  // For high-resolution grids, use different labeling systems based on grid size
    
    // Option 1: Use numbers for y-axis when grid is large (recommended for 100+ rows)
    if (MAP_CONFIG.gridHeight > 50) {
        return index.toString(); // Simple numeric labels: 1, 2, 3, etc.
    }
    
    // Option 2: Use hybrid system - numbers with letter prefix for grouping
    // Uncomment this block if you prefer grouped numeric labels
    /*
    if (MAP_CONFIG.gridHeight > 50) {
        const group = Math.floor((index - 1) / 10); // Groups of 10
        const subIndex = ((index - 1) % 10) + 1;
        const groupLetter = String.fromCharCode(65 + group); // A, B, C, etc.
        return `${groupLetter}${subIndex}`; // A1, A2, ..., A10, B1, B2, etc.
    }
    */
    
    // Option 3: Traditional letter system for smaller grids (original behavior)
    if (index <= 26) {
        return String.fromCharCode(64 + index); // A-Z
    } else {
        // For indices > 26, use AA, AB, AC, etc.
        const firstLetter = 'A';
        const secondLetter = String.fromCharCode(64 + (index - 26));
        return firstLetter + secondLetter;
    }
};
