import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";

function LocationMap() {

  const [position, setPosition] = useState<[number, number]>([19.9975, 73.7898]);

  useEffect(() => {

    navigator.geolocation.getCurrentPosition((location) => {

      setPosition([
        location.coords.latitude,
        location.coords.longitude,
      ]);

    });

  }, []);

  return (

    <MapContainer
      center={position}
      zoom={13}
      style={{
        height: "400px",
        width: "100%",
      }}
    >

      <TileLayer
        attribution="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>

        <Popup>

          Your Current Location

        </Popup>

      </Marker>

    </MapContainer>

  );

}

export default LocationMap;