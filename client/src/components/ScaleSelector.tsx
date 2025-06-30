import React from 'react';

// Placeholder component for scale selection UI
// TODO: Add props and functionality later
const ScaleSelector = () => {
  
  // Mock data for placeholder demonstration
  const mockScaleRanges = {
    weight: ['1g-10g', '10g-100g', '100g-1kg', '1kg-10kg', '10kg-100kg', '100kg-1t', '1t+'],
    length: ['1cm-5cm', '5cm-10cm', '10cm-50cm', '50cm-1m', '1m-2m', '2m-5m', '5m+'],
    height: ['1cm-5cm', '5cm-10cm', '10cm-50cm', '50cm-1m', '1m-2m', '2m-3m', '3m+'],
    tailLength: ['0cm', '1cm-5cm', '5cm-10cm', '10cm-50cm', '50cm-1m', '1m-2m', '2m+']
  };

  // Enhanced scale labels with emojis and better descriptions
  const scaleLabels = {
    weight: { 
      title: 'WEIGHT SCALE', 
      emoji: '⚖️', 
      description: 'How heavy is this creature?' 
    },
    length: { 
      title: 'BODY LENGTH', 
      emoji: '📏', 
      description: 'From nose to tail tip' 
    },
    height: { 
      title: 'HEIGHT SCALE', 
      emoji: '📐', 
      description: 'How tall does it stand?' 
    },
    tailLength: { 
      title: 'TAIL LENGTH', 
      emoji: '🦘', 
      description: 'Just the tail measurement' 
    }
  };

  // Enhanced unit system with proper measurement labels
  const getScaleUnits = (scaleType: string) => {
    switch (scaleType) {
      case 'weight':
        return ['🪶 Light', '🏋️ Heavy'];
      case 'length':
        return ['📏 Short', '📏 Long'];
      case 'height':
        return ['⬇️ Low', '⬆️ Tall'];
      case 'tailLength':
        return ['🔸 Tiny', '🔸 Long'];
      default:
        return ['', ''];
    }
  };

  // Placeholder function for button clicks
  const handleScaleClick = (scaleType: string, range: string) => {
    console.log(`Clicked ${scaleType} scale at ${range} - functionality to be implemented`);
  };

  return (
    <div className="animate-fade-in delay-800">
      <div className="backdrop-blur-lg bg-white/10 border-white/20 rounded-2xl p-6 shadow-2xl border">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-emerald-200 flex items-center justify-center gap-3">
            <span>📏</span>
            Measurement Scales
            <span>⚖️</span>
          </h3>
          <p className="text-emerald-200/70 mt-2">Estimate the animal's physical characteristics</p>
        </div>
        
        {/* Scales Grid with Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Render each scale type */}
          {Object.entries(mockScaleRanges).map(([scaleType, ranges], scaleIndex) => {
            const scaleInfo = scaleLabels[scaleType as keyof typeof scaleLabels];
            const units = getScaleUnits(scaleType);
            
            return (
              <div 
                key={scaleType}
                className="transform transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${scaleIndex * 150}ms` }}
              >
                {/* Scale Header with Nature Theme */}
                <div className="bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-700 text-white px-4 py-3 text-center rounded-t-xl border-b-2 border-emerald-500 shadow-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-xl">{scaleInfo.emoji}</span>
                    <h4 className="font-bold text-sm tracking-wide">{scaleInfo.title}</h4>
                  </div>
                  <p className="text-xs text-emerald-100 opacity-90">{scaleInfo.description}</p>
                </div>
                
                {/* Unit Labels with Enhanced Design */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-2 flex justify-between text-white text-xs font-semibold border-b border-emerald-500">
                  <span className="flex items-center gap-1">{units[0]}</span>
                  <span className="flex items-center gap-1">{units[1]}</span>
                </div>
                
                {/* Scale Range Buttons with Glassmorphism */}
                <div className="flex bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-sm border-2 border-emerald-600 rounded-b-xl overflow-hidden shadow-xl">
                  {ranges.map((range, index) => {
                    // Mock some placement indicators for demo
                    const hasPlacement = scaleIndex === 0 && index === 2; // Show demo placement on first scale
                    
                    return (
                      <button
                        key={index}
                        className={`
                          ${hasPlacement 
                            ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-400/50' 
                            : 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-emerald-400/30'
                          }
                          flex-1 py-4 px-2 text-xs font-bold text-white transition-all duration-300 
                          border-r border-emerald-600/50 last:border-r-0 relative group
                          hover:scale-110 hover:shadow-xl cursor-pointer transform hover:z-10
                          ${hasPlacement ? 'ring-2 ring-white ring-inset animate-pulse shadow-lg' : ''}
                        `}
                        onClick={() => handleScaleClick(scaleType, range)}
                        title={`${scaleInfo.title}: ${range}`}
                      >
                        {/* Hover overlay for better feedback */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Range text with better formatting */}
                        <span className="block leading-tight relative z-10">
                          {range.split('-').map((part, i) => (
                            <span key={i} className="block text-center text-xs">
                              {part.trim()}
                            </span>
                          ))}
                        </span>
                        
                        {/* Placement indicator for demo */}
                        {hasPlacement && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border border-emerald-600 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Scale Footer with Tips */}
                <div className="bg-black/20 px-3 py-2 text-center rounded-b-xl">
                  <p className="text-emerald-200/70 text-xs">
                    Click to place your guess piece
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Instructions Panel */}
        <div className="mt-8 bg-black/20 rounded-xl p-4 border border-white/10">
          <div className="text-center">
            <h4 className="text-emerald-200 font-semibold mb-2 flex items-center justify-center gap-2">
              <span>💡</span>
              Measurement Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-emerald-100 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <span>Exact match = 7 points</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Adjacent range = 3 points</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>❌</span>
                  <span>Wrong guess = 0 points</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📦</span>
                  <span>Wrong pieces go to stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Development Notice */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600/20 border border-amber-400/50 rounded-lg text-amber-200 text-sm">
            <span>🚧</span>
            <span>Placeholder UI - Functionality to be implemented</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScaleSelector;