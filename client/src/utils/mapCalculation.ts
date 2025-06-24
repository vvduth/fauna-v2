// This file contains utility functions for performing calculations related to the map, such as cell dimensions and boundaries.

export const calculateCellDimensions = (canvasWidth: number, canvasHeight: number, gridWidth: number, gridHeight: number) => {
    const cellWidth = canvasWidth / gridWidth;
    const cellHeight = canvasHeight / gridHeight;
    return { cellWidth, cellHeight };
};

export const calculateMapBounds = (mapConfig: { mapLeft: number; mapRight: number; mapTop: number; mapBottom: number; }, cellWidth: number, cellHeight: number) => {
    const leftX = mapConfig.mapLeft * cellWidth;
    const rightX = mapConfig.mapRight * cellWidth;
    const topY = mapConfig.mapTop * cellHeight;
    const bottomY = mapConfig.mapBottom * cellHeight;

    return { leftX, rightX, topY, bottomY };
};

export const isWithinMapBounds = (gridX: number, gridY: number, mapConfig: { mapLeft: number; mapRight: number; mapTop: number; mapBottom: number; }) => {
    return gridX >= mapConfig.mapLeft && gridX <= mapConfig.mapRight && gridY >= mapConfig.mapTop && gridY <= mapConfig.mapBottom;
};