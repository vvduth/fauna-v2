import "./App.css";
import MapCanvas from "./components/MapCanvas";
import Controls from "./components/Control";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "./components/UI/tooltip";
import { Toaster } from "./components/UI/sonner";

const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MapCanvas />} />
      
    </Routes>
  </BrowserRouter>        
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
