export default function DeviceCard({device}){

 return(

 <div
 className={`bg-white p-4 shadow rounded-xl ${device.tamper ? "border-2 border-red-500 animate-pulse" : ""}`}
 >

 <h3 className="font-semibold mb-2">
 {device.device_id}
 </h3>

 <p>Battery: {device.battery}%</p>

 <p>Mode: {device.mode}</p>

 <p>Risk Score: {device.risk_score}</p>

 <div className="mt-3">

 <div className="w-full bg-gray-200 h-2 rounded">

 <div
 className="bg-green-500 h-2 rounded"
 style={{width:`${device.battery}%`}}
 />

 </div>

 </div>

 </div>

 )

}