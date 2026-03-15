import { useEffect, useState } from "react"
import API from "../api/api"
import DeviceMap from "../components/DeviceMap"
import DeviceCard from "../components/DeviceCard"
import SystemPanel from "../components/SystemPanel"

export default function Devices(){

  const [devices,setDevices] = useState([])

  const loadDevices = () => {
  API.get("/devices")
    .then(res => setDevices(res.data))
  }

  useEffect(()=>{
    loadDevices()
    const interval = setInterval(loadDevices,2000)
    return ()=> clearInterval(interval)
  },[])

  // Simulate theft
  const simulateTheft = () => {
    if(devices.length === 0) return
    API.post(`/simulate-theft/${devices[0].device_id}`)
      .then(()=> loadDevices())
      .catch(err => console.error("Theft simulation failed", err))

  }

  return(

  <div className="p-8">

    <h1 className="text-2xl font-bold mb-6">
      Smart Meter Tracking
    </h1>

    <SystemPanel />

    <DeviceMap devices={devices}/>

    {/* Device Cards */}

    <div className="grid grid-cols-3 gap-6 mt-8">

      {devices.map(d => (

        <DeviceCard
          key={d.device_id}
          device={d}
        />

      ))}

    </div>

    {/* Demo Controls */}

    <div className="mt-8">

      <h2 className="font-semibold mb-3">
        Demo Actions
      </h2>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={simulateTheft}
      >
        Simulate Theft
      </button>

    </div>

  </div>

  )
}