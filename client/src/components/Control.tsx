import React from "react";
import { useMapStore } from "../hooks/store";

const Controls: React.FC = () => {
  const {
    zoomLevel,
    isCreatingRegion,
    selectedCells,
    resetMap,
    toggleGrid,
    toggleBackgroundMap,
    toggleSubRegions,
    toggleMapBoundary,
    // showAllRegions,
    zoomIn,
    zoomOut,
    centerMap,
    startRegionCreation,
    finishRegionCreation,
    cancelRegionCreation,

    // loadRegionsFromFile,
    // saveRegionsToFile,
    // clearAllCustomRegions,
  } = useMapStore();
  // Handle finishing region creation with a name
  const handleFinishRegion = () => {
    const regionName = prompt("Enter a name for this region:");
    if (regionName && regionName.trim()) {
      finishRegionCreation(regionName.trim());
    }
  };
  return (
    <div className="controls p-4 bg-gray-100 border-t border-gray-300">
      <h3 className="text-lg font-semibold">Game Controls</h3>
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
        {/* <button onClick={showAllRegions} className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100">Show All Regions</button> */}
      </div>
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
                                    ? 'bg-blue-100 hover:bg-blue-200' 
                                    : 'bg-gray-200 cursor-not-allowed'
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
        {/* <button onClick={loadRegionsFromFile} className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100">Load Regions</button>
                <button onClick={saveRegionsToFile} className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100">Save All Regions</button>
                <button onClick={clearAllCustomRegions} className="px-4 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-100">Clear Custom Regions</button> */}
      </div>
      <div className="zoom-info text-sm text-gray-600 mt-2">
        Use mouse wheel to zoom. Click and drag to pan the map.
        <br />
        <span id="zoomLevel">Zoom: {Math.round(zoomLevel * 100)}%</span> | Grid:
        74x50 (High Resolution)
      </div>
      <div className="region-info p-2 bg-gray-200 rounded mt-2 min-h-[50px]">
        Click on the map to explore regions and place animals
      </div>
    </div>
  );
};

export default Controls;
