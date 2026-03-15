import { useEffect, useState } from "react"
import API from "../api/api"

export default function Leaderboard(){

  const [leaders,setLeaders] = useState([])

  useEffect(()=>{

    API.get("/leaderboard")
    .then(res=>setLeaders(res.data))

  },[])

  return(

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">
        Installer Performance Leaderboard
      </h1>

      <table className="w-full border">

        <thead className="bg-gray-200">

          <tr>
            <th className="p-2 border">Rank</th>
            <th className="p-2 border">Installer</th>
            <th className="p-2 border">Meters Installed</th>
            <th className="p-2 border">Score</th>
          </tr>

        </thead>

        <tbody>

          {leaders.map((l,index)=>(

            <tr
              key={index}
              className={index === 0 ? "bg-yellow-100 font-bold" : ""}
            >

              <td className="border p-2">{index+1}</td>
              <td className="border p-2">{l.installer}</td>
              <td className="border p-2">{l.meters}</td>
              <td className="border p-2">{l.score}%</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}