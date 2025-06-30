
const GameControls = () => {
  return (
    <div className="lg:col-span-2 animate-fade-in delay-400">
              <div className="backdrop-blur-lg bg-white/10 border-white/20 rounded-2xl p-6 shadow-2xl border">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-emerald-200 flex items-center justify-center gap-2">
                    <span>🎮</span>
                    Game Control
                  </h3>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-4">
                  <button className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                    🎴 Draw Animal Card
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                    ⚡ Start Evaluation
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
                    ⏭️ Next Round
                  </button>
                </div>
                
                {/* Quick Stats */}
                <div className="mt-6 p-4 bg-black/20 rounded-xl">
                  <h4 className="text-emerald-200 font-semibold mb-2 text-center">🏆 Victory Goals</h4>
                  <div className="text-emerald-100 text-xs space-y-1">
                    <div>🥇 2-3 Players: 120 points</div>
                    <div>🥈 4-5 Players: 100 points</div>
                    <div>🥉 6 Players: 80 points</div>
                  </div>
                </div>
              </div>
            </div>
  );
};

export default GameControls;