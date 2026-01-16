'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

function LocationMarker({ onLocationSelect }) {
  const map = useMapEvents({
    click(e) {
      if(onLocationSelect) {
        onLocationSelect(e.latlng);
      }
    },
  });
  return null;
}

export default function Map({ center = [10.8505, 76.2711], zoom = 7, markers = [], onMapClick }) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-white/20">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position} icon={defaultIcon}>
            {marker.popup && <Popup>{marker.popup}</Popup>}
          </Marker>
        ))}
        <LocationMarker onLocationSelect={onMapClick} />
      </MapContainer>
    </div>
  );
}