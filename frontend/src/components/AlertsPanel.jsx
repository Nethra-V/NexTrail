import { useEffect,useState } from "react"
import API from "../api/api"

export default function AlertsPanel(){

 const [alerts,setAlerts] = useState([])

 useEffect(()=>{

   API.get("/alerts")
   .then(res=>setAlerts(res.data))

 },[])

 return(

 <div className="bg-white p-6 shadow rounded-xl">

 <h3 className="font-semibold mb-4">
 System Alerts
 </h3>

 {alerts.map((a,i)=>(

 <div key={i} className="border-b py-2">

 <b>{a.device}</b>

 <p>{a.message}</p>

 </div>

 ))}

 </div>

 )

}