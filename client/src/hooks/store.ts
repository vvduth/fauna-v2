import { create } from 'zustand';
import { MAP_CONFIG } from '../constants/mapConfig';
import type { CustomRegion, MapConfig, MapState } from '../types/game';


export const useMapStore = create<MapState>((set, get) => ({
    // Initial state
    canvas: null,
    ctx: null,
    cursorStyle: 'crosshair',
    
    mapConfig: MAP_CONFIG,
    
    gridVisible: true,
    showSubRegions: false,
    showMapBoundary: true,
    mapImageLoaded: false,
    backgroundMapImage: null,
    
    zoomLevel: 1.0,
    panX: 0,
    panY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    
    isCreatingRegion: false,
    selectedCells: [],
    currentRegionColor: '#90EE90',
    
    worldRegions: {},
    subRegions: {},
    oceanRegions: {},
    customRegions: {},
    
    selectedRegion: null,
    
    // Actions
    setCanvasSize: (width: number, height: number) => {
        set((state) => ({
            mapConfig: {
                ...state.mapConfig,
                cellWidth: width / state.mapConfig.gridWidth,
                cellHeight: height / state.mapConfig.gridHeight,
            }
        }));
    },
    
    setCanvas: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        set({ canvas, ctx });
    },
    
    loadBackgroundMap: () => {
        const backgroundMapImage = new Image();
        
        backgroundMapImage.onload = () => {
            set({ mapImageLoaded: true, backgroundMapImage });
            console.log('Background map image loaded successfully');
        };
        
        backgroundMapImage.onerror = () => {
            console.log('Failed to load background map image, using default background');
            set({ mapImageLoaded: false });
        };
        
        backgroundMapImage.src = '/map-eng.png';
    },
    
    drawMap: (ctx: CanvasRenderingContext2D, zoom: number, panX: number, panY: number) => {
        const state = get();
        const { canvas, mapConfig, gridVisible, showMapBoundary, mapImageLoaded, backgroundMapImage } = state;
        
        if (!canvas) return;
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Save context state
        ctx.save();
        
        // Apply zoom and pan transformations
        ctx.translate(panX, panY);
        ctx.scale(zoom, zoom);
        
        // Draw background
        if (mapImageLoaded && backgroundMapImage) {
            ctx.drawImage(backgroundMapImage, 0, 0, canvas.width, canvas.height);
        } else {
            // Draw ocean background as fallback
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#4682B4');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw grid if visible
        if (gridVisible) {
            state.drawGrid(ctx, canvas, mapConfig);
        }
        
        // Draw map boundary if enabled
        if (showMapBoundary) {
            state.drawMapBoundary(ctx, mapConfig);
        }
        
        // Restore context state
        ctx.restore();
    },
    
    drawGrid: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mapConfig: MapConfig) => {
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 0.5;
        ctx.font = '10px Arial';
        ctx.fillStyle = '#333';
        
        // Draw vertical grid lines
        for (let i = 0; i <= mapConfig.gridWidth; i++) {
            const x = i * mapConfig.cellWidth;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
            
            if (i > 0 && i <= mapConfig.gridWidth && i % 5 === 0) {
                ctx.fillText(i.toString(), x - 8, 15);
            }
        }
        
        // Draw horizontal grid lines
        for (let i = 0; i <= mapConfig.gridHeight; i++) {
            const y = i * mapConfig.cellHeight;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
            
            if (i > 0 && i <= mapConfig.gridHeight && i % 5 === 0) {
                ctx.fillText(i.toString(), 5, y - 5);
            }
        }
    },
    
    drawMapBoundary: (ctx: CanvasRenderingContext2D, mapConfig: MapConfig) => {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        
        const leftX = mapConfig.mapLeft * mapConfig.cellWidth;
        const rightX = mapConfig.mapRight * mapConfig.cellWidth;
        const topY = mapConfig.mapTop * mapConfig.cellHeight;
        const bottomY = mapConfig.mapBottom * mapConfig.cellHeight;
        
        ctx.strokeRect(leftX, topY, rightX - leftX, bottomY - topY);
        ctx.setLineDash([]);
    },
    
    // Control actions
    resetMap: () => {
        set({
            selectedRegion: null,
            zoomLevel: 1.0,
            panX: 0,
            panY: 0,
        });
    },
    
    toggleGrid: () => {
        set((state) => ({ gridVisible: !state.gridVisible }));
    },
    
    toggleBackgroundMap: () => {
        set((state) => ({ mapImageLoaded: !state.mapImageLoaded }));
    },
    
    toggleSubRegions: () => {
        set((state) => ({ showSubRegions: !state.showSubRegions }));
    },
    
    toggleMapBoundary: () => {
        set((state) => ({ showMapBoundary: !state.showMapBoundary }));
    },
    
    zoomIn: () => {
        set((state) => ({
            zoomLevel: Math.min(state.zoomLevel * 1.2, 5.0)
        }));
    },
    
    zoomOut: () => {
        set((state) => ({
            zoomLevel: Math.max(state.zoomLevel * 0.8, 0.5)
        }));
    },
    
    centerMap: () => {
        const { canvas, zoomLevel } = get();
        if (!canvas) return;
        
        set({
            panX: (canvas.width - (canvas.width * zoomLevel)) / 2,
            panY: (canvas.height - (canvas.height * zoomLevel)) / 2,
        });
    },
    
    // Region creation actions
    startRegionCreation: () => {
        set({
            isCreatingRegion: true,
            selectedCells: [],
            cursorStyle: 'cell', 
        });
    },
    
    cancelRegionCreation: () => {
        set({
            isCreatingRegion: false,
            selectedCells: [],
            cursorStyle: 'crosshair', // Reset cursor style
        });
    },
    
    finishRegionCreation: (name: string) => {
        const { selectedCells, currentRegionColor, customRegions } = get();
        
        if (selectedCells.length === 0) return;
        
        const newRegion: CustomRegion = {
            name,
            color: currentRegionColor,
            cells: [...selectedCells],
            cellCount: selectedCells.length,
            components: 1,
            created: new Date().toISOString(),
        };
        
        set({
            customRegions: { ...customRegions, [name]: newRegion },
            isCreatingRegion: false,
            selectedCells: [],
        });
    },
    
    handleCellSelection: (gridX: number, gridY: number) => {
        const { selectedCells, mapConfig } = get();
        
        // Check if cell is within map boundaries
        if (gridX < mapConfig.mapLeft || gridX > mapConfig.mapRight ||
            gridY < mapConfig.mapTop || gridY > mapConfig.mapBottom) {
            return;
        }
        
        // Check if cell is already selected
        const cellIndex = selectedCells.findIndex(cell => cell.x === gridX && cell.y === gridY);
        
        if (cellIndex !== -1) {
            // Remove cell
            const newSelectedCells = selectedCells.filter((_, index) => index !== cellIndex);
            set({ selectedCells: newSelectedCells });
        } else {
            // Add cell
            set({ selectedCells: [...selectedCells, { x: gridX, y: gridY }] });
        }
    },
    
    // Mouse handling (placeholder implementations)
    handleMapClick: (event: MouseEvent) => {
        // Implementation will be added in MapCanvas component
    },
    
    handleMouseWheel: (event: WheelEvent) => {
        // Implementation will be added in MapCanvas component
    },
    
    handleMouseDown: (event: MouseEvent) => {
        set({ isDragging: true, lastMouseX: event.clientX, lastMouseY: event.clientY });
    },
    
    handleMouseMove: (event: MouseEvent) => {
        const { isDragging, lastMouseX, lastMouseY, panX, panY } = get();
        
        if (isDragging) {
            const deltaX = event.clientX - lastMouseX;
            const deltaY = event.clientY - lastMouseY;
            
            set({
                panX: panX + deltaX,
                panY: panY + deltaY,
                lastMouseX: event.clientX,
                lastMouseY: event.clientY,
            });
        }
    },
    
    handleMouseUp: (event: MouseEvent) => {
        set({ isDragging: false });
    },
   
}));