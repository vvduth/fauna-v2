import { useState } from "react";
import "./App.css";
import Header from "./components/UI/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
     <div className="flex flex-col h-screen">
            <Header />
            <main className="flex-grow flex">
               <MapContainer/>
            </main>
            
        </div>
  );
}

export default App;
