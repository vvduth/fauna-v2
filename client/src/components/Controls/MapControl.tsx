import React from 'react';

interface MapControlsProps {
    onResetMap: () => void;
    onToggleGrid: () => void;
    onToggleBackgroundMap: () => void;
    onToggleSubRegions: () => void;
    onToggleMapBoundary: () => void;
    onShowAllRegions: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
    onResetMap,
    onToggleGrid,
    onToggleBackgroundMap,
    onToggleSubRegions,
    onToggleMapBoundary,
    onShowAllRegions,
}) => {
    return (
        <div className="controls p-4 bg-gray-100 border-t border-gray-300">
            <h3 className="text-lg font-semibold">Game Controls</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={onResetMap} className="btn">
                    Reset Map
                </button>
                <button onClick={onToggleGrid} className="btn">
                    Toggle Grid
                </button>
                <button onClick={onToggleBackgroundMap} className="btn">
                    Toggle Background Map
                </button>
                <button onClick={onToggleSubRegions} className="btn">
                    Toggle Sub-Regions
                </button>
                <button onClick={onToggleMapBoundary} className="btn">
                    Toggle Map Boundary
                </button>
                <button onClick={onShowAllRegions} className="btn">
                    Show All Regions
                </button>
            </div>
        </div>
    );
};

export default MapControls;