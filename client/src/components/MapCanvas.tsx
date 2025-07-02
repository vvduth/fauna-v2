import React, { useEffect, useRef, useCallback } from "react";
import { useMapStore } from "../hooks/store";
import { useGameStore } from "@/hooks/gameStore";
import type { ClaimedRegion, CustomRegion } from "@/types/game";


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
    handleRegionClick, // Add region click handler
    loadRegionsFromFile,
    isCreatingRegion,
    // Add state that affects rendering
    mapImageLoaded,
    gridVisible,
    showMapBoundary,
    customRegions,
    claimRegions,
    setClaimedRegions,
    drawCustomRegion,
  } = useMapStore();
  const { placeGuess, placements } = useGameStore();
  console.log(claimRegions);

  // Memoize the region lookup function to prevent unnecessary re-creation
  const getRegionDataByRegionName = useCallback((regionName: string): CustomRegion | null => {
    const regionData = Object.values(customRegions).find(
      (region: CustomRegion) => region.name === regionName
    );

    if (regionData) {
      return regionData;
    }

    // If no region found, log warning and return null
    console.warn(`Region "${regionName}" not found in loaded regions`);
    return null;
  }, [customRegions]); // Only recreate when customRegions changes

  // Effect to update claimed regions when placements change
  // Uses useCallback and useMemo to prevent infinite re-renders
  useEffect(() => {
    // Only process if we have both placements and custom regions loaded
    if (!placements || Object.keys(customRegions).length === 0) {
      return;
    }

    // Get all area placements (filter out scale placements)
    const areaPlacements = placements.filter((p) => p.type === "area");
    
    // Convert area placements to claimed regions with full region data
    const claimedRegionsData = areaPlacements
      .map((placement) => {
        // Get the full region data from customRegions
        const regionData = getRegionDataByRegionName(placement.location);

        if (regionData) {
          // Create claimed region with player info
          const newClaimedRegion: ClaimedRegion = {
            playerId: placement.playerId,
            color: placement.color, // Player's color for rendering
            region: {
              ...regionData, // Include all original region data (cells, bounds, etc.)
            },
          };
          return newClaimedRegion;
        }
        return null; // Return null for invalid regions
      })
      .filter((region): region is ClaimedRegion => region !== null); // Type-safe filter

    console.log("Claimed Regions Data:", claimedRegionsData);
    
    // Only update if the data has actually changed to prevent infinite loops
    const currentClaimedRegions = claimRegions || [];
    const hasChanged = currentClaimedRegions.length !== claimedRegionsData.length ||
      currentClaimedRegions.some((current, index) => 
        current.playerId !== claimedRegionsData[index]?.playerId ||
        current.region.name !== claimedRegionsData[index]?.region.name
      );

    if (hasChanged) {
      setClaimedRegions(claimedRegionsData);
    }
  }, [placements, customRegions, claimRegions, setClaimedRegions, getRegionDataByRegionName]);

  // Initialize canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
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

        // Load regions from JSON file
        fetch("../../regions.json")
          .then((response) => response.blob())
          .then((blob) => {
            const file = new File([blob], "regions.json", {
              type: "application/json",
            });
            loadRegionsFromFile(file);
          })
          .catch((error) => console.error("Failed to load regions:", error));

        // Add resize listener
        window.addEventListener("resize", resizeCanvas);

        return () => {
          window.removeEventListener("resize", resizeCanvas);
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
      const {
        zoomLevel: currentZoom,
        panX: currentPanX,
        panY: currentPanY,
      } = currentState;

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
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup function to remove event listener
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, []); // Empty dependency array - this effect runs once after mount

  // Redraw map when state changes - include claimRegions in dependencies
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawMap(ctx, zoomLevel, panX, panY);
      }
    }
  }, [
    zoomLevel,
    panX,
    panY,
    drawMap,
    mapConfig,
    mapImageLoaded,
    gridVisible,
    showMapBoundary,
    selectedCells,
    isCreatingRegion,
    customRegions,
    claimRegions, // Add claimRegions to trigger redraw when regions are claimed
    drawCustomRegion,
  ]);

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
      console.log(
        `Region creation mode: ${selectedCells.length} cells selected`
      );
    }
  }, [isCreatingRegion, selectedCells.length]); 
  
  // Memoize the map click handler to prevent unnecessary re-renders
  const handleMapClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
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

    // Handle region creation mode first
    if (isCreatingRegion) {
      handleCellSelection(gridX, gridY);
      console.log(
        `Cell ${gridX + 1}, ${gridY + 1} ${
          selectedCells.some((cell) => cell.x === gridX && cell.y === gridY)
            ? "deselected"
            : "selected"
        }`
      );
    } else {
      // Handle region detection when not in creation mode
      const clickedRegion = handleRegionClick(gridX, gridY);
      if (clickedRegion) {
        // Check if this region is already claimed
        const isAlreadyClaimed = claimRegions.some(
          (claimed) => claimed.region.name === clickedRegion.name
        );
        
        if (isAlreadyClaimed) {
          console.warn(`Region "${clickedRegion.name}" is already claimed and cannot be selected`);
          return;
        }
        
        placeGuess("area", clickedRegion.name);
      } else {
        console.log(
          `Clicked at grid (${gridX + 1}, ${gridY + 1}) - no region found`
        );
      }
    }
  }, [isDragging, panX, panY, zoomLevel, mapConfig, isCreatingRegion, handleCellSelection, selectedCells, handleRegionClick, placeGuess, claimRegions]);
  //className="absolute inset-0 bg-gradient-to-b from-sky-300 to-blue-600"
  return (
    <div className="bg-blue-50 rounded-lg border-2 border-blue-200 h-full min-h-[700px] flex flex-col">
      <canvas
        ref={canvasRef}
        className="w-full flex-1 cursor-crosshair rounded-md"
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
