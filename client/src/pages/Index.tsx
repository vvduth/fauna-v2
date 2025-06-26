import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { players_dummy } from "@/placeholder/dummy";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Separator } from "@/components/UI/separator";
const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-green-800 mb-2">
              Fauna
            </CardTitle>
            <p className="text-lg text-gray-600">
              The Animal Knowledge Board Game
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Players (2-6)</h3>
              <div className="space-y-3">
                {players_dummy.map((player, index) => (
                  <div key={player.id} className="flex gap-2">
                    <Input
                      value={player.name}
                      onChange={(e) => {}}
                      placeholder={`Player ${index + 1}`}
                      className="flex-1"
                    />
                    {player.name.length > 2 && (
                      <Button
                        variant="outline"
                        onClick={() => {}}
                        className="px-3"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                {players_dummy.length < 6 &&  (
                    <Button variant={"outline"}
                    
                        onClick={() => {}}
                    >
                        Add Player
                    </Button>
                )}
                  <Button onClick={() => {}} className="bg-green-600 hover:bg-green-700">
                    Start Game
                  </Button>
              </div>
            </div>

            <Separator />
            <div className="text-sm text-gray-600 space-y-2">
                <h4 className="font-semibold">How to Play:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Each round, guess where an animal lives and its measurements</li>
                  <li>Place guess pieces on the world map or measurement scales</li>
                  <li>Score points for correct and adjacent guesses</li>
                  <li>First to reach the victory threshold wins!</li>
                </ul>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
