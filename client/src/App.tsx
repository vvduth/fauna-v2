import "./App.css";
import MapCanvas from "./components/MapCanvas";
import Controls from "./components/Control";

function App() {
  return (
     <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      
        <header>
          <h1 className="text-3xl font-bold text-center text-rose-600 p-4 bg-white shadow-md">
            Fauna - Web Board Game
        </h1>
        </header>

      
        <div className="relative w-full h-[600px] bg-gradient-to-b from-sky-300 to-blue-600">
            <MapCanvas />
        </div>

      <footer className="bg-gray-50 border-t border-gray-200 shadow-inner">
        <Controls />
      </footer>
    </div>
  );
}

export default App;
