import React from 'react';
import { SCALE_RANGES } from '@/constants/worldRegions';
import {type  GuessPlacement } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';

interface ScaleSelectorProps {
  scaleType: keyof typeof SCALE_RANGES;
  placements: GuessPlacement[];
  onScaleClick: (scaleType: keyof typeof SCALE_RANGES, position: string) => void;
  isRelevant: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ScaleSelector: React.FC<ScaleSelectorProps> = ({ 
  scaleType, 
  placements, 
  onScaleClick, 
  isRelevant,
  className = '',
  style
}) => {
  const ranges = SCALE_RANGES[scaleType];
  
  const getScaleColor = (position: string) => {
    const placement = placements.find(p => 
      p.location === position && 
      p.type === 'scale' && 
      p.scaleType === scaleType
    );
    
    if (placement) {
      const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
      const playerIndex = parseInt(placement.playerId) || 0;
      return colors[playerIndex % colors.length];
    }
    
    return isRelevant ? 'bg-teal-500 hover:bg-teal-600' : 'bg-gray-400';
  };

  const scaleLabels: Record<keyof typeof SCALE_RANGES, string> = {
    weight: 'WEIGHT',
    length: 'LENGTH / HEIGHT',
    height: 'HEIGHT',
    tailLength: 'TAIL LENGTH'
  };

  const getScaleUnits = (scaleType: keyof typeof SCALE_RANGES) => {
    switch (scaleType) {
      case 'weight':
        return ['Ounces', 'Pounds'];
      case 'length':
      case 'height':
      case 'tailLength':
        return ['Inches', 'Feet'];
      default:
        return ['', ''];
    }
  };

  const units = getScaleUnits(scaleType);

  return (
    <div className={`${className} ${!isRelevant ? 'opacity-50' : ''} mb-3 transform transition-all duration-300 hover:scale-105`} style={style}>
      <div className="bg-teal-700 text-white px-4 py-2 text-center font-bold text-sm rounded-t-lg">
        {scaleLabels[scaleType]}
        {!isRelevant && <span className="text-xs ml-2">(Not relevant)</span>}
      </div>
      
      <div className="bg-teal-600 px-2 py-1 flex justify-between text-white text-xs font-semibold">
        <span>{units[0]}</span>
        <span>{units[1]}</span>
      </div>
      
      <div className="flex bg-white border-2 border-teal-700 rounded-b-lg overflow-hidden">
        {ranges.map((range, index) => (
          <button
            key={index}
            className={`
              ${getScaleColor(range)}
              flex-1 py-3 px-1 text-xs font-bold text-white transition-all duration-300 border-r border-teal-700 last:border-r-0
              ${isRelevant ? 'hover:scale-110 hover:shadow-lg cursor-pointer transform' : 'cursor-not-allowed'}
              ${placements.find(p => p.location === range && p.scaleType === scaleType) ? 'ring-2 ring-white ring-inset animate-pulse' : ''}
            `}
            onClick={() => isRelevant && onScaleClick(scaleType, range)}
            disabled={!isRelevant}
            title={range}
          >
            <span className="block leading-tight">
              {range.split('-').map((part, i) => (
                <span key={i} className="block text-center">
                  {part.trim()}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScaleSelector;