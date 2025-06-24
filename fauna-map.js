// Global variables for game state
let canvas, ctx;
let mapData = {};
let gridVisible = true;
let selectedRegion = null;
let backgroundMapImage = null; // Store the background map image
let mapImageLoaded = false;    // Track if background image is loaded

// Map configuration based on Fauna board game
const MAP_CONFIG = {
    gridWidth: 37,  // Horizontal grid count (1-37)
    gridHeight: 25, // Vertical grid count (A-Y)
    cellWidth: 0,   // Calculated based on canvas size
    cellHeight: 0   // Calculated based on canvas size
};

// Define world regions with their approximate grid coordinates
const WORLD_REGIONS = {
    // North America
    'North America': {
        zones: [
            {x: 2, y: 5, width: 8, height: 8},   // USA/Canada main area
            {x: 1, y: 13, width: 6, height: 4}   // Mexico/Central America
        ],
        color: '#90EE90',
        label: 'North America'
    },
    
    // South America
    'South America': {
        zones: [
            {x: 6, y: 17, width: 6, height: 7}   // South America continent
        ],
        color: '#98FB98',
        label: 'South America'
    },
    
    // Europe
    'Europe': {
        zones: [
            {x: 15, y: 3, width: 6, height: 6}   // European continent
        ],
        color: '#FFE4B5',
        label: 'Europe'
    },
    
    // Africa
    'Africa': {
        zones: [
            {x: 16, y: 9, width: 6, height: 10}  // African continent
        ],
        color: '#DEB887',
        label: 'Africa'
    },
    
    // Asia
    'Asia': {
        zones: [
            {x: 21, y: 2, width: 10, height: 10} // Asian continent
        ],
        color: '#F0E68C',
        label: 'Asia'
    },
    
    // Australia/Oceania
    'Australia': {
        zones: [
            {x: 30, y: 18, width: 5, height: 4}  // Australia
        ],
        color: '#FFA07A',
        label: 'Australia'
    }
};

// Ocean regions for scoring
const OCEAN_REGIONS = {
    'Pacific Ocean': {
        zones: [
            {x: 0, y: 0, width: 5, height: 25},    // Left Pacific
            {x: 32, y: 0, width: 5, height: 25}    // Right Pacific
        ],
        color: '#4682B4',
        label: 'Pacific Ocean'
    },
    
    'Atlantic Ocean': {
        zones: [
            {x: 10, y: 0, width: 6, height: 25}    // Atlantic Ocean
        ],
        color: '#4169E1',
        label: 'Atlantic Ocean'
    },
    
    'Indian Ocean': {
        zones: [
            {x: 22, y: 12, width: 8, height: 13}   // Indian Ocean
        ],
        color: '#6495ED',
        label: 'Indian Ocean'
    }
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
    backgroundMapImage.src = 'map-3.png'; // Update with your image path
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
    window.addEventListener('resize', resizeCanvas);
    
    // Draw initial map (will redraw when image loads)
    drawMap();
    
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
    
    // Draw background map image if loaded
    if (mapImageLoaded && backgroundMapImage) {
        drawBackgroundMap();
    } else {
        // Draw ocean background as fallback
        drawOceanBackground();
    }
    
    // Draw all regions with transparency
    drawWorldRegions();
    
    // Draw coordinate grid if enabled
    if (gridVisible) {
        drawCoordinateGrid();
    }
    
    // Draw region labels
    drawRegionLabels();
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
    ctx.drawImage(backgroundMapImage, 0, 0, canvas.width, canvas.height);
}

function drawWorldRegions() {
    // Draw continental regions with transparency to show background map
    ctx.globalAlpha = 0.4; // Make regions semi-transparent
    Object.entries(WORLD_REGIONS).forEach(([regionName, region]) => {
        drawRegionZones(region);
    });
    
    // Draw ocean regions with less transparency
    ctx.globalAlpha = 0.2;
    Object.entries(OCEAN_REGIONS).forEach(([regionName, region]) => {
        drawRegionZones(region);
    });
    ctx.globalAlpha = 1.0; // Reset transparency
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
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';
    
    // Draw vertical grid lines and numbers
    for (let i = 0; i <= MAP_CONFIG.gridWidth; i++) {
        const x = i * MAP_CONFIG.cellWidth;
        
        // Draw vertical line
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        
        // Draw number label
        if (i > 0 && i <= MAP_CONFIG.gridWidth) {
            ctx.fillText(i.toString(), x - 10, 15);
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
        
        // Draw letter label (A-Y)
        if (i > 0 && i <= MAP_CONFIG.gridHeight) {
            const letter = String.fromCharCode(64 + i); // A=65, B=66, etc.
            ctx.fillText(letter, 5, y - 5);
        }
    }
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
    // Get click coordinates relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert to grid coordinates
    const gridX = Math.floor(x / MAP_CONFIG.cellWidth);
    const gridY = Math.floor(y / MAP_CONFIG.cellHeight);
    
    // Find which region was clicked
    const clickedRegion = findRegionAtCoordinates(gridX, gridY);
    
    // Update region info display
    updateRegionInfo(clickedRegion, gridX + 1, gridY + 1);
    
    console.log(`Clicked at grid (${gridX + 1}, ${String.fromCharCode(65 + gridY)})`);
}

function findRegionAtCoordinates(gridX, gridY) {
    // Check continental regions first
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

function updateRegionInfo(region, gridX, gridY) {
    const infoDiv = document.getElementById('regionInfo');
    
    if (region) {
        infoDiv.innerHTML = `
            <strong>Region:</strong> ${region.name}<br>
            <strong>Coordinates:</strong> ${gridX}, ${String.fromCharCode(64 + gridY)}<br>
            <strong>Type:</strong> ${region.name.includes('Ocean') ? 'Ocean' : 'Continental'}
        `;
    } else {
        infoDiv.innerHTML = `
            <strong>Coordinates:</strong> ${gridX}, ${String.fromCharCode(64 + gridY)}<br>
            <em>No specific region detected at this location</em>
        `;
    }
}

// Control functions
function resetMap() {
    selectedRegion = null;
    drawMap();
    document.getElementById('regionInfo').innerHTML = 
        'Click on the map to explore regions and place animals';
}

function toggleGrid() {
    gridVisible = !gridVisible;
    drawMap();
}

function toggleBackgroundMap() {
    // Toggle between showing background map and ocean gradient
    if (mapImageLoaded) {
        mapImageLoaded = !mapImageLoaded;
        drawMap();
    }
}

function showAllRegions() {
    // Highlight all regions briefly
    ctx.globalAlpha = 0.7;
    drawWorldRegions();
    
    setTimeout(() => {
        ctx.globalAlpha = 1.0;
        drawMap();
    }, 2000);
}