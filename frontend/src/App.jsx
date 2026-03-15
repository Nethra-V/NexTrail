import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import Devices from "./pages/Devices"
import Tags from "./pages/Tags"
import Telemetry from "./pages/Telemetry"
import Leaderboard from "./pages/Leaderboard"

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/telemetry" element={<Telemetry />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App