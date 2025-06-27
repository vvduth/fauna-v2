import React from "react";
import { type Animal } from "@/types/game";
import { Card, CardContent } from "./UI/card";

interface AnimalCardProps {
  animal: Animal;
  showLowerHalf: boolean;
  className?: string;
}
const AnimalCard: React.FC<AnimalCardProps> = ({
  animal,
  showLowerHalf,
  className = "",
}) => {
  const getDifficultyBorderColor = () => {
    return animal.difficulty === "simple"
      ? "border-green-500"
      : "border-gray-800";
  };
  const getMeasurementDisplay = (
    measurement: { min: number; max: number; unit: string } | undefined
  ) => {
    if (!measurement) return "N/A";
    return `${measurement.min}-${measurement.max} ${measurement.unit}`;
  };
  console.log("AnimalCard rendered with animal:", animal);
  return (
    <Card className={`border-4 bg-amber-50 shadow-xl overflow-hidden`}>
      <CardContent className="p-0">
        {/* Upper Half - Always Visible */}
        <div className="p-6 bg-gradient-to-b from-amber-50 to-amber-100">
          <div className="text-center mb-4">
            <div className="text-sm font-medium text-amber-800 mb-1">
              {animal.animalClass}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{animal.name}</h2>
            <p className="text-sm italic text-gray-600">
              {animal.scientificName}
            </p>
          </div>
          <div className="flex justify-center mb-4">
            <div className="w-48 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center border-2 border-green-300">
              <img
                src={
                  "https://www.shutterstock.com/shutterstock/photos/1943052460/display_1500/stock-photo-the-arctic-fox-vulpes-lagopus-realistic-drawing-illustration-for-the-encyclopedia-of-animals-of-1943052460.jpg"
                }
                alt={animal.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full">
              <span className="text-sm font-medium text-blue-800">
                Found in {animal.naturalAreas.length} areas
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">
                {getMeasurementDisplay(animal.measurements.weight)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Length:</span>
              <span className="font-medium">
                {getMeasurementDisplay(animal.measurements.length)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Length:</span>
              <span className="font-medium">
                {getMeasurementDisplay(animal.measurements.totalLength)}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Height:</span>
              <span className="font-medium">
                {getMeasurementDisplay(animal.measurements.height)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tail Length:</span>
              <span className="font-medium">
                {getMeasurementDisplay(animal.measurements.tailLength)}
              </span>
            </div>
          </div>
        </div>
        {/* Lower Half - Revealed During Evaluation */}
        {showLowerHalf && (
          <div className="p-6 bg-gradient-to-b from-green-50 to-green-100 border-t-4 border-green-400">
            <h3 className="text-lg font-bold text-green-800 mb-4 text-center">
              Natural Habitat
            </h3>

            <div className="mb-4">
              <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-green-200 rounded-lg flex items-center justify-center border-2 border-green-300">
                <span className="text-green-700 font-medium">
                  World Map Highlighting Areas
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">
                Areas where this animal lives:
              </h4>
              <div className="flex flex-wrap gap-2">
                {animal.worldMapData.map((area, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {animal.description && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">{animal.description}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnimalCard;
