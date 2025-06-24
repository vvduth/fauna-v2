// Mouse event handling actions
import type { MapState } from '../types/store';

// Create mouse handling actions for the store
export const createMouseActions = (set: any, get: () => MapState) => ({
    // Handle map click events (placeholder for MapCanvas implementation)
    handleMapClick: (event: MouseEvent) => {
        // Implementation will be added in MapCanvas component
        // This is a placeholder for compatibility
    },
    
    // Handle mouse wheel events (placeholder for MapCanvas implementation)
    handleMouseWheel: (event: WheelEvent) => {
        // Implementation will be added in MapCanvas component
        // This is a placeholder for compatibility
    },
    
    // Handle mouse down for drag start
    handleMouseDown: (event: MouseEvent) => {
        set({ 
            isDragging: true, 
            lastMouseX: event.clientX, 
            lastMouseY: event.clientY 
        });
    },
    
    // Handle mouse move for dragging
    handleMouseMove: (event: MouseEvent) => {
        const { isDragging, lastMouseX, lastMouseY, panX, panY } = get();
        
        // Only process if currently dragging
        if (isDragging) {
            const deltaX = event.clientX - lastMouseX;
            const deltaY = event.clientY - lastMouseY;
            
            // Update pan position and mouse coordinates
            set({
                panX: panX + deltaX,
                panY: panY + deltaY,
                lastMouseX: event.clientX,
                lastMouseY: event.clientY,
            });
        }
    },
    
    // Handle mouse up to end dragging
    handleMouseUp: (event: MouseEvent) => {
        set({ isDragging: false });
    },
});
