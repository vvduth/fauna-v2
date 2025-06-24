import React, { useEffect, useRef } from 'react';
import { useMapStore } from '../hooks/store';

const MapCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    // Get state and actions from store
    const {
        zoomLevel,
        panX,
        panY,
        isDragging,
        mapConfig,
        drawMap,
        loadBackgroundMap,
        setCanvasSize,
        setCanvas,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleCellSelection,
        isCreatingRegion,
        // Add state that affects rendering
        mapImageLoaded,
        gridVisible,
        showMapBoundary
    } = useMapStore();

    // Initialize canvas when component mounts
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Set canvas size to match container
                const resizeCanvas = () => {
                    const container = canvas.parentElement;
                    if (container) {
                        canvas.width = container.clientWidth;
                        canvas.height = 600; // Fixed height as per original
                        setCanvasSize(canvas.width, canvas.height);
                        console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`);
                    }
                };
                
                resizeCanvas();
                setCanvas(canvas, ctx);
                loadBackgroundMap();
                
                // Add resize listener
                window.addEventListener('resize', resizeCanvas);
                
                return () => {
                    window.removeEventListener('resize', resizeCanvas);
                };
            }
        }
    }, [setCanvasSize, setCanvas, loadBackgroundMap]);

    // Redraw map when state changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                console.log('Drawing map with zoom:', zoomLevel, 'pan:', panX, panY);
                drawMap(ctx, zoomLevel, panX, panY);
            }
        }
    }, [zoomLevel, panX, panY, drawMap, mapConfig, mapImageLoaded, gridVisible, showMapBoundary]);

    // Handle map click events
    const handleMapClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDragging) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Convert screen coordinates to world coordinates
        const worldX = (x - panX) / zoomLevel;
        const worldY = (y - panY) / zoomLevel;
        
        // Convert to grid coordinates
        const gridX = Math.floor(worldX / mapConfig.cellWidth);
        const gridY = Math.floor(worldY / mapConfig.cellHeight);
        
        // Handle region creation mode
        if (isCreatingRegion) {
            handleCellSelection(gridX, gridY);
        }
        
        console.log(`Clicked at grid (${gridX + 1}, ${gridY + 1})`);
    };

    // Handle mouse wheel for zooming
    const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
        event.preventDefault();
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // Calculate zoom factor
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        const newZoomLevel = zoomLevel * zoomFactor;
        
        // Limit zoom range
        if (newZoomLevel >= 0.5 && newZoomLevel <= 5.0) {
            // Calculate new pan position to zoom toward mouse cursor
            const worldX = (mouseX - panX) / zoomLevel;
            const worldY = (mouseY - panY) / zoomLevel;
            
            // Update zoom and pan through store
            useMapStore.setState({
                zoomLevel: newZoomLevel,
                panX: mouseX - worldX * newZoomLevel,
                panY: mouseY - worldY * newZoomLevel,
            });
        }
    };

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-blue-600">
            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-crosshair"
                onClick={handleMapClick}
                onWheel={handleWheel}
                onMouseDown={(e) => handleMouseDown(e.nativeEvent)}
                onMouseMove={(e) => handleMouseMove(e.nativeEvent)}
                onMouseUp={(e) => handleMouseUp(e.nativeEvent)}
                onMouseLeave={(e) => handleMouseUp(e.nativeEvent)}
            />
        </div>
    );
};

export default MapCanvas;