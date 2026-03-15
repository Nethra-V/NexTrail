import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export default function DeviceMap({devices}) {

  return (

    <MapContainer
      center={[11.0168, 76.9558]}
      zoom={12}
      style={{height:"500px", width:"100%"}}
    >

      <TileLayer
        attribution="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {devices.map((d)=>(

        <Marker key={d.device_id} position={[d.lat,d.lon]}>

          <Popup>

            <b>Device:</b> {d.device_id} <br/>
            Battery: {d.battery}% <br/>
            Mode: {d.mode}

          </Popup>

        </Marker>

      ))}

    </MapContainer>

  )
}