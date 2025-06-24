// Global variables for game state
let canvas, ctx;
let mapData = {};
let gridVisible = true;
let selectedRegion = null;
let backgroundMapImage = null; // Store the background map image
let mapImageLoaded = false;    // Track if background image is loaded
let showSubRegions = false;    // Toggle for showing sub-regions
let showMapBoundary = true;    // Toggle for showing actual map boundary

// Region creation mode variables
let isCreatingRegion = false;  // Track if user is in region creation mode
let selectedCells = [];        // Array to store selected cells for new region
let currentRegionColor = '#90EE90'; // Default color for new regions
let customRegions = {};        // Store user-created regions

// Zoom and pan variables
let zoomLevel = 1.0;          // Current zoom level (1.0 = 100%)
let panX = 0;                 // Horizontal pan offset
let panY = 0;                 // Vertical pan offset
let isDragging = false;       // Track if user is dragging the map
let lastMouseX = 0;           // Last mouse X position for drag calculation
let lastMouseY = 0;           // Last mouse Y position for drag calculation

// Map configuration based on Fauna board game - actual world map area is (6,E) to (69,AI)
// Full grid is 74x50, but actual world map occupies only the central rectangle
// Remaining areas are used for scoring boards and game mechanics
const MAP_CONFIG = {
    gridWidth: 74 * 2,  // Horizontal grid count (1-74) - full board width
    gridHeight: 50 * 2, // Vertical grid count (A-AX) - full board height
    cellWidth: 0,   // Calculated based on canvas size
    cellHeight: 0,  // Calculated based on canvas size
    // Actual world map boundaries:
    mapLeft: 6,     // Left boundary of world map (column 6)
    mapRight: 150,   // Right boundary of world map (column 69)
    mapTop: 5,      // Top boundary of world map (row E = 5)
    mapBottom: 35   // Bottom boundary of world map (row AI = 35)
};

// Define world regions with higher resolution grid coordinates for better subdivision
const WORLD_REGIONS = {
 
};

// Sub-regions within actual map boundaries (6,E) to (69,AI) - more realistic placement
const SUB_REGIONS = {
    
};

// Ocean regions within the actual map boundaries (6,E) to (69,AI)
const OCEAN_REGIONS = {
    
};

// Initialize the game when page loads
window.addEventListener('load', initializeGame);

function loadBackgroundMap() {
    // Create new image object for background map
    backgroundMapImage = new Image();
    
    // Set up image load handler
    backgroundMapImage.onload = function() {
        mapImageLoaded = true;
        console.log('Background map image loaded successfully');
        drawMap(); // Redraw map with background image
    };
    
    // Set up error handler
    backgroundMapImage.onerror = function() {
        console.log('Failed to load background map image, using default background');
        mapImageLoaded = false;
        drawMap(); // Draw map without background image
    };
    
    // Load the background map image
    backgroundMapImage.src = 'map-eng.png'; // Update with your image path
}

function initializeGame() {
    // Get canvas element and set up context
    canvas = document.getElementById('gameMap');
    ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    resizeCanvas();
    
    // Calculate grid cell dimensions
    MAP_CONFIG.cellWidth = canvas.width / MAP_CONFIG.gridWidth;
    MAP_CONFIG.cellHeight = canvas.height / MAP_CONFIG.gridHeight;
    
    // Load background map image
    loadBackgroundMap();
      // Set up event listeners
    canvas.addEventListener('click', handleMapClick);
    canvas.addEventListener('wheel', handleMouseWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp); // Stop dragging if mouse leaves canvas
    window.addEventListener('resize', resizeCanvas);
      // Draw initial map (will redraw when image loads)
    drawMap();
    
    // Initialize zoom display
    updateZoomDisplay();
    
    console.log('Fauna board game initialized successfully!');
}

function resizeCanvas() {
    // Make canvas responsive to container size
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Recalculate cell dimensions when canvas resizes
    MAP_CONFIG.cellWidth = canvas.width / MAP_CONFIG.gridWidth;
    MAP_CONFIG.cellHeight = canvas.height / MAP_CONFIG.gridHeight;
    
    // Redraw map after resize
    if (ctx) {
        drawMap();
    }
}

function drawMap() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save the current context state
    ctx.save();
    
    // Apply zoom and pan transformations
    ctx.translate(panX, panY);
    ctx.scale(zoomLevel, zoomLevel);
    
    // Draw background map image if loaded
    if (mapImageLoaded && backgroundMapImage) {
        drawBackgroundMap();
    } else {
        // Draw ocean background as fallback
        drawOceanBackground();
    }
    
    // Draw all regions with transparency
    drawWorldRegions();    // Draw coordinate grid if enabled
    if (gridVisible) {
        drawCoordinateGrid();
    }
    
    // Draw map boundary to show actual world map area
    if (showMapBoundary) {
        drawMapBoundary();
    }
    
    // Draw selected cells if in region creation mode
    if (isCreatingRegion && selectedCells.length > 0) {
        drawSelectedCells();
    }
    
    // Draw region labels
    drawRegionLabels();
    
    // Restore the context state
    ctx.restore();
}

function drawOceanBackground() {
    // Create ocean gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');  // Light blue at top
    gradient.addColorStop(1, '#4682B4');  // Darker blue at bottom
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBackgroundMap() {
    // Draw the background map image to fit the canvas
    ctx.drawImage(backgroundMapImage, 0, 0, canvas.width, canvas.height );
}

function drawWorldRegions() {
    // Draw continental regions with transparency to show background map
    ctx.globalAlpha = 0.4; // Make regions semi-transparent
    Object.entries(WORLD_REGIONS).forEach(([regionName, region]) => {
        drawRegionZones(region);
    });
    
    // Draw sub-regions if enabled - with different transparency
    if (showSubRegions) {
        ctx.globalAlpha = 0.6; // Make sub-regions more visible
        Object.entries(SUB_REGIONS).forEach(([regionName, region]) => {
            drawRegionZones(region);
        });
    }
    
    // Draw custom user-created regions
    ctx.globalAlpha = 0.8; // Make custom regions highly visible
    Object.entries(customRegions).forEach(([regionName, region]) => {
        drawCustomRegion(region);
    });
    
    // Draw ocean regions with less transparency
    ctx.globalAlpha = 0.2;
    Object.entries(OCEAN_REGIONS).forEach(([regionName, region]) => {
        drawRegionZones(region);
    });
    ctx.globalAlpha = 1.0; // Reset transparency
}

function drawCustomRegion(region) {
    // Set region color
    ctx.fillStyle = region.color;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Draw each cell in the custom region
    region.cells.forEach(cell => {
        const x = cell.x * MAP_CONFIG.cellWidth;
        const y = cell.y * MAP_CONFIG.cellHeight;
        const width = MAP_CONFIG.cellWidth;
        const height = MAP_CONFIG.cellHeight;
        
        // Fill the cell
        ctx.fillRect(x, y, width, height);
        
        // Draw cell border
        ctx.strokeRect(x, y, width, height);
    });
    
    // Draw region label at the center of all cells
    if (region.cells.length > 0) {
        const centerX = region.cells.reduce((sum, cell) => sum + cell.x, 0) / region.cells.length;
        const centerY = region.cells.reduce((sum, cell) => sum + cell.y, 0) / region.cells.length;
        
        const labelX = (centerX + 0.5) * MAP_CONFIG.cellWidth;
        const labelY = (centerY + 0.5) * MAP_CONFIG.cellHeight;
        
        // Draw label background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(labelX - 30, labelY - 8, 60, 16);
        
        // Draw label text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(region.name, labelX, labelY + 4);
        ctx.textAlign = 'left'; // Reset alignment
    }
}

function drawRegionZones(region) {
    // Set region color
    ctx.fillStyle = region.color;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // Draw each zone for this region
    region.zones.forEach(zone => {
        const x = zone.x * MAP_CONFIG.cellWidth;
        const y = zone.y * MAP_CONFIG.cellHeight;
        const width = zone.width * MAP_CONFIG.cellWidth;
        const height = zone.height * MAP_CONFIG.cellHeight;
        
        // Fill the zone
        ctx.fillRect(x, y, width, height);
        
        // Draw zone border
        ctx.strokeRect(x, y, width, height);
    });
}

function drawCoordinateGrid() {
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 0.5;
    ctx.font = '10px Arial';  // Smaller font for higher density grid
    ctx.fillStyle = '#333';
    
    // Draw vertical grid lines and numbers
    for (let i = 0; i <= MAP_CONFIG.gridWidth; i++) {
        const x = i * MAP_CONFIG.cellWidth;
        
        // Draw vertical line
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        
        // Draw number label - show every 5th number for readability
        if (i > 0 && i <= MAP_CONFIG.gridWidth && i % 5 === 0) {
            ctx.fillText(i.toString(), x - 8, 15);
        }
    }
    
    // Draw horizontal grid lines and letters
    for (let i = 0; i <= MAP_CONFIG.gridHeight; i++) {
        const y = i * MAP_CONFIG.cellHeight;
        
        // Draw horizontal line
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        
        // Draw letter label - show every 5th letter for readability
        if (i > 0 && i <= MAP_CONFIG.gridHeight && i % 5 === 0) {
            const letter = getGridLetter(i);
            ctx.fillText(letter, 5, y - 5);
        }
    }
}

function getGridLetter(index) {
    // For high-resolution grids, use different labeling systems based on grid size
    
    // Option 1: Use numbers for y-axis when grid is large (recommended for 100+ rows)
    if (MAP_CONFIG.gridHeight > 50) {
        return index.toString(); // Simple numeric labels: 1, 2, 3, etc.
    }
    
    // Option 2: Use hybrid system - numbers with letter prefix for grouping
    // Uncomment this block if you prefer grouped numeric labels
    /*
    if (MAP_CONFIG.gridHeight > 50) {
        const group = Math.floor((index - 1) / 10); // Groups of 10
        const subIndex = ((index - 1) % 10) + 1;
        const groupLetter = String.fromCharCode(65 + group); // A, B, C, etc.
        return `${groupLetter}${subIndex}`; // A1, A2, ..., A10, B1, B2, etc.
    }
    */
    
    // Option 3: Traditional letter system for smaller grids (original behavior)
    if (index <= 26) {
        return String.fromCharCode(64 + index); // A-Z
    } else {
        // For indices > 26, use AA, AB, AC, etc.
        const firstLetter = 'A';
        const secondLetter = String.fromCharCode(64 + (index - 26));
        return firstLetter + secondLetter;
    }
}

function drawSelectedCells() {
    if (selectedCells.length === 0) return;
    
    // Draw selected cells with highlight color
    ctx.fillStyle = currentRegionColor;
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Draw each selected cell
    selectedCells.forEach(cell => {
        const x = cell.x * MAP_CONFIG.cellWidth;
        const y = cell.y * MAP_CONFIG.cellHeight;
        const width = MAP_CONFIG.cellWidth;
        const height = MAP_CONFIG.cellHeight;
        
        // Fill the cell
        ctx.fillRect(x, y, width, height);
        
        // Draw cell border
        ctx.strokeRect(x, y, width, height);
        
        // Draw cell coordinate label
        ctx.fillStyle = '#000000';
        ctx.globalAlpha = 1.0;
        ctx.font = '10px Arial';
        ctx.fillText(`${cell.x + 1},${getGridLetter(cell.y + 1)}`, x + 2, y + 12);
        ctx.fillStyle = currentRegionColor;
        ctx.globalAlpha = 0.7;
    });
    
    // Draw connections between adjacent selected cells
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = '#FF6600';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    
    // Find and draw connections
    selectedCells.forEach((cell, index) => {
        selectedCells.slice(index + 1).forEach(otherCell => {
            // Check if cells are adjacent (including diagonals)
            const dx = Math.abs(cell.x - otherCell.x);
            const dy = Math.abs(cell.y - otherCell.y);
            
            if (dx <= 1 && dy <= 1 && (dx + dy > 0)) {
                // Draw connection line
                const x1 = (cell.x + 0.5) * MAP_CONFIG.cellWidth;
                const y1 = (cell.y + 0.5) * MAP_CONFIG.cellHeight;
                const x2 = (otherCell.x + 0.5) * MAP_CONFIG.cellWidth;
                const y2 = (otherCell.y + 0.5) * MAP_CONFIG.cellHeight;
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        });
    });
    
    ctx.setLineDash([]);
    ctx.globalAlpha = 1.0; // Reset transparency
}

function drawMapBoundary() {
    // Draw boundary of actual world map area using MAP_CONFIG constants
    ctx.strokeStyle = '#FF0000';  // Red border to clearly show map boundary
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);      // Dashed line for clear distinction
    
    // Calculate boundary coordinates using config constants
    const leftX = MAP_CONFIG.mapLeft * MAP_CONFIG.cellWidth;
    const rightX = MAP_CONFIG.mapRight * MAP_CONFIG.cellWidth;
    const topY = MAP_CONFIG.mapTop * MAP_CONFIG.cellHeight;
    const bottomY = MAP_CONFIG.mapBottom * MAP_CONFIG.cellHeight;
    
    // Draw the boundary rectangle
    // ctx.strokeRect(leftX, topY, rightX - leftX, bottomY - topY);
    
    // Add labels for the boundary
    // ctx.fillStyle = '#FF0000';
    // ctx.font = 'bold 12px Arial';
    // ctx.fillText('World Map Area', leftX + 5, topY + 15);
    // ctx.fillText('(6,E) to (69,AI)', leftX + 5, topY + 30);
    
    // Reset line dash and style for other drawings
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
}

function drawRegionLabels() {
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    
    // Draw labels for continental regions
    Object.entries(WORLD_REGIONS).forEach(([regionName, region]) => {
        // Calculate center point of first zone for label placement
        const zone = region.zones[0];
        const centerX = (zone.x + zone.width / 2) * MAP_CONFIG.cellWidth;
        const centerY = (zone.y + zone.height / 2) * MAP_CONFIG.cellHeight;
        
        // Draw label with background for readability
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(centerX - 50, centerY - 10, 100, 20);
        
        ctx.fillStyle = '#000';
        ctx.fillText(region.label, centerX, centerY + 5);
    });
    
    ctx.textAlign = 'left'; // Reset text alignment
}

function handleMapClick(event) {
    // Skip if user was dragging the map
    if (isDragging) {
        return;
    }
    
    // Get click coordinates relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert screen coordinates to world coordinates (accounting for zoom and pan)
    const worldX = (x - panX) / zoomLevel;
    const worldY = (y - panY) / zoomLevel;
    
    // Convert to grid coordinates
    const gridX = Math.floor(worldX / MAP_CONFIG.cellWidth);
    const gridY = Math.floor(worldY / MAP_CONFIG.cellHeight);
    
    // Handle region creation mode
    if (isCreatingRegion) {
        handleCellSelection(gridX, gridY);
        return;
    }
    
    // Find which region was clicked (normal mode)
    const clickedRegion = findRegionAtCoordinates(gridX, gridY);
    
    // Update region info display
    updateRegionInfo(clickedRegion, gridX + 1, gridY + 1);
    
    console.log(`Clicked at grid (${gridX + 1}, ${getGridLetter(gridY + 1)})`);
}

function handleMouseWheel(event) {
    // Prevent page scrolling
    event.preventDefault();
    
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Calculate zoom factor (positive = zoom in, negative = zoom out)
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoomLevel = zoomLevel * zoomFactor;
    
    // Limit zoom range (0.5x to 5x)
    if (newZoomLevel >= 0.5 && newZoomLevel <= 5.0) {
        // Calculate new pan position to zoom toward mouse cursor
        const worldX = (mouseX - panX) / zoomLevel;
        const worldY = (mouseY - panY) / zoomLevel;
        
        // Update zoom level
        zoomLevel = newZoomLevel;
          // Adjust pan to keep mouse position centered
        panX = mouseX - worldX * zoomLevel;
        panY = mouseY - worldY * zoomLevel;
        
        // Redraw the map
        drawMap();
        
        // Update zoom level display
        updateZoomDisplay();
    }
}

function handleMouseDown(event) {
    // Start dragging mode
    isDragging = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    canvas.style.cursor = 'grabbing';
}

function handleCellSelection(gridX, gridY) {
    // Check if cell is within map boundaries
    if (gridX < MAP_CONFIG.mapLeft || gridX > MAP_CONFIG.mapRight ||
        gridY < MAP_CONFIG.mapTop || gridY > MAP_CONFIG.mapBottom) {
        alert('Cell is outside the world map area!');
        return;
    }
    
    // Create cell identifier
    const cellId = `${gridX},${gridY}`;
    
    // Check if cell is already selected
    const cellIndex = selectedCells.findIndex(cell => cell.x === gridX && cell.y === gridY);
    
    if (cellIndex !== -1) {
        // Cell is already selected, remove it
        selectedCells.splice(cellIndex, 1);
        console.log(`Removed cell (${gridX + 1}, ${getGridLetter(gridY + 1)})`);
    } else {
        // Add new cell to selection
        selectedCells.push({x: gridX, y: gridY});
        console.log(`Added cell (${gridX + 1}, ${getGridLetter(gridY + 1)})`);
    }
    
    // Update display
    updateRegionCreationInfo();
    drawMap();
}

function handleMouseMove(event) {
    if (isDragging) {
        // Calculate mouse movement
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;
        
        // Update pan position
        panX += deltaX;
        panY += deltaY;
        
        // Update last mouse position
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        
        // Redraw the map
        drawMap();
    }
}

function handleMouseUp(event) {
    // Stop dragging mode
    isDragging = false;
    canvas.style.cursor = 'crosshair';
}

function findRegionAtCoordinates(gridX, gridY) {
    // Check sub-regions first if they're visible (more specific)
    if (showSubRegions) {
        for (const [regionName, region] of Object.entries(SUB_REGIONS)) {
            for (const zone of region.zones) {
                if (gridX >= zone.x && gridX < zone.x + zone.width &&
                    gridY >= zone.y && gridY < zone.y + zone.height) {
                    return {name: regionName, ...region};
                }
            }
        }
    }
    
    // Check continental regions
    for (const [regionName, region] of Object.entries(WORLD_REGIONS)) {
        for (const zone of region.zones) {
            if (gridX >= zone.x && gridX < zone.x + zone.width &&
                gridY >= zone.y && gridY < zone.y + zone.height) {
                return {name: regionName, ...region};
            }
        }
    }
    
    // Check ocean regions
    for (const [regionName, region] of Object.entries(OCEAN_REGIONS)) {
        for (const zone of region.zones) {
            if (gridX >= zone.x && gridX < zone.x + zone.width &&
                gridY >= zone.y && gridY < zone.y + zone.height) {
                return {name: regionName, ...region};
            }
        }
    }
    
    return null; // No region found
}

function updateZoomDisplay() {
    // Update the zoom level display in the UI
    const zoomDisplay = document.getElementById('zoomLevel');
    if (zoomDisplay) {
        zoomDisplay.textContent = `Zoom: ${Math.round(zoomLevel * 100)}%`;
    }
}

function updateRegionInfo(region, gridX, gridY) {
    const infoDiv = document.getElementById('regionInfo');
    
    if (region) {
        infoDiv.innerHTML = `
            <strong>Region:</strong> ${region.name}<br>
            <strong>Coordinates:</strong> ${gridX}, ${getGridLetter(gridY)}<br>
            <strong>Type:</strong> ${region.name.includes('Ocean') ? 'Ocean' : 'Continental'}
        `;
    } else {
        infoDiv.innerHTML = `
            <strong>Coordinates:</strong> ${gridX}, ${getGridLetter(gridY)}<br>
            <em>No specific region detected at this location</em>
        `;
    }
}

// Control functions
function resetMap() {
    selectedRegion = null;
    // Reset zoom and pan to default values
    zoomLevel = 1.0;
    panX = 0;    panY = 0;
    drawMap();
    updateZoomDisplay();
    document.getElementById('regionInfo').innerHTML = 
        'Click on the map to explore regions and place animals';
}

function toggleGrid() {
    gridVisible = !gridVisible;
    drawMap();
}

function toggleBackgroundMap() {
    // Toggle between showing background map and ocean gradient
    if (backgroundMapImage) {
        mapImageLoaded = !mapImageLoaded;
        drawMap();
    }
}

function toggleSubRegions() {
    // Toggle sub-region visibility for finer regional control
    showSubRegions = !showSubRegions;
    drawMap();
}

function toggleMapBoundary() {
    // Toggle visibility of the actual world map boundary
    showMapBoundary = !showMapBoundary;
    drawMap();
}

function zoomIn() {
    // Zoom in toward center of canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const zoomFactor = 1.2;
    const newZoomLevel = zoomLevel * zoomFactor;
    
    if (newZoomLevel <= 5.0) {
        // Calculate world coordinates at center
        const worldX = (centerX - panX) / zoomLevel;
        const worldY = (centerY - panY) / zoomLevel;
        
        // Update zoom level
        zoomLevel = newZoomLevel;
          // Adjust pan to keep center point centered
        panX = centerX - worldX * zoomLevel;
        panY = centerY - worldY * zoomLevel;
        
        drawMap();
        updateZoomDisplay();
    }
}

function zoomOut() {
    // Zoom out from center of canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const zoomFactor = 0.8;
    const newZoomLevel = zoomLevel * zoomFactor;
    
    if (newZoomLevel >= 0.5) {
        // Calculate world coordinates at center
        const worldX = (centerX - panX) / zoomLevel;
        const worldY = (centerY - panY) / zoomLevel;
        
        // Update zoom level
        zoomLevel = newZoomLevel;
          // Adjust pan to keep center point centered
        panX = centerX - worldX * zoomLevel;
        panY = centerY - worldY * zoomLevel;
        
        drawMap();
        updateZoomDisplay();
    }
}

function centerMap() {
    // Center the map in the canvas
    panX = (canvas.width - (canvas.width * zoomLevel)) / 2;
    panY = (canvas.height - (canvas.height * zoomLevel)) / 2;
    drawMap();
}

function showAllRegions() {
    // Highlight all regions briefly
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.globalAlpha = 0.7;
    drawWorldRegions();
    ctx.restore();
    
    setTimeout(() => {
        drawMap();
    }, 2000);
}

// Region creation functions
function startRegionCreation() {
    // Enable region creation mode
    isCreatingRegion = true;
    selectedCells = [];
    
    // Update UI
    canvas.style.cursor = 'cell';
    updateRegionCreationInfo();
    
    console.log('Region creation mode activated. Click cells to select them.');
}

function cancelRegionCreation() {
    // Cancel region creation and reset state
    isCreatingRegion = false;
    selectedCells = [];
    
    // Reset UI
    canvas.style.cursor = 'crosshair';
    document.getElementById('regionInfo').innerHTML = 
        'Click on the map to explore regions and place animals';
    
    drawMap();
    console.log('Region creation cancelled.');
}

function finishRegionCreation() {
    // Check if we have selected cells
    if (selectedCells.length === 0) {
        alert('Please select at least one cell before creating a region.');
        return;
    }
    
    // Check for connected components (warn if region is fragmented)
    const components = findConnectedCells(selectedCells);
    if (components.length > 1) {
        const message = `Your selection contains ${components.length} disconnected areas. ` +
                       `Do you want to create the region anyway?`;
        if (!confirm(message)) {
            return;
        }
    }
    
    // Prompt for region name
    const regionName = prompt('Enter a name for this region:');
    if (!regionName || regionName.trim() === '') {
        alert('Please enter a valid region name.');
        return;
    }
    
    // Check if region name already exists
    if (customRegions[regionName.trim()]) {
        if (!confirm(`A region named "${regionName.trim()}" already exists. Do you want to overwrite it?`)) {
            return;
        }
    }
    
    // Prompt for region color (optional)
    const regionColor = prompt('Enter region color (hex format like #FF0000) or leave blank for current color:', currentRegionColor);
    const finalColor = (regionColor && regionColor.match(/^#[0-9A-F]{6}$/i)) ? regionColor : currentRegionColor;
    
    // Create the region object with additional metadata
    const newRegion = {
        name: regionName.trim(),
        color: finalColor,
        cells: [...selectedCells],
        cellCount: selectedCells.length,
        components: components.length,
        created: new Date().toISOString(),
        // Calculate bounding box for the region
        bounds: calculateRegionBounds(selectedCells)
    };
    
    // Add to custom regions
    customRegions[regionName.trim()] = newRegion;
    
    // Reset creation mode
    cancelRegionCreation();
    
    // Show success message with region details
    const message = `Region "${regionName}" created successfully!\n` +
                   `Cells: ${selectedCells.length}\n` +
                   `Connected areas: ${components.length}\n` +
                   `Color: ${finalColor}`;
    alert(message);
    
    console.log('Created region:', newRegion);
}

function updateRegionCreationInfo() {
    // Update the info display during region creation
    const infoDiv = document.getElementById('regionInfo');
    
    if (isCreatingRegion) {
        const components = findConnectedCells(selectedCells);
        const isConnected = components.length <= 1;
        const connectionStatus = selectedCells.length > 1 ? 
            (isConnected ? '✓ Connected' : `⚠ ${components.length} separate areas`) : '';
        
        infoDiv.innerHTML = `
            <strong>Creating New Region</strong><br>
            Selected cells: ${selectedCells.length} ${connectionStatus}<br>
            <em>Click cells to select/deselect them. Adjacent cells will be connected.</em><br>
            <div style="margin-top: 10px;">
                <button onclick="finishRegionCreation()" style="margin-right: 5px;" ${selectedCells.length === 0 ? 'disabled' : ''}>
                    Finish Region
                </button>
                <button onclick="cancelRegionCreation()">Cancel</button>
                <button onclick="clearSelection()" style="margin-left: 5px;" ${selectedCells.length === 0 ? 'disabled' : ''}>
                    Clear Selection
                </button>
                <br><br>
                <label>Color: 
                    <input type="color" value="${currentRegionColor}" onchange="updateRegionColor(this.value)" style="margin-left: 5px;">
                </label>
                <span style="margin-left: 10px; padding: 2px 8px; background-color: ${currentRegionColor}; color: white; border-radius: 3px;">
                    Preview
                </span>
            </div>
        `;
    }
}

function updateRegionColor(newColor) {
    // Update the current region color and redraw
    currentRegionColor = newColor;
    drawMap();
}

function saveRegionsToFile() {
    // Check if there are any custom regions to save
    if (Object.keys(customRegions).length === 0) {
        alert('No custom regions to save. Create some regions first!');
        return;
    }
    
    // Create JSON data with all custom regions and metadata
    const regionsData = {
        version: '1.0',
        created: new Date().toISOString(),
        mapConfig: {
            gridWidth: MAP_CONFIG.gridWidth,
            gridHeight: MAP_CONFIG.gridHeight,
            mapBounds: {
                left: MAP_CONFIG.mapLeft,
                right: MAP_CONFIG.mapRight,
                top: MAP_CONFIG.mapTop,
                bottom: MAP_CONFIG.mapBottom
            }
        },
        regionCount: Object.keys(customRegions).length,
        regions: customRegions
    };
    
    try {
        // Convert to JSON string with proper formatting
        const jsonString = JSON.stringify(regionsData, null, 2);
        
        // Create downloadable file
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create download link with timestamp in filename
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `fauna-custom-regions-${timestamp}.json`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        alert(`Successfully saved ${Object.keys(customRegions).length} custom regions to ${filename}`);
        console.log(`Regions saved to ${filename}`, regionsData);
        
    } catch (error) {
        alert('Error saving regions: ' + error.message);
        console.error('Error saving regions:', error);
    }
}

function loadRegionsFromFile() {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validate data structure
                if (!data.regions) {
                    alert('Invalid file format. Please select a valid regions JSON file.');
                    return;
                }
                
                // Check for version compatibility
                if (data.version && data.version !== '1.0') {
                    console.warn('Loading regions from different version:', data.version);
                }
                
                // Check map compatibility
                if (data.mapConfig) {
                    const config = data.mapConfig;
                    if (config.gridWidth !== MAP_CONFIG.gridWidth || 
                        config.gridHeight !== MAP_CONFIG.gridHeight) {
                        const message = `Warning: This file was created for a different map size ` +
                                       `(${config.gridWidth}x${config.gridHeight} vs current ${MAP_CONFIG.gridWidth}x${MAP_CONFIG.gridHeight}). ` +
                                       `Some regions may not display correctly. Continue loading?`;
                        if (!confirm(message)) {
                            return;
                        }
                    }
                }
                
                // Validate region data
                const validRegions = {};
                let invalidCount = 0;
                
                Object.entries(data.regions).forEach(([name, region]) => {
                    if (region.cells && Array.isArray(region.cells) && region.cells.length > 0) {
                        // Validate each cell is within map bounds
                        const validCells = region.cells.filter(cell => 
                            cell.x >= MAP_CONFIG.mapLeft && cell.x <= MAP_CONFIG.mapRight &&
                            cell.y >= MAP_CONFIG.mapTop && cell.y <= MAP_CONFIG.mapBottom
                        );
                        
                        if (validCells.length > 0) {
                            validRegions[name] = {
                                ...region,
                                cells: validCells,
                                loaded: new Date().toISOString()
                            };
                        } else {
                            invalidCount++;
                        }
                    } else {
                        invalidCount++;
                    }
                });
                
                // Ask about merging or replacing existing regions
                const existingCount = Object.keys(customRegions).length;
                let shouldMerge = true;
                
                if (existingCount > 0) {
                    const choice = confirm(
                        `You have ${existingCount} existing custom regions. ` +
                        `Click OK to merge with loaded regions, or Cancel to replace all existing regions.`
                    );
                    shouldMerge = choice;
                }
                
                // Apply the loaded regions
                if (shouldMerge) {
                    customRegions = {...customRegions, ...validRegions};
                } else {
                    customRegions = validRegions;
                }
                
                // Redraw map and show results
                drawMap();
                
                let message = `Successfully loaded ${Object.keys(validRegions).length} custom regions!`;
                if (invalidCount > 0) {
                    message += `\n${invalidCount} regions were skipped due to invalid data.`;
                }
                
                alert(message);
                console.log('Loaded regions:', validRegions);
                
            } catch (error) {
                alert('Error reading file: ' + error.message);
                console.error('Error loading regions:', error);
            }
        };
        
        reader.readAsText(file);
    };
    
    // Trigger file selection
    input.click();
}

