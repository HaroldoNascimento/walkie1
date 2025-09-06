import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icon issues with Leaflet in Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const AutoCenterMap = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds);
    }
  }, [positions, map]);
  return null;
};

function MapComponent({ path }) {
  if (!path || path.length === 0) {
    return <p>Nenhum dado de percurso disponível para este passeio.</p>;
  }

  return (
    <MapContainer
      center={path[0]} // Center map on the start of the path
      zoom={13}
      style={{ height: '300px', width: '100%' }}
      whenCreated={map => {
        // Invalidate size to ensure map renders correctly after container is visible
        setTimeout(() => { map.invalidateSize(); }, 100);
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution=
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline positions={path} color="blue" />
      <Marker position={path[0]} icon={L.divIcon({ className: 'start-marker', html: '<div style="background-color: green; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>' })} />
      <Marker position={path[path.length - 1]} icon={L.divIcon({ className: 'end-marker', html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>' })} />
      <AutoCenterMap positions={path} />
    </MapContainer>
  );
}

export default MapComponent;


