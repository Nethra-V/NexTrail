import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <div className="bg-gray-900 text-white p-4 flex gap-6">
      <Link to="/">Dashboard</Link>
      <Link to="/devices">Devices</Link>
      <Link to="/tags">Tags</Link>
      <Link to="/telemetry">Telemetry</Link>
      <Link to="/leaderboard">Leaderboard</Link>
    </div>
  )
}