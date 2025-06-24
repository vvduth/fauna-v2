// src/types/game.ts
export interface GameState {
    zoomLevel: number;
    panX: number;
    panY: number;
    gridVisible: boolean;
    showSubRegions: boolean;
    showMapBoundary: boolean;
    selectedRegion: string | null;
    customRegions: Record<string, CustomRegion>;
}

export interface CustomRegion {
    name: string;
    color: string;
    cells: Cell[];
    cellCount: number;
    components: number;
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