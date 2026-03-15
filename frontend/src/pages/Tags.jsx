import { useEffect, useState } from "react"
import API from "../api/api"

export default function Tags() {

  const [inventory,setInventory] = useState({})
  const [tagId,setTagId] = useState("")
  const [installer,setInstaller] = useState("")
  const [meter,setMeter] = useState("")

  useEffect(()=>{
    fetchInventory()
  },[])

  const fetchInventory = async () => {
    const res = await API.get("/tags/inventory")
    setInventory(res.data)
  }

  const registerTag = async () => {
    await API.post("/tags/register",{ tag_id: tagId })
    fetchInventory()
  }

  const assignTag = async () => {
    await API.post("/tags/assign",{
      tag_id: tagId,
      installer: installer,
      meter_id: meter
    })
    fetchInventory()
  }

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">
        Guardian Tag Management
      </h1>

      {/* Inventory */}
      <div className="grid grid-cols-3 gap-4 mb-8">

        <div className="bg-white shadow rounded p-4">
          <h3>Available</h3>
          <p className="text-xl">{inventory.available}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h3>Assigned</h3>
          <p className="text-xl">{inventory.assigned}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h3>Lost</h3>
          <p className="text-xl">{inventory.lost}</p>
        </div>

      </div>

      {/* Register Tag */}

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Register New Tag</h2>

        <input
          className="border p-2 mr-2"
          placeholder="Tag ID"
          value={tagId}
          onChange={e=>setTagId(e.target.value)}
        />

        <button
          onClick={registerTag}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </div>

      {/* Assign Tag */}

      <div>
        <h2 className="font-semibold mb-2">Assign Tag</h2>

        <input
          className="border p-2 mr-2"
          placeholder="Tag ID"
          onChange={e=>setTagId(e.target.value)}
        />

        <input
          className="border p-2 mr-2"
          placeholder="Installer Name"
          onChange={e=>setInstaller(e.target.value)}
        />

        <input
          className="border p-2 mr-2"
          placeholder="Meter ID"
          onChange={e=>setMeter(e.target.value)}
        />

        <button
          onClick={assignTag}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Assign
        </button>

      </div>

    </div>
  )
}