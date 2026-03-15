import { useEffect, useState } from "react"
import API from "../api/api"

export default function SystemPanel(){

 const [devices,setDevices] = useState([])
 const [alerts,setAlerts] = useState([])

 const load = async () => {

  const d = await API.get("/devices")
  setDevices(d.data)

  const a = await API.get("/alerts")
  setAlerts(a.data)

 }

 useEffect(()=>{

  load()

  const interval = setInterval(load,3000)

  return ()=>clearInterval(interval)

 },[])

 const avgBattery =
 devices.length
 ? Math.round(
 devices.reduce((s,d)=>s+d.battery,0)/devices.length
 )
 : 0

 const transit =
 devices.filter(d=>d.mode==="transit").length

 return(

 <div className="grid grid-cols-5 gap-4 mb-6">

 <div className="bg-green-100 p-4 rounded">
 <p className="text-sm">Online Devices</p>
 <h2 className="text-2xl font-bold">
 {devices.length}
 </h2>
 </div>

 <div className="bg-yellow-100 p-4 rounded">
 <p className="text-sm">In Transit</p>
 <h2 className="text-2xl font-bold">
 {transit}
 </h2>
 </div>

 <div className="bg-red-100 p-4 rounded">
 <p className="text-sm">Active Alerts</p>
 <h2 className="text-2xl font-bold">
 {alerts.length}
 </h2>
 </div>

 <div className="bg-blue-100 p-4 rounded">
 <p className="text-sm">Avg Battery</p>
 <h2 className="text-2xl font-bold">
 {avgBattery}%
 </h2>
 </div>

 <div className="bg-purple-100 p-4 rounded">
 <p className="text-sm">Tracked Meters</p>
 <h2 className="text-2xl font-bold">
 {devices.length}
 </h2>
 </div>

 </div>

 )

}