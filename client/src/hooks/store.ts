// Main Zustand store - combines all action modules
import { create } from 'zustand';
import { MAP_CONFIG } from '../constants/mapConfig';
import type { MapState } from '../types/store';

// Import action creators from separate modules
import { createCanvasActions } from '../store/canvasActions';
import { createDrawingActions } from '../store/drawingActions';
import { createControlActions } from '../store/controlActions';
import { createRegionActions } from '../store/regionActions';
import { createMouseActions } from '../store/mouseActions';

// Create the main map store with all actions combined
export const useMapStore = create<MapState>((set, get) => ({
    // Initial state values
    canvas: null,
    ctx: null,
    cursorStyle: 'crosshair',
    
    // Map configuration from constants
    mapConfig: MAP_CONFIG,
    
    // Visual state toggles (default values)
    gridVisible: true,
    showSubRegions: false,
    showMapBoundary: false,
    mapImageLoaded: false,
    backgroundMapImage: null,
    
    // Zoom and pan state (default values)
    zoomLevel: 1.0,
    panX: 0,
    panY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    
    // Region creation state (default values)
    isCreatingRegion: false,
    selectedCells: [],
    currentRegionColor: '#87CEEB',
    
    // Regions data storage (empty by default)
    worldRegions: {},
    subRegions: {},
    oceanRegions: {},
    customRegions: {},
    claimRegions: [],
    
    // Currently selected region
    selectedRegion: null,
    
    // Region interaction state (default values)
    hoveredRegion: null,
    clickedRegionInfo: '',
    
    // Combine all action modules using spread syntax
    ...createCanvasActions(set, get),
    ...createDrawingActions(set, get),
    ...createControlActions(set, get),
    ...createRegionActions(set, get),
    ...createMouseActions(set, get),
}));