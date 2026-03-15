export default function CarbonCard({value}){

 return(

 <div className="bg-green-50 p-6 rounded-xl shadow">

 <h3 className="font-semibold">
 Carbon Savings
 </h3>

 <p className="text-2xl mt-2">
 {value} kg CO₂
 </p>

 <p className="text-sm text-gray-600">
 Optimized logistics reduced emissions
 </p>

 </div>

 )

}