// src/types/regions.ts
export interface Region {
    name: string;
    color: string;
    cells: Cell[];
    cellCount: number;
    components?: number;
    created: string;
    bounds: RegionBounds;
}

export interface Cell {
    x: number;
    y: number;
}

export interface RegionBounds {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
}