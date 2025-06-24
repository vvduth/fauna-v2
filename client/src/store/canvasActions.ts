// Canvas management actions (setup, sizing, background loading)
import type { MapState } from '../types/store';

// Create canvas management actions for the store
export const createCanvasActions = (set: any, get: () => MapState) => ({
    // Set canvas size and calculate cell dimensions
    setCanvasSize: (width: number, height: number) => {
        set((state: MapState) => ({
            mapConfig: {
                ...state.mapConfig,
                cellWidth: width / state.mapConfig.gridWidth,
                cellHeight: height / state.mapConfig.gridHeight,
            }
        }));
    },
    
    // Set canvas and context references
    setCanvas: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        set({ canvas, ctx });
    },
    
    // Load background map image
    loadBackgroundMap: () => {
        const backgroundMapImage = new Image();
        
        // Handle successful image load
        backgroundMapImage.onload = () => {
            set({ mapImageLoaded: true, backgroundMapImage });
            console.log('Background map image loaded successfully');
        };
        
        // Handle image load failure
        backgroundMapImage.onerror = () => {
            console.log('Failed to load background map image, using default background');
            set({ mapImageLoaded: false });
        };
        
        // Set image source (assumes image is in public folder)
        backgroundMapImage.src = '/map-eng.png';
    },
});
