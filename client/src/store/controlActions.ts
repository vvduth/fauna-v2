// Control actions for map interaction (zoom, pan, toggle functions)
import type { MapState } from '../types/store';

// Create control actions for the store
export const createControlActions = (set: any, get: () => MapState) => ({
    // Reset map to default view
    resetMap: () => {
        set({
            selectedRegion: null,
            zoomLevel: 1.0,
            panX: 0,
            panY: 0,
        });
    },
    
    // Toggle grid visibility on/off
    toggleGrid: () => {
        set((state: MapState) => ({ gridVisible: !state.gridVisible }));
    },
    
    // Toggle background map image on/off
    toggleBackgroundMap: () => {
        set((state: MapState) => ({ mapImageLoaded: !state.mapImageLoaded }));
    },
    
    // Toggle sub-regions display on/off
    toggleSubRegions: () => {
        set((state: MapState) => ({ showSubRegions: !state.showSubRegions }));
    },
    
    // Toggle map boundary display on/off
    toggleMapBoundary: () => {
        set((state: MapState) => ({ showMapBoundary: !state.showMapBoundary }));
    },
    
    // Zoom in (increase zoom level with max limit)
    zoomIn: () => {
        set((state: MapState) => ({
            zoomLevel: Math.min(state.zoomLevel * 1.2, 5.0)
        }));
    },
    
    // Zoom out (decrease zoom level with min limit)
    zoomOut: () => {
        set((state: MapState) => ({
            zoomLevel: Math.max(state.zoomLevel * 0.8, 0.5)
        }));
    },
    
    // Center the map in the viewport
    centerMap: () => {
        const { canvas, zoomLevel } = get();
        if (!canvas) return;
        
        set({
            panX: (canvas.width - (canvas.width * zoomLevel)) / 2,
            panY: (canvas.height - (canvas.height * zoomLevel)) / 2,
        });
    },
});
