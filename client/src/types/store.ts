// Store-specific type definitions for Zustand state management
import type { MapConfig, CustomRegion, ClaimedRegion } from './game';

// Main state interface for the map store
export interface MapState {
    // Canvas and rendering state
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    cursorStyle: string;
    
    // Map configuration
    mapConfig: MapConfig;
    
    // Visual state toggles
    gridVisible: boolean;
    showSubRegions: boolean;
    showMapBoundary: boolean;
    mapImageLoaded: boolean;
    backgroundMapImage: HTMLImageElement | null;
    
    // Zoom and pan state for map navigation
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
    
    // Regions data storage
    worldRegions: Record<string, Region>;
    subRegions: Record<string, Region>;
    oceanRegions: Record<string, Region>;
    customRegions: Record<string, CustomRegion>;
    claimRegions: ClaimedRegion[];
    
    // Currently selected region
    selectedRegion: any;
    
    // Add region interaction state
    hoveredRegion: CustomRegion | null;
    clickedRegionInfo: string;
    
    // Canvas management actions
    setCanvasSize: (width: number, height: number) => void;
    setCanvas: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
    loadBackgroundMap: () => void;
    
    // Drawing functions
    drawMap: (ctx: CanvasRenderingContext2D, zoom: number, panX: number, panY: number) => void;
    drawGrid: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mapConfig: MapConfig) => void;
    drawMapBoundary: (ctx: CanvasRenderingContext2D, mapConfig: MapConfig) => void;
    drawSelectedCells: (ctx: CanvasRenderingContext2D) => void;
    drawCustomRegion: (ctx: CanvasRenderingContext2D, region: CustomRegion) => void;
    drawClaimedRegion : (ctx: CanvasRenderingContext2D, region: CustomRegion, playerColor: string) => void;
    
    
    // Control actions for map interaction
    resetMap: () => void;
    toggleGrid: () => void;
    toggleBackgroundMap: () => void;
    toggleSubRegions: () => void;
    toggleMapBoundary: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    centerMap: () => void;
    
    // Region creation and management actions
    startRegionCreation: () => void;
    cancelRegionCreation: () => void;
    finishRegionCreation: (name: string) => void;
    handleCellSelection: (gridX: number, gridY: number) => void;
    saveRegionsToFile: () => void;
    loadRegionsFromFile: (file: File) => void;
    setClaimedRegions: (regions: ClaimedRegion[]) => void;
    
    // Region interaction actions
    handleRegionClick: (gridX: number, gridY: number) => CustomRegion | null;
    setClickedRegionInfo: (info: string) => void;
    
    // Mouse event handling
    handleMapClick: (event: MouseEvent) => void;
    handleMouseWheel: (event: WheelEvent) => void;
    handleMouseDown: (event: MouseEvent) => void;
    handleMouseMove: (event: MouseEvent) => void;
    handleMouseUp: (event: MouseEvent) => void;
}

// Region interface for world regions and sub-regions
export interface Region {
    zones: Array<{ x: number; y: number; width: number; height: number }>;
    color: string;
    label: string;
}