function clearAllCustomRegions() {
    // Ask for confirmation before clearing all custom regions
    if (confirm('Are you sure you want to clear all custom regions? This action cannot be undone.')) {
        customRegions = {};
        drawMap();
        alert('All custom regions have been cleared.');
        console.log('All custom regions cleared.');
    }
}

function connectSelectedCells() {
    // This function could be used to show connections between selected cells
    // For now, it will highlight the path between adjacent cells
    if (selectedCells.length < 2) {
        return; // Need at least 2 cells to connect
    }
    
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoomLevel, zoomLevel);
    
    // Draw connections between adjacent cells
    ctx.strokeStyle = '#FF6600';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    
    for (let i = 0; i < selectedCells.length - 1; i++) {
        const cell1 = selectedCells[i];
        const cell2 = selectedCells[i + 1];
        
        // Calculate center points of cells
        const x1 = (cell1.x + 0.5) * MAP_CONFIG.cellWidth;
        const y1 = (cell1.y + 0.5) * MAP_CONFIG.cellHeight;
        const x2 = (cell2.x + 0.5) * MAP_CONFIG.cellWidth;
        const y2 = (cell2.y + 0.5) * MAP_CONFIG.cellHeight;
        
        // Check if cells are adjacent (within 1 cell distance)
        const distance = Math.sqrt(Math.pow(cell2.x - cell1.x, 2) + Math.pow(cell2.y - cell1.y, 2));
        if (distance <= Math.sqrt(2)) { // Allow diagonal connections
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }
    
    ctx.setLineDash([]);
    ctx.restore();
}

function findConnectedCells(cells) {
    // Group cells into connected components
    // This helps identify separate regions if user selects disconnected cells
    if (cells.length === 0) return [];
    
    const visited = new Set();
    const components = [];
    
    for (const cell of cells) {
        const cellKey = `${cell.x},${cell.y}`;
        if (visited.has(cellKey)) continue;
        
        // Find all cells connected to this one
        const component = [];
        const queue = [cell];
        
        while (queue.length > 0) {
            const current = queue.shift();
            const currentKey = `${current.x},${current.y}`;
            
            if (visited.has(currentKey)) continue;
            
            visited.add(currentKey);
            component.push(current);
            
            // Check adjacent cells (including diagonals)
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    
                    const neighbor = cells.find(c => 
                        c.x === current.x + dx && c.y === current.y + dy
                    );
                    
                    if (neighbor) {
                        const neighborKey = `${neighbor.x},${neighbor.y}`;
                        if (!visited.has(neighborKey)) {
                            queue.push(neighbor);
                        }
                    }
                }
            }
        }
        
        components.push(component);
    }
    
    return components;
}

function calculateRegionBounds(cells) {
    // Calculate the bounding box for a set of cells
    if (cells.length === 0) return null;
    
    let minX = cells[0].x;
    let maxX = cells[0].x;
    let minY = cells[0].y;
    let maxY = cells[0].y;
    
    cells.forEach(cell => {
        minX = Math.min(minX, cell.x);
        maxX = Math.max(maxX, cell.x);
        minY = Math.min(minY, cell.y);
        maxY = Math.max(maxY, cell.y);
    });
    
    return {
        minX, maxX, minY, maxY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2
    };
}

function clearSelection() {
    // Clear all selected cells in region creation mode
    if (isCreatingRegion) {
        selectedCells = [];
        updateRegionCreationInfo();
        drawMap();
        console.log('Cell selection cleared.');
    }
}