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

export interface MapState {
    // Canvas and rendering state
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    cursorStyle: string;
    
    // Map configuration
    mapConfig: MapConfig;
    
    // Visual state
    gridVisible: boolean;
    showSubRegions: boolean;
    showMapBoundary: boolean;
    mapImageLoaded: boolean;
    backgroundMapImage: HTMLImageElement | null;
    
    // Zoom and pan state
    zoomLevel: number;
    panX: number;
    panY: number;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
    
    // Region creation state
    isCreatingRegion: boolean;
    selectedCells: Array<{ x: number; y: number }>;
    currentRegionColor: string;
    
    // Regions data
    worldRegions: Record<string, Region>;
    subRegions: Record<string, Region>;
    oceanRegions: Record<string, Region>;
    customRegions: Record<string, CustomRegion>;
    
    // Selected region
    selectedRegion: any;
    
    // Actions
    setCanvasSize: (width: number, height: number) => void;
    setCanvas: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
    loadBackgroundMap: () => void;
    drawMap: (ctx: CanvasRenderingContext2D, zoom: number, panX: number, panY: number) => void;
    drawGrid: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mapConfig: MapConfig) => void;
    drawMapBoundary: (ctx: CanvasRenderingContext2D, mapConfig: MapConfig) => void;

    // Control actions
    resetMap: () => void;
    toggleGrid: () => void;
    toggleBackgroundMap: () => void;
    toggleSubRegions: () => void;
    toggleMapBoundary: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    centerMap: () => void;
    // showAllRegions: () => void;
    // loadRegionsFromFile: () => void;
    // saveRegionsToFile: () => void;
    // clearAllCustomRegions: () => void;
    
    // Region creation actions
    startRegionCreation: () => void;
    cancelRegionCreation: () => void;
    finishRegionCreation: (name: string) => void;
    handleCellSelection: (gridX: number, gridY: number) => void;
    
    // Mouse handling
    handleMapClick: (event: MouseEvent) => void;
    handleMouseWheel: (event: WheelEvent) => void;
    handleMouseDown: (event: MouseEvent) => void;
    handleMouseMove: (event: MouseEvent) => void;
    handleMouseUp: (event: MouseEvent) => void;
}
