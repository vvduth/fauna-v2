// Drawing functions for canvas rendering
import { MAP_CONFIG } from '../constants/mapConfig';
import type { ClaimedRegion, CustomRegion } from '../types/game';
import type { MapState } from '../types/store';
import { getGridLetter } from '../utils/mapUtils';

// Define MapConfig interface locally for this file
interface MapConfig {
    gridWidth: number;
    gridHeight: number;
    cellWidth: number;
    cellHeight: number;
    mapLeft: number;
    mapRight: number;
    mapTop: number;
    mapBottom: number;
}

// Create drawing actions for the store
export const createDrawingActions = (set: any, get: () => MapState) => ({
    // Main drawing function that renders the entire map
    drawMap: (ctx: CanvasRenderingContext2D, zoom: number, panX: number, panY: number) => {
        const state = get();
        const { 
            canvas, 
            mapConfig, 
            gridVisible, 
            showMapBoundary, 
            mapImageLoaded, 
            backgroundMapImage,
            isCreatingRegion ,
            customRegions,
            claimRegions
        } = state;
        
        if (!canvas) return;
        
        // Clear the canvas completely
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Save context state before transformations
        ctx.save();
        
        // Apply zoom and pan transformations
        ctx.translate(panX, panY);
        ctx.scale(zoom, zoom);
        
        // Draw background (ocean gradient or map image)
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

        if (customRegions && Object.keys(customRegions).length > 0) {
            // Draw each custom region
            // Object.values(customRegions).forEach(region => {
            //     state.drawCustomRegion(ctx, region);
            // });
        }
        console.log('Drawing claimed regions:', claimRegions);
        if (claimRegions && claimRegions.length > 0) {
            // Draw each claimed region
            claimRegions.forEach(region => {
                state.drawClaimedRegion(ctx, region.region, region.color);
            });
        }
        
        // Draw grid if visible
        if (gridVisible) {
            state.drawGrid(ctx, canvas, mapConfig);
        }
        
        // Draw map boundary if enabled
        if (showMapBoundary) {
            state.drawMapBoundary(ctx, mapConfig);
        }
        
        // Draw selected cells if in region creation mode
        if (isCreatingRegion) {
            state.drawSelectedCells(ctx);
        }
        
        // Restore context state
        ctx.restore();
    },

    // Draw the grid lines and labels
    drawGrid: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mapConfig: MapConfig) => {
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 0.5;
        ctx.font = '10px Arial';
        ctx.fillStyle = '#333';
        
        // Draw vertical grid lines with labels
        for (let i = 0; i <= mapConfig.gridWidth; i++) {
            const x = i * mapConfig.cellWidth;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
            
            // Add number labels every 5 lines
            if (i > 0 && i <= mapConfig.gridWidth && i % 5 === 0) {
                ctx.fillText(i.toString(), x - 8, 15);
            }
        }
        
        // Draw horizontal grid lines with labels
        for (let i = 0; i <= mapConfig.gridHeight; i++) {
            const y = i * mapConfig.cellHeight;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
            
            // Add number labels every 5 lines
            if (i > 0 && i <= mapConfig.gridHeight && i % 5 === 0) {
                ctx.fillText(i.toString(), 5, y - 5);
            }
        }
    },

    // Draw the red dashed boundary showing the playable map area
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

    // Draw selected cells with highlighting and connections
    drawSelectedCells: (ctx: CanvasRenderingContext2D) => {
        const { selectedCells, currentRegionColor, mapConfig } = get();
        
        // Exit early if no cells are selected
        if (selectedCells.length === 0) return;
        
        // Save the current canvas state
        ctx.save();
        
        // Set styles for cell highlighting
        ctx.fillStyle = currentRegionColor;
        ctx.globalAlpha = 0.7;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // Draw each selected cell with highlight and label
        selectedCells.forEach(cell => {
            const x = cell.x * mapConfig.cellWidth;
            const y = cell.y * mapConfig.cellHeight;
            const width = mapConfig.cellWidth;
            const height = mapConfig.cellHeight;
            
            // Fill the cell with highlight color
            ctx.fillRect(x, y, width, height);
            
            // Draw cell border
            ctx.strokeRect(x, y, width, height);
            
            // Draw cell coordinate label (black text, full opacity)
            // ctx.fillStyle = '#000000';
            // ctx.globalAlpha = 1.0;
            // ctx.font = '10px Arial';
            // ctx.fillText(`${cell.x + 1},${getGridLetter(cell.y + 1)}`, x + 2, y + 12);
            
            // Reset to highlight color and transparency for next cell
            ctx.fillStyle = currentRegionColor;
            ctx.globalAlpha = 0.7;
        });
        
        // Draw connections between adjacent selected cells
        // ctx.globalAlpha = 1.0;
        // ctx.strokeStyle = '#FF6600'; // Orange connection lines
        // ctx.lineWidth = 1;
        // ctx.setLineDash([5, 5]); // Dashed lines
        
        // Find and draw connections between adjacent cells
        selectedCells.forEach((cell, index) => {
            // Check each remaining cell to avoid duplicate connections
            selectedCells.slice(index + 1).forEach(otherCell => {
                // Calculate distance between cells
                const dx = Math.abs(cell.x - otherCell.x);
                const dy = Math.abs(cell.y - otherCell.y);
                
                // Check if cells are adjacent (including diagonals)
                if (dx <= 1 && dy <= 1 && (dx + dy > 0)) {
                    // Calculate center points of both cells
                    const x1 = (cell.x + 0.5) * mapConfig.cellWidth;
                    const y1 = (cell.y + 0.5) * mapConfig.cellHeight;
                    const x2 = (otherCell.x + 0.5) * mapConfig.cellWidth;
                    const y2 = (otherCell.y + 0.5) * mapConfig.cellHeight;
                    
                    // Draw connection line between cell centers
                    // ctx.beginPath();
                    // ctx.moveTo(x1, y1);
                    // ctx.lineTo(x2, y2);
                    // ctx.stroke();
                }
            });
        });
        
        // Reset line dash and restore canvas state
        ctx.setLineDash([]);
        ctx.restore();
    },

    // Function to draw a single custom region with cells and label
    drawCustomRegion: (ctx: CanvasRenderingContext2D, region: CustomRegion) => {
        const { mapConfig } = get();
        
        // Save the current canvas state
        ctx.save();
        
        // Set region color and border style
        ctx.fillStyle = region.color;
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Draw each cell in the custom region
        region.cells.forEach(cell => {
            const x = cell.x * mapConfig.cellWidth;
            const y = cell.y * mapConfig.cellHeight;
            const width = mapConfig.cellWidth;
            const height = mapConfig.cellHeight;
            
            // Fill the cell with region color
            ctx.fillRect(x, y, width, height);
            
            // Draw cell border (black outline)
            ctx.strokeRect(x, y, width, height);
        });
        
        // Draw region label at the center of all cells
        if (region.cells.length > 0) {
            // Calculate the geometric center of all cells
            const centerX = region.cells.reduce((sum, cell) => sum + cell.x, 0) / region.cells.length;
            const centerY = region.cells.reduce((sum, cell) => sum + cell.y, 0) / region.cells.length;
            
            // Convert to screen coordinates
            const labelX = (centerX + 0.5) * mapConfig.cellWidth;
            const labelY = (centerY + 0.5) * mapConfig.cellHeight;
            
            // Draw label background (semi-transparent white rectangle)
            // ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            // ctx.fillRect(labelX - 30, labelY - 8, 60, 16);
            
            // Draw label text (black, bold, centered)
            // ctx.fillStyle = '#000';
            // ctx.font = 'bold 12px Arial';
            // ctx.textAlign = 'center';
            // ctx.fillText(region.name, labelX, labelY + 4);
            // ctx.textAlign = 'left'; // Reset text alignment for other drawings
        }
        
        // Restore the canvas state
        ctx.restore();
    },

    drawClaimedRegion: (ctx: CanvasRenderingContext2D, region: CustomRegion, playerColor: string) => {
        console.log('Drawing claimed region:', region.name, 'Color:', playerColor);
        const { mapConfig } = get();
        
        // Save the current canvas state
        ctx.save();
        
        // Set region color and border style
        ctx.fillStyle = playerColor;
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Draw each cell in the claimed region
        region.cells.forEach(cell => {
            const x = cell.x * mapConfig.cellWidth;
            const y = cell.y * mapConfig.cellHeight;
            const width = mapConfig.cellWidth;
            const height = mapConfig.cellHeight;
            
            // Fill the cell with region color
            ctx.fillRect(x, y, width, height);
            
            // Draw cell border (black outline)
            ctx.strokeRect(x, y, width, height);
        });
        
        // Draw region label at the center of all cells
        if (region.cells.length > 0) {
            // Calculate the geometric center of all cells
            const centerX = region.cells.reduce((sum, cell) => sum + cell.x, 0) / region.cells.length;
            const centerY = region.cells.reduce((sum, cell) => sum + cell.y, 0) / region.cells.length;
            
            // Convert to screen coordinates
            const labelX = (centerX + 0.5) * mapConfig.cellWidth;
            const labelY = (centerY + 0.5) * mapConfig.cellHeight;
            
            // Draw label background (semi-transparent white rectangle)
            // ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            // ctx.fillRect(labelX - 30, labelY - 8, 60, 16);
            
            // Draw label text (black, bold, centered)
            // ctx.fillStyle = '#000';
            // ctx.font = 'bold 12px Arial';
            // ctx.textAlign = 'center';
            // ctx.fillText(region.name, labelX, labelY + 4);
            // ctx.textAlign = 'left'; // Reset text alignment for other drawings
        }
        
        // Restore the canvas state
        ctx.restore();
    }
});
