// Types for the map configuration and regions
export interface MapConfig {
    gridWidth: number;
    gridHeight: number;
    cellWidth: number;
    cellHeight: number;
    mapLeft: number;
    mapRight: number;
    mapTop: number;
    mapBottom: number;
}

export interface Region {
    zones: Array<{ x: number; y: number; width: number; height: number }>;
    color: string;
    label: string;
}

export interface CustomRegion {
    name: string;
    color: string;
    cells: Array<{ x: number; y: number }>;
    cellCount: number;
    components: number;
    created: string;
    bounds?: any;
}

