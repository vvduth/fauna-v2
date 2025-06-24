// Region creation and management actions
import type { MapState } from '../types/store';
import type { CustomRegion } from '../types/game';

// Create region management actions for the store
export const createRegionActions = (set: any, get: () => MapState) => ({
    // Start region creation mode
    startRegionCreation: () => {
        set({
            isCreatingRegion: true,
            selectedCells: [],
            cursorStyle: 'cell', 
        });
    },
    
    // Cancel region creation and reset state
    cancelRegionCreation: () => {
        set({
            isCreatingRegion: false,
            selectedCells: [],
            cursorStyle: 'crosshair', // Reset cursor style
        });
    },
    
    // Finish region creation and save the new region
    finishRegionCreation: (name: string) => {
        const { selectedCells, currentRegionColor, customRegions } = get();
        
        // Don't create empty regions
        if (selectedCells.length === 0) return;
        
        // Create new region object
        const newRegion: CustomRegion = {
            name,
            color: currentRegionColor,
            cells: [...selectedCells],
            cellCount: selectedCells.length,
            components: 1,
            created: new Date().toISOString(),
        };
        
        // Update state with new region and reset creation mode
        set({
            customRegions: { ...customRegions, [name]: newRegion },
            isCreatingRegion: false,
            selectedCells: [],
            cursorStyle: 'crosshair', // Reset cursor style
        });
    },
    
    // Handle cell selection/deselection during region creation
    handleCellSelection: (gridX: number, gridY: number) => {
        const { selectedCells } = get();
        
        // Note: Map boundary checking is commented out to allow full grid selection
        // Uncomment these lines if you want to restrict selection to map boundaries:
        // const { mapConfig } = get();
        // if (gridX < mapConfig.mapLeft || gridX > mapConfig.mapRight ||
        //     gridY < mapConfig.mapTop || gridY > mapConfig.mapBottom) {
        //     return;
        // }
        
        // Check if cell is already selected
        const cellIndex = selectedCells.findIndex(cell => cell.x === gridX && cell.y === gridY);
        
        if (cellIndex !== -1) {
            // Remove cell if already selected
            const newSelectedCells = selectedCells.filter((_, index) => index !== cellIndex);
            set({ selectedCells: newSelectedCells });
        } else {
            // Add cell if not selected
            set({ selectedCells: [...selectedCells, { x: gridX, y: gridY }] });
        }
    },
});
