import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import api from "../../services/api";
import L from "leaflet";

// Fix Leaflet default marker icon issue
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

interface Incident {
  id: number;
  title: string;
  category: string;
  status: string;
  latitude: number;
  longitude: number;
  location: string;
  image: string;
}

/**
 * Live Incident Map - Displays all incidents with coordinates on an interactive Leaflet map.
 * Uses different colored markers based on incident status.
 */
function LiveMap() {

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultCenter: [number, number] = [20.5937, 78.9629]; // Center of India

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const response = await api.get("/incidents/map");
      setIncidents(response.data);
    } catch (error) {
      console.error("Failed to load map incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get marker color based on incident status.
   */
  const getMarkerColor = (status: string) => {
    switch (status) {
      case "Approved": return "green";
      case "Rejected": return "red";
      default: return "orange";
    }
  };

  /**
   * Create a custom colored marker icon.
   */
  const createColoredIcon = (color: string) => {
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 bg-red-600 text-white">
        <h3 className="text-xl font-bold">📍 Live Incident Map</h3>
        <p className="text-sm opacity-90">
          Showing {incidents.length} incident(s) with location data
        </p>
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow"></div>
          <span className="text-sm">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
          <span className="text-sm">Approved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
          <span className="text-sm">Rejected</span>
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.latitude, incident.longitude]}
            icon={createColoredIcon(getMarkerColor(incident.status))}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h4 className="font-bold text-lg mb-2">{incident.title}</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Category:</span> {incident.category}</p>
                  <p><span className="font-semibold">Location:</span> {incident.location}</p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      incident.status === "Approved" ? "bg-green-100 text-green-700" :
                      incident.status === "Rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {incident.status}
                    </span>
                  </p>
                  {incident.image && (
                    <img
                      src={`http://localhost:8080/uploads/${incident.image}`}
                      alt="Incident"
                      className="w-full h-24 object-cover rounded mt-2"
                    />
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {incidents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No incidents with location data available on the map.
        </div>
      )}
    </div>
  );
}

export default LiveMap;

