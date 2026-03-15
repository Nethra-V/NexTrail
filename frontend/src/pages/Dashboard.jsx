import { useEffect, useState } from "react"
import API from "../api/api"
import StatCard from "../components/StatCard"

export default function Dashboard(){

 const [kpis,setKpis] = useState({})

 useEffect(()=>{

   API.get("/kpis")
   .then(res => setKpis(res.data))

 },[])

 return(

 <div className="p-8">

 <h1 className="text-3xl font-bold mb-6">
 Smart Meter Deployment Dashboard
 </h1>

 <div className="grid grid-cols-4 gap-6">

 <StatCard
 title="Active Devices"
 value={kpis.devices}
 />

 <StatCard
 title="Guardian Tags"
 value={kpis.tags}
 />

 <StatCard
 title="Alerts"
 value={kpis.alerts}
 />

 <StatCard
 title="Carbon Saved (kg)"
 value={kpis.carbon}
 />

 </div>

 </div>

 )

}