export const MAP_CONFIG = {
    gridWidth: 74 * 2,  // Horizontal grid count (1-74) - full board width
    gridHeight: 50 * 2, // Vertical grid count (A-AX) - full board height
    cellWidth: 0,   // Calculated based on canvas size
    cellHeight: 0,  // Calculated based on canvas size
    // Actual world map boundaries:
    mapLeft: 6,     // Left boundary of world map (column 6)
    mapRight: 150,   // Right boundary of world map (column 69)
    mapTop: 5,      // Top boundary of world map (row E = 5)
    mapBottom: 35   // Bottom boundary of world map (row AI = 35)
};