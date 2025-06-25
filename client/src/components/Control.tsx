import React, { useRef } from "react";
import { useMapStore } from "../hooks/store";

const Controls: React.FC = () => {  const {
    zoomLevel,
    isCreatingRegion,
    selectedCells,
    clickedRegionInfo, // Add clicked region info for display
    resetMap,
    toggleGrid,
    toggleBackgroundMap,
    toggleSubRegions,
    toggleMapBoundary,
    zoomIn,
    zoomOut,
    centerMap,
    startRegionCreation,
    finishRegionCreation,
    cancelRegionCreation,
    loadRegionsFromFile,
    saveRegionsToFile,
  } = useMapStore();

  // Create a ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle finishing region creation with a name
  const handleFinishRegion = () => {
    const regionName = prompt("Enter a name for this region:");
    if (regionName && regionName.trim()) {
      finishRegionCreation(regionName.trim());
    }
  };

  // Handle file selection for loading regions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type - only accept JSON files
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        alert('Please select a valid JSON file');
        return;
      }

      // Validate file size - limit to 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert('File is too large. Please select a file smaller than 10MB');
        return;
      }

      // Call the store function with the selected file
      loadRegionsFromFile(file);
      
      // Reset the input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  // Handle click on the load button - trigger file input
  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="controls p-4 bg-gray-100 border-t border-gray-300">
      <h3 className="text-lg font-semibold">Game Controls</h3>
      
      {/* First row - Map display controls */}
      <div className="control-row flex gap-2 mb-2 flex-wrap">
        <button
          onClick={resetMap}
          className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100"
        >
          Reset Map
        </button>
        <button
          onClick={toggleGrid}
          className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100"
        >
          Toggle Grid
        </button>
        <button
          onClick={toggleBackgroundMap}
          className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100"
        >
          Toggle Background Map
        </button>
        <button
          onClick={toggleSubRegions}
          className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100"
        >
          Toggle Sub-Regions
        </button>
        <button
          onClick={toggleMapBoundary}
          className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100"
        >
          Toggle Map Boundary
        </button>
      </div>

      {/* Second row - Zoom and navigation controls */}
      <div className="control-row flex gap-2 mb-2 flex-wrap">
        <button
          onClick={zoomIn}
          className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100"
        >
          Zoom In (+)
        </button>
        <button
          onClick={zoomOut}
          className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100"
        >
          Zoom Out (-)
        </button>
        <button
          onClick={centerMap}
          className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100"
        >
          Center Map
        </button>
      </div>

      {/* Third row - Region management controls */}
      <div className="control-row flex gap-2 mb-2 flex-wrap">
        {!isCreatingRegion ? (
          <button
            onClick={startRegionCreation}
            className="px-4 py-2 text-sm border border-gray-300 bg-green-100 rounded hover:bg-green-200"
          >
            Create New Region
          </button>
        ) : (
          <>
            <button
              onClick={handleFinishRegion}
              disabled={selectedCells.length === 0}
              className={`px-4 py-2 text-sm border border-gray-300 rounded ${
                selectedCells.length > 0
                  ? "bg-blue-100 hover:bg-blue-200"
                  : "bg-gray-200 cursor-not-allowed"
              }`}
            >
              Finish Region ({selectedCells.length} cells)
            </button>
            <button
              onClick={cancelRegionCreation}
              className="px-4 py-2 text-sm border border-gray-300 bg-red-100 rounded hover:bg-red-200"
            >
              Cancel
            </button>
          </>
        )}

        {/* File upload component for loading regions */}
        <div className="relative">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Select regions file to load"
          />
          
          {/* Visible button that triggers file input */}
          <button
            onClick={handleLoadClick}
            className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100"
            title="Select a JSON file containing region data"
          >
            Load Regions
          </button>
        </div>

        {/* Save regions button */}
        <button
          onClick={saveRegionsToFile}
          className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100"
          title="Download current regions as JSON file"
        >
          Save All Regions
        </button>
      </div>

      {/* Status and zoom information */}
      <div className="zoom-info text-sm text-gray-600 mt-2">
        Use mouse wheel to zoom. Click and drag to pan the map.
        <br />
        <span id="zoomLevel">Zoom: {Math.round(zoomLevel * 100)}%</span> | Grid:
        74x50 (High Resolution)
      </div>      {/* Region creation status display */}
      <div className="region-info p-2 bg-gray-200 rounded mt-2 min-h-[50px]">
        {isCreatingRegion ? (
          <div>
            <strong>Creating Region:</strong> {selectedCells.length} cells
            selected
            <br />
            <small>
              Click cells to select/deselect them. Selected cells will be
              highlighted with connections shown.
            </small>
          </div>
        ) : clickedRegionInfo ? (
          <div>
            <strong>Selected Region:</strong>
            <br />
            {clickedRegionInfo}
          </div>
        ) : (
          "Click on the map to explore regions and place animals"
        )}
      </div>
    </div>
  );
};

export default Controls;