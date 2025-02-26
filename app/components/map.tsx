"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapClientProps {
    position: [number, number] | null;
    setPosition: (position: [number, number] | null) => void;
    className?: string;
}

export default function MapClient({position, setPosition, className}: MapClientProps) {

  function LocationMarker() {
    useMapEvents({
      click(e:any ) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return position ? <Marker position={position} /> : null;
  }

  return (
    <div className={`h-[500px] w-full ${className}`}>
      <MapContainer center={setPosition != null ? [13.736717, 100.523186] : position} zoom={12} className="h-full w-full rounded-lg shadow-2xl hover:scale-95 transition-all duration-300">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {setPosition != null ? (
            <LocationMarker />
        ) : (
            <Marker position={position}>
                <Popup>
                    ตำแหน่งร้านค้า
                </Popup>
            </Marker>
        )}
      </MapContainer>
    </div>
  );
}