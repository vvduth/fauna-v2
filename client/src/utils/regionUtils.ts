// src/utils/regionUtils.ts
import { type Region } from "../types/region";
// Function to find connected cells in a region
export function findConnectedCells(cells: { x: number; y: number }[]): { x: number; y: number }[][] {
    if (cells.length === 0) return [];

    const visited = new Set<string>();
    const components: { x: number; y: number }[][] = [];

    const queue: { x: number; y: number }[] = [cells[0]];

    while (queue.length > 0) {
        const cell = queue.shift()!;
        const key = `${cell.x},${cell.y}`;

        if (visited.has(key)) continue;
        visited.add(key);

        let component: { x: number; y: number }[] = [cell];

        const neighbors = getNeighbors(cell, cells);
        for (const neighbor of neighbors) {
            if (!visited.has(`${neighbor.x},${neighbor.y}`)) {
                queue.push(neighbor);
                component.push(neighbor);
            }
        }

        components.push(component);
    }

    return components;
}

// Function to get neighboring cells
function getNeighbors(cell: { x: number; y: number }, cells: { x: number; y: number }[]): { x: number; y: number }[] {
    const directions = [
        { x: 1, y: 0 }, { x: -1, y: 0 },
        { x: 0, y: 1 }, { x: 0, y: -1 }
    ];

    return directions
        .map(dir => ({ x: cell.x + dir.x, y: cell.y + dir.y }))
        .filter(neighbor => cells.some(c => c.x === neighbor.x && c.y === neighbor.y));
}

// Function to calculate the bounding box of a set of cells
export function calculateRegionBounds(cells: { x: number; y: number }[]): { minX: number; maxX: number; minY: number; maxY: number; width: number; height: number; centerX: number; centerY: number } {
    if (cells.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0, centerX: 0, centerY: 0 };

    let minX = cells[0].x;
    let maxX = cells[0].x;
    let minY = cells[0].y;
    let maxY = cells[0].y;

    cells.forEach(cell => {
        if (cell.x < minX) minX = cell.x;
        if (cell.x > maxX) maxX = cell.x;
        if (cell.y < minY) minY = cell.y;
        if (cell.y > maxY) maxY = cell.y;
    });

    return {
        minX,
        maxX,
        minY,
        maxY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2
    };
}

// Function to create a new region
export function createRegion(name: string, color: string, cells: { x: number; y: number }[]): Region {
    return {
        name,
        color,
        cells,
        cellCount: cells.length,
        created: new Date().toISOString(),
        bounds: calculateRegionBounds(cells)
    };
}