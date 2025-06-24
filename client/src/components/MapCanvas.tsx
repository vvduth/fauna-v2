import React, { useEffect, useRef } from 'react';
import { useMapStore } from '../hooks/store';

const MapCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    // Get state and actions from store
    const {
        zoomLevel,
        panX,
        panY,
        cursorStyle,
        isDragging,
        mapConfig,
        selectedCells,
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
                        canvas.height = container.clientHeight;
                        setCanvasSize(canvas.width, canvas.height);
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

    // Add wheel event listener with passive: false AFTER canvas is initialized
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleWheel = (event: WheelEvent) => {
            // Prevent the default scroll behavior
            event.preventDefault();
            event.stopPropagation();
            
            // Get the latest state directly from the store
            const currentState = useMapStore.getState();
            const { zoomLevel: currentZoom, panX: currentPanX, panY: currentPanY } = currentState;
            
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            // Calculate zoom factor based on wheel direction
            const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
            const newZoomLevel = currentZoom * zoomFactor;
            
            // Limit zoom range between 0.5x and 5x
            if (newZoomLevel >= 0.5 && newZoomLevel <= 5.0) {
                // Calculate world coordinates before zoom
                const worldX = (mouseX - currentPanX) / currentZoom;
                const worldY = (mouseY - currentPanY) / currentZoom;
                
                // Calculate new pan position to zoom toward mouse cursor
                const newPanX = mouseX - worldX * newZoomLevel;
                const newPanY = mouseY - worldY * newZoomLevel;
                
                // Update the store with new zoom and pan values
                useMapStore.setState({
                    zoomLevel: newZoomLevel,
                    panX: newPanX,
                    panY: newPanY,
                });
            }
        };

        // Add event listener with explicit passive: false to allow preventDefault
        canvas.addEventListener('wheel', handleWheel, { passive: false });

        // Cleanup function to remove event listener
        return () => {
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, []); // Empty dependency array - this effect runs once after mount

    // Redraw map when state changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                drawMap(ctx, zoomLevel, panX, panY);
            }
        }
    }, [zoomLevel, panX, panY, drawMap, mapConfig, mapImageLoaded, gridVisible, showMapBoundary]);

    // Handle cursor style changes reactively
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.cursor = cursorStyle;
        }
    }, [cursorStyle]);

    // Show region creation info in console when mode changes
    useEffect(() => {
        if (isCreatingRegion) {
            console.log(`Region creation mode: ${selectedCells.length} cells selected`);
        }
    }, [isCreatingRegion, selectedCells.length]);

    // Handle map click events
    const handleMapClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        // Don't handle clicks if we're dragging
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
            console.log(`Cell ${gridX + 1}, ${gridY + 1} ${selectedCells.some(cell => cell.x === gridX && cell.y === gridY) ? 'deselected' : 'selected'}`);
        }
        
        console.log(`Clicked at grid (${gridX + 1}, ${gridY + 1})`);
    };

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-blue-600">
            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-crosshair"
                onClick={handleMapClick}
                onMouseDown={(e) => handleMouseDown(e.nativeEvent)}
                onMouseMove={(e) => handleMouseMove(e.nativeEvent)}
                onMouseUp={(e) => handleMouseUp(e.nativeEvent)}
                onMouseLeave={(e) => handleMouseUp(e.nativeEvent)}
            />
        </div>
    );
};

export default MapCanvas;