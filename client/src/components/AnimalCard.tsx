import React, { useState } from "react";
import { type Animal, type AnimalMeasurements } from "@/types/game";
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
  const { weight, length, height, tailLength, totalLength } = animal.measurements;

  // Get card type styling based on Fauna game rules
  // Green border = simple animals (beginner), Black border = exotic animals (expert/intermediate)
  const getCardTypeStyles = () => {
    const isSimpleCard = animal.cardType === 'simple' || animal.difficulty === 'beginner';
    
    if (isSimpleCard) {
      return {
        borderColor: 'border-green-600',
        headerBg: 'bg-gradient-to-r from-green-600 to-green-700',
        accentColor: 'text-green-800',
        cardBg: 'bg-gradient-to-b from-green-50 to-green-100'
      };
    } else {
      return {
        borderColor: 'border-gray-800',
        headerBg: 'bg-gradient-to-r from-gray-800 to-gray-900',
        accentColor: 'text-gray-800',
        cardBg: 'bg-gradient-to-b from-gray-50 to-gray-100'
      };
    }
  };

  const cardStyles = getCardTypeStyles();

  // Minimized card view with proper Fauna styling
  if (isMinimized) {
    return (
      <Card className={`${className} ${cardStyles.borderColor} border-3 ${cardStyles.cardBg} shadow-lg transition-all duration-500 hover:shadow-xl backdrop-blur-sm`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Card type indicator */}
              <div className={`w-12 h-8 ${cardStyles.cardBg} rounded border-2 ${cardStyles.borderColor} flex items-center justify-center`}>
                <span className={`${cardStyles.accentColor} text-xs font-bold`}>
                  {animal.cardType === 'simple' ? '🌿' : '⭐'}
                </span>
              </div>
              <div>
                <h3 className={`font-bold text-sm ${cardStyles.accentColor}`}>{animal.name}</h3>
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

  // Main animal card following Fauna board game design
  return (
    <Card className={`${className} ${cardStyles.borderColor} border-4 ${cardStyles.cardBg} shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl transform hover:-translate-y-2 backdrop-blur-lg`}>
      <CardContent className="p-0">
        {/* Header with animal class and card type indicator */}
        <div className={`flex justify-between items-center p-4 ${cardStyles.headerBg} text-white border-b-2 ${cardStyles.borderColor}`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Card type indicator (green = simple, black = exotic) */}
              <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                animal.cardType === 'simple' ? 'bg-green-500' : 'bg-gray-800'
              }`}>
                <span className="text-white text-xs font-bold">
                  {animal.cardType === 'simple' ? '🌿' : '⭐'}
                </span>
              </div>
              <span className="text-lg font-bold tracking-wide">{animal.animalClass}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>

        {/* UPPER HALF - Always Visible During Placement Phase */}
        <div className="p-6 bg-gradient-to-b from-white via-amber-50 to-amber-100 animate-fade-in">
          {/* Animal Names */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in font-serif">
              {animal.name}
            </h2>
            <p className="text-lg italic text-gray-600 font-light">
              <em>{animal.scientificName}</em>
            </p>
          </div>
          
          {/* Animal Illustration */}
          <div className="flex justify-center mb-6">
            <div className="w-48 h-32 bg-gradient-to-br from-blue-100 via-green-100 to-amber-100 rounded-xl flex items-center justify-center border-3 border-amber-300 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              {animal.imageUrl ? (
                <img 
                  src={animal.imageUrl} 
                  alt={animal.name} 
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center">
                  <span className="text-4xl mb-2 block">🦎</span>
                  <span className="text-amber-700 font-medium text-sm">Animal Illustration</span>
                </div>
              )}
            </div>
          </div>

          {/* Number of Areas Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:scale-105">
              <span className="text-lg mr-2">🌍</span>
              <span className="font-bold text-lg">
                Found in {animal.habitatAreas.length} areas
              </span>
            </div>
          </div>

          {/* Measurement Values (Upper Half Info) */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border-2 border-amber-200 shadow-lg">
            <h3 className="text-center text-lg font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <span>📏</span>
              Measurements to Estimate
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200 transition-all duration-200 hover:bg-amber-100 hover:scale-105">
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <span>⚖️</span>Weight
                  </span> 
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200 transition-all duration-200 hover:bg-amber-100 hover:scale-105">
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <span>📏</span>Body Length
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200 transition-all duration-200 hover:bg-amber-100 hover:scale-105">
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <span>📐</span>Total Length
                  </span>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200 transition-all duration-200 hover:bg-amber-100 hover:scale-105">
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <span>📏</span>Height
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200 transition-all duration-200 hover:bg-amber-100 hover:scale-105">
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <span>🦘</span>Tail Length
                  </span>
                </div>
                
                {/* Placeholder for 6th measurement if needed */}
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 opacity-50">
                  <span className="text-gray-500 font-medium text-sm">Additional Info</span>
                  <span className="text-gray-500 text-sm">---</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER HALF - Revealed Only During Evaluation Phase */}
        {showLowerHalf && (
          <div className="relative">
            {/* Dramatic reveal border */}
            <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 animate-pulse"></div>
            
            <div className="p-6 bg-gradient-to-b from-green-50 via-emerald-50 to-green-100 animate-fade-in border-t-4 border-green-500">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-green-800 mb-2 flex items-center justify-center gap-3">
                  <span>🔍</span>
                  Habitat & Classification
                  <span>🌍</span>
                </h3>
                <p className="text-green-700 italic">Now revealed for scoring!</p>
              </div>
              
              {/* World Map Placeholder */}
              <div className="mb-6">
                <h4 className="font-bold text-green-800 mb-3 text-center">World Map - Natural Habitat</h4>
                <div className="w-full h-40 bg-gradient-to-br from-blue-200 via-green-200 to-amber-200 rounded-xl flex items-center justify-center border-3 border-green-400 shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
                  {/* Map background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-gradient-to-r from-blue-300 via-green-300 to-yellow-300"></div>
                  </div>
                  
                  <div className="relative text-center z-10">
                    <span className="text-2xl mb-2 block">🗺️</span>
                    <span className="text-green-800 font-bold text-lg">Interactive World Map</span>
                    <p className="text-green-700 text-sm mt-1">Showing highlighted habitat areas</p>
                  </div>
                </div>
              </div>

              {/* Natural Habitat Areas */}
              <div className="mb-6">
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <span>🌿</span>
                  Natural Habitat Areas:
                </h4>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-green-300 shadow-lg">
                  <div className="flex flex-wrap gap-2">
                    {animal.habitatAreas.map((area, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-full shadow-lg transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:scale-110 animate-fade-in border-2 border-green-400"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        🌍 {area}
                      </span>
                    ))}
                  </div>
                  
                  {/* Area count confirmation */}
                  <div className="mt-4 text-center p-3 bg-green-100 rounded-lg border border-green-300">
                    <span className="text-green-800 font-bold">
                      ✅ Confirmed: Lives in exactly {animal.habitatAreas.length} areas
                    </span>
                  </div>
                </div>
              </div>

              {/* Average Measurement Values */}
              <div className="mb-6">
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <span>📊</span>
                  Actual Measurements (Average Values):
                </h4>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-green-300 shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column - Primary Measurements */}
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg border-2 border-green-300 shadow-md">
                        <div className="flex justify-between items-center">
                          <span className="text-green-800 font-bold flex items-center gap-2">
                            <span>⚖️</span>Weight:
                          </span>
                          <span className="text-green-900 font-bold text-lg">
                            {weight?.value ? `${weight.value} ${weight.unit}` : 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg border-2 border-green-300 shadow-md">
                        <div className="flex justify-between items-center">
                          <span className="text-green-800 font-bold flex items-center gap-2">
                            <span>📏</span>Body Length:
                          </span>
                          <span className="text-green-900 font-bold text-lg">
                            {length?.value ? `${length.value} ${length.unit}` : 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg border-2 border-green-300 shadow-md">
                        <div className="flex justify-between items-center">
                          <span className="text-green-800 font-bold flex items-center gap-2">
                            <span>📐</span>Total Length:
                          </span>
                          <span className="text-green-900 font-bold text-lg">
                            {totalLength?.value ? `${totalLength.value} ${totalLength.unit}` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Secondary Measurements */}
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg border-2 border-green-300 shadow-md">
                        <div className="flex justify-between items-center">
                          <span className="text-green-800 font-bold flex items-center gap-2">
                            <span>📏</span>Height:
                          </span>
                          <span className="text-green-900 font-bold text-lg">
                            {height?.value ? `${height.value} ${height.unit}` : 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg border-2 border-green-300 shadow-md">
                        <div className="flex justify-between items-center">
                          <span className="text-green-800 font-bold flex items-center gap-2">
                            <span>🦘</span>Tail Length:
                          </span>
                          <span className="text-green-900 font-bold text-lg">
                            {tailLength?.value ? `${tailLength.value} ${tailLength.unit}` : 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Zoological Classification Preview */}
                      <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border-2 border-blue-300 shadow-md">
                        <div className="text-center">
                          <span className="text-blue-800 font-bold text-sm flex items-center justify-center gap-1">
                            <span>🔬</span>Classification
                          </span>
                          <p className="text-blue-900 text-xs mt-1">
                            {animal.classification?.class || 'Scientific data'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Animal Information */}
              {animal.description && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-300 shadow-lg animate-fade-in">
                  <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <span>📖</span>
                    Interesting Facts:
                  </h4>
                  <p className="text-amber-800 text-sm leading-relaxed">{animal.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollapsibleAnimalCard;
