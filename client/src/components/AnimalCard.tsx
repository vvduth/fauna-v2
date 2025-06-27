import React, { useState } from "react";
import { type Animal } from "@/types/game";
import { Card, CardContent } from "./UI/card";
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { Button } from "./UI/button";

interface CollapsibleAnimalCardProps {
  animal: Animal;
  showLowerHalf: boolean;
  className?: string;
}

const CollapsibleAnimalCard: React.FC<CollapsibleAnimalCardProps> = ({ 
  animal, 
  showLowerHalf, 
  className = '' 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const getDifficultyBorderColor = () => {
    return animal.difficulty === 'simple' ? 'border-green-500' : 'border-gray-800';
  };

  const getMeasurementDisplay = (measurement: { min: number; max: number; unit: string } | undefined) => {
    if (!measurement) return 'N/A';
    return `${measurement.min}-${measurement.max} ${measurement.unit}`;
  };

  if (isMinimized) {
    return (
      <Card className={`${className} ${getDifficultyBorderColor()} border-2 bg-amber-50 shadow-lg transition-all duration-500 hover:shadow-xl`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded border border-green-300 flex items-center justify-center">
                <span className="text-green-700 text-xs font-medium">🦎</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-800">{animal.name}</h3>
                <p className="text-xs italic text-gray-600">{animal.scientificName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
              className="text-amber-600 hover:text-amber-800 transition-colors duration-200"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${getDifficultyBorderColor()} border-4 bg-amber-50 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-1`}>
      <CardContent className="p-0">
        {/* Header with minimize button */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-100 to-amber-200 border-b border-amber-300">
          <div className="text-sm font-medium text-amber-800">{animal.animalClass}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="text-amber-600 hover:text-amber-800 transition-colors duration-200"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>

        {/* Upper Half - Always Visible */}
        <div className="p-6 bg-gradient-to-b from-amber-50 to-amber-100 animate-fade-in">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 animate-fade-in">{animal.name}</h2>
            <p className="text-sm italic text-gray-600">{animal.scientificName}</p>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="w-48 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center border-2 border-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <span className="text-green-700 font-medium">Animal Illustration</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full transition-all duration-300 hover:bg-blue-200 hover:scale-105">
              <span className="text-sm font-medium text-blue-800">
                Found in {animal.naturalAreas.length} areas
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between p-2 rounded transition-all duration-200 hover:bg-amber-100">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">{getMeasurementDisplay(animal.measurements.weight)}</span>
              </div>
              <div className="flex justify-between p-2 rounded transition-all duration-200 hover:bg-amber-100">
                <span className="text-gray-600">Length:</span>
                <span className="font-medium">{getMeasurementDisplay(animal.measurements.length)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between p-2 rounded transition-all duration-200 hover:bg-amber-100">
                <span className="text-gray-600">Height:</span>
                <span className="font-medium">{getMeasurementDisplay(animal.measurements.height)}</span>
              </div>
              <div className="flex justify-between p-2 rounded transition-all duration-200 hover:bg-amber-100">
                <span className="text-gray-600">Tail Length:</span>
                <span className="font-medium">{getMeasurementDisplay(animal.measurements.tailLength)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Half - Revealed During Evaluation */}
        {showLowerHalf && (
          <div className="p-6 bg-gradient-to-b from-green-50 to-green-100 border-t-4 border-green-400 animate-fade-in">
            <h3 className="text-lg font-bold text-green-800 mb-4 text-center">Natural Habitat</h3>
            
            <div className="mb-4">
              <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-green-200 rounded-lg flex items-center justify-center border-2 border-green-300 transition-all duration-300 hover:scale-105">
                <span className="text-green-700 font-medium">World Map Highlighting Areas</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">Areas where this animal lives:</h4>
              <div className="flex flex-wrap gap-2">
                {animal.worldMapData.map((area, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full transition-all duration-300 hover:bg-green-300 hover:scale-105 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {animal.description && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg animate-fade-in">
                <p className="text-sm text-green-700">{animal.description}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollapsibleAnimalCard;
