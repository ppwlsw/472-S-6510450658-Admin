import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface MapClientProps {
    position: [number, number] | null;
    setPosition: (position: [number, number] | null) => void;
    className?: string;
    placeName?: string | null;
    setPlaceName?: (placeName: string) => void;
}

export default function MapClient({position, setPosition, placeName, setPlaceName, className}: MapClientProps) {

  async function fetchPlaceName(lat: number, lng: number) {
    if (setPlaceName) {
        try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data.display_name) {
          setPlaceName(data.display_name);
        } else {
          setPlaceName("ไม่พบชื่อสถานที่");
        }
      } catch (error) {
        console.error("Error fetching place name:", error);
        setPlaceName("Error loading location");
      }
    }
  }
  function LocationMarker() {
    if (setPlaceName) {
      useMapEvents({
        click(e:any ) {
          const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
          setPosition(newPosition);
          fetchPlaceName(newPosition[0], newPosition[1]);
        },
      });
      return position ? (
        <Marker position={position}>
          <Popup>{placeName ? placeName : "กำลังโหลด..."}</Popup>
        </Marker>
      ) : null;
    }
    else {
      useMapEvents({
        click(e:any ) {
          setPosition([e.latlng.lat, e.latlng.lng]);
        },
      });
  
      return position ? <Marker position={position} /> : null;
    }

  }

  useEffect(() => {
    if (position) {
      fetchPlaceName(position[0], position[1]);
    }
  }, [position]);
  
  const center: [number,number] = setPosition != null ? !position ? [13.736717, 100.523186] : position : [13.736717, 100.523186];
  const zoom = 12;

  return (
    <div className={`h-[500px] w-full ${className}`}>
      <MapContainer {...{ center, zoom }} className="h-full w-full rounded-lg shadow-2xl hover:scale-95 transition-all duration-300">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {setPosition != null ? (
            <LocationMarker />
        ) : (
            <Marker position={position}>
                <Popup>{placeName ? placeName : "ตำแหน่งร้านค้า"}</Popup>
            </Marker>
        )}
      </MapContainer>
    </div>
  );
}