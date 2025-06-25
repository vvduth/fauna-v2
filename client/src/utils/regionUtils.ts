import { type CustomRegion } from "../types/game";


type GridCell = {    x: number;
    y: number;}
/**
 * Check if two grid cells are adjacent (share a side, not diagonal)
 * Two cells are adjacent if they differ by 1 in exactly one coordinate
 */
export const areCellsAdjacent = (cell1: GridCell, cell2: GridCell): boolean => {
    const deltaX = Math.abs(cell1.x - cell2.x);
    const deltaY = Math.abs(cell1.y - cell2.y);
    
    // Adjacent cells share a side: either deltaX = 1 and deltaY = 0, or deltaX = 0 and deltaY = 1
    return (deltaX === 1 && deltaY === 0) || (deltaX === 0 && deltaY === 1);
};

/**
 * Check if two grid cells are adjacent including diagonal neighbors
 * Two cells are diagonal neighbors if they differ by 1 in both coordinates
 */
export const areCellsAdjacentWithDiagonal = (cell1: GridCell, cell2: GridCell): boolean => {
    const deltaX = Math.abs(cell1.x - cell2.x);
    const deltaY = Math.abs(cell1.y - cell2.y);
    
    // Adjacent cells (including diagonal): both deltas must be 0 or 1, and at least one must be 1
    return deltaX <= 1 && deltaY <= 1 && (deltaX === 1 || deltaY === 1);
};

/**
 * Check if two CustomRegions are adjacent to each other
 * Returns true if any cell from region1 is adjacent to any cell from region2
 * @param region1 - First region to check
 * @param region2 - Second region to check
 * @param includeDiagonal - Whether to include diagonal adjacency (default: false)
 * @returns boolean indicating if the regions are adjacent
 */
export const areRegionsAdjacent = (
    region1: CustomRegion, 
    region2: CustomRegion, 
    includeDiagonal: boolean = false
): boolean => {
    // Early exit if either region has no cells
    if (!region1.cells || !region2.cells || region1.cells.length === 0 || region2.cells.length === 0) {
        return false;
    }
    
    // Choose the appropriate adjacency function
    const adjacencyCheck = includeDiagonal ? areCellsAdjacentWithDiagonal : areCellsAdjacent;
    
    // Check if any cell from region1 is adjacent to any cell from region2
    for (const cell1 of region1.cells) {
        for (const cell2 of region2.cells) {
            if (adjacencyCheck(cell1, cell2)) {
                return true;
            }
        }
    }
    
    return false;
};

/**
 * Get all regions that are adjacent to a given region
 * @param targetRegion - The region to find neighbors for
 * @param allRegions - Object containing all regions to check against
 * @param includeDiagonal - Whether to include diagonal adjacency (default: false)
 * @returns Array of region names that are adjacent to the target region
 */
export const getAdjacentRegions = (
    targetRegion: CustomRegion,
    allRegions: Record<string, CustomRegion>,
    includeDiagonal: boolean = false
): string[] => {
    const adjacentRegions: string[] = [];
    
    for (const [regionName, region] of Object.entries(allRegions)) {
        // Skip comparing region with itself
        if (region === targetRegion || regionName === targetRegion.name) {
            continue;
        }
        
        if (areRegionsAdjacent(targetRegion, region, includeDiagonal)) {
            adjacentRegions.push(regionName);
        }
    }
    
    return adjacentRegions;
};

/**
 * Optimized version for large regions using spatial indexing
 * Creates a set of cell coordinates for faster lookup
 */
export const areRegionsAdjacentOptimized = (
    region1: CustomRegion, 
    region2: CustomRegion, 
    includeDiagonal: boolean = false
): boolean => {
    // Early exit if either region has no cells
    if (!region1.cells || !region2.cells || region1.cells.length === 0 || region2.cells.length === 0) {
        return false;
    }
    
    // Create a set of coordinates for region2 for O(1) lookup
    const region2CellSet = new Set<string>();
    for (const cell of region2.cells) {
        region2CellSet.add(`${cell.x},${cell.y}`);
    }
    
    // For each cell in region1, check if any adjacent position exists in region2
    for (const cell1 of region1.cells) {
        const neighbors = includeDiagonal ? 
            getNeighborCoordinatesWithDiagonal(cell1) : 
            getNeighborCoordinates(cell1);
            
        for (const neighbor of neighbors) {
            if (region2CellSet.has(`${neighbor.x},${neighbor.y}`)) {
                return true;
            }
        }
    }
    
    return false;
};

/**
 * Get all adjacent cell coordinates (4-directional)
 */
export const getNeighborCoordinates = (cell: GridCell): GridCell[] => {
    return [
        { x: cell.x - 1, y: cell.y },     // Left
        { x: cell.x + 1, y: cell.y },     // Right
        { x: cell.x, y: cell.y - 1 },     // Up
        { x: cell.x, y: cell.y + 1 }      // Down
    ];
};

/**
 * Get all adjacent cell coordinates including diagonal (8-directional)
 */
export const getNeighborCoordinatesWithDiagonal = (cell: GridCell): GridCell[] => {
    return [
        { x: cell.x - 1, y: cell.y - 1 }, // Top-left
        { x: cell.x, y: cell.y - 1 },     // Top
        { x: cell.x + 1, y: cell.y - 1 }, // Top-right
        { x: cell.x - 1, y: cell.y },     // Left
        { x: cell.x + 1, y: cell.y },     // Right
        { x: cell.x - 1, y: cell.y + 1 }, // Bottom-left
        { x: cell.x, y: cell.y + 1 },     // Bottom
        { x: cell.x + 1, y: cell.y + 1 }  // Bottom-right
    ];
};