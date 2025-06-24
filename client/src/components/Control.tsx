import React from 'react';
import { useMapStore } from '../hooks/store';

const Controls: React.FC = () => {
    const {
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
        // loadRegionsFromFile,
        // saveRegionsToFile,
        // clearAllCustomRegions,
    } = useMapStore();

    return (
        <div className="controls p-4 bg-gray-100 border-t border-gray-300">
            <h3 className="text-lg font-semibold">Game Controls</h3>
            <div className="control-row flex gap-2 mb-2 flex-wrap">
                <button onClick={resetMap} className="btn">Reset Map</button>
                <button onClick={toggleGrid} className="btn">Toggle Grid</button>
                <button onClick={toggleBackgroundMap} className="btn">Toggle Background Map</button>
                <button onClick={toggleSubRegions} className="btn">Toggle Sub-Regions</button>
                <button onClick={toggleMapBoundary} className="btn">Toggle Map Boundary</button>
                {/* <button onClick={showAllRegions} className="btn">Show All Regions</button> */}
            </div>
            <div className="control-row flex gap-2 mb-2 flex-wrap">
                <button onClick={zoomIn} className="btn">Zoom In (+)</button>
                <button onClick={zoomOut} className="btn">Zoom Out (-)</button>
                <button onClick={centerMap} className="btn">Center Map</button>
            </div>
            <div className="control-row flex gap-2 mb-2 flex-wrap">
                <button onClick={startRegionCreation} className="btn">Create New Region</button>
                {/* <button onClick={loadRegionsFromFile} className="btn">Load Regions</button>
                <button onClick={saveRegionsToFile} className="btn">Save All Regions</button>
                <button onClick={clearAllCustomRegions} className="btn">Clear Custom Regions</button> */}
            </div>
            <div className="zoom-info text-sm text-gray-600 mt-2">
                Use mouse wheel to zoom. Click and drag to pan the map.
                <br />
                <span id="zoomLevel">Zoom: 100%</span> | Grid: 74x50 (High Resolution)
            </div>
            <div className="region-info p-2 bg-gray-200 rounded mt-2 min-h-[50px]">
                Click on the map to explore regions and place animals
            </div>
        </div>
    );
};

export default Controls;