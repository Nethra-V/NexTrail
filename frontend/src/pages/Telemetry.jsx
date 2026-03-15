import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 Tooltip,
 CartesianGrid
} from "recharts"

const data = [
 {time:"10:00", power:120},
 {time:"11:00", power:160},
 {time:"12:00", power:180},
 {time:"13:00", power:220}
]

export default function Telemetry(){

 return(

 <div className="p-8">

   <h1 className="text-2xl font-bold mb-6">
     Meter Telemetry Analytics
   </h1>

   <LineChart width={700} height={350} data={data}>

     <CartesianGrid strokeDasharray="3 3"/>

     <XAxis dataKey="time"/>

     <YAxis/>

     <Tooltip/>

     <Line
       type="monotone"
       dataKey="power"
       stroke="#22c55e"
     />

   </LineChart>

 </div>

 )

}