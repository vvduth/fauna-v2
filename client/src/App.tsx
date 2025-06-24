import "./App.css";
import MapCanvas from "./components/MapCanvas";
import Controls from "./components/Control";

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow-md z-10">
        <h1 className="text-center text-3xl font-bold text-rose-600 p-4">
          Fauna - Web Board Game
        </h1>
      </header>

      <main className="flex-grow relative overflow-hidden">
        <MapCanvas />
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 shadow-inner">
        <Controls />
      </footer>
    </div>
  );
}

export default App;
