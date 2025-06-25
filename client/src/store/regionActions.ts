// Region creation and management actions
import type { MapState } from "../types/store";
import type { CustomRegion } from "../types/game";
import { MAP_CONFIG } from "../constants/mapConfig";
import { hexCodeRandom } from "../utils/color";

// Create region management actions for the store
export const createRegionActions = (set: any, get: () => MapState) => ({
  // Start region creation mode
  startRegionCreation: () => {
    set({
      isCreatingRegion: true,
      selectedCells: [],
      cursorStyle: "cell",
    });
  },

  // Cancel region creation and reset state
  cancelRegionCreation: () => {
    set({
      isCreatingRegion: false,
      selectedCells: [],
      cursorStyle: "crosshair", // Reset cursor style
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
      color: hexCodeRandom(),
      cells: [...selectedCells],
      cellCount: selectedCells.length,
      components: 1,
      created: new Date().toISOString(),
    };
    console.log("New region created:", newRegion);
    // Update state with new region and reset creation mode
    set({
      customRegions: { ...customRegions, [name]: newRegion },
      isCreatingRegion: false,
      selectedCells: [],
      cursorStyle: "crosshair", // Reset cursor style
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
    const cellIndex = selectedCells.findIndex(
      (cell) => cell.x === gridX && cell.y === gridY
    );

    if (cellIndex !== -1) {
      // Remove cell if already selected
      const newSelectedCells = selectedCells.filter(
        (_, index) => index !== cellIndex
      );
      set({ selectedCells: newSelectedCells });
    } else {
      // Add cell if not selected
      set({ selectedCells: [...selectedCells, { x: gridX, y: gridY }] });
    }
  },

  saveRegionsToFile: () => {
    const { customRegions } = get();
    if (Object.keys(customRegions).length === 0) {
      console.warn("No custom regions to save");
      return;
    }

    // Create JSON data with all custom regions and metadata
    const regionsData = {
      version: "1.0",
      created: new Date().toISOString(),
      mapConfig: {
        gridWidth: MAP_CONFIG.gridWidth,
        gridHeight: MAP_CONFIG.gridHeight,
      },
      regionCount: Object.keys(customRegions).length,
      regions: customRegions,
    };
    try {
      // Convert to JSON string with proper formatting
      const jsonString = JSON.stringify(regionsData, null, 2);

      // Create downloadable file
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create download link with timestamp in filename
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `fauna-custom-regions-${timestamp}.json`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up
      URL.revokeObjectURL(url);

      alert(
        `Successfully saved ${
          Object.keys(customRegions).length
        } custom regions to ${filename}`
      );
      console.log(`Regions saved to ${filename}`, regionsData);
    } catch (error: any) {
      alert("Error saving regions: " + error.message);
      console.error("Error saving regions:", error);
    }
  },
  loadRegionsFromFile: (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!data || !data.regions) {
          throw new Error("Invalid region data format");
        }

        // Validate map config
        if (
          data.mapConfig.gridWidth !== MAP_CONFIG.gridWidth ||
          data.mapConfig.gridHeight !== MAP_CONFIG.gridHeight
        ) {
          throw new Error("Map configuration mismatch");
        }

        // Update custom regions in state
        set({
          customRegions: data.regions,
          isCreatingRegion: false,
          selectedCells: [],
          cursorStyle: "crosshair", // Reset cursor style
        });

        alert(
          `Successfully loaded ${
            Object.keys(data.regions).length
          } custom regions`
        );
        console.log("Loaded regions:", data.regions);
      } catch (error: any) {
        alert("Error loading regions: " + error.message);
        console.error("Error loading regions:", error);
      }
    };
    reader.readAsText(file);
  },
  
  // Handle region click detection - find which region contains the clicked cell
  handleRegionClick: (gridX: number, gridY: number) => {
    const { customRegions } = get();
    
    // Search through all custom regions to find which one contains this cell
    for (const [regionName, region] of Object.entries(customRegions)) {
      // Check if the clicked cell is within this region
      const cellInRegion = region.cells.find(
        cell => cell.x === gridX && cell.y === gridY
      );
      
      if (cellInRegion) {
        // Found the region containing this cell
        const regionInfo = `Region: "${region.name}" | Cells: ${region.cellCount} | Created: ${new Date(region.created).toLocaleDateString()}`;
        
        // Update the clicked region info for display
        set({ 
          clickedRegionInfo: regionInfo,
          selectedRegion: region 
        });
        
        // Show alert with region information
        //alert(`Region Information:\n\nName: ${region.name}\nCells: ${region.cellCount}\nColor: ${region.color}\nCreated: ${new Date(region.created).toLocaleString()}`);
        
        console.log(`Clicked on region "${region.name}":`, region);
        return region;
      }
    }
    
    // No region found at this location
    set({ 
      clickedRegionInfo: '',
      selectedRegion: null 
    });
    
    return null;
  },
  
  // Set the clicked region information for display
  setClickedRegionInfo: (info: string) => {
    set({ clickedRegionInfo: info });
  },
  
});
