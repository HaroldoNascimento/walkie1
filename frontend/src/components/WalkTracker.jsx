import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../config';
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

function WalkTracker() {
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState('');
  const [locationError, setLocationError] = useState('');
  const [path, setPath] = useState([]);

  const watchId = useRef(null);
  const startTimeRef = useRef(null);
  const lastPositionRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchDogs();
  }, []);

  useEffect(() => {
    if (dogs.length > 0 && !selectedDog) {
      setSelectedDog(dogs[0].id);
    }
  }, [dogs, selectedDog]);

  const fetchDogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/dogs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDogs(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao buscar cães');
    }
  };

  const startTracking = () => {
    if (!selectedDog) {
      setMessage('Por favor, selecione um cão para iniciar o passeio.');
      return;
    }

    if (!navigator.geolocation) {
      setLocationError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setLocationError('');
    setMessage('');
    setDistance(0);
    setDuration(0);
    setPoints(0);
    setPath([]);
    startTimeRef.current = Date.now();
    lastPositionRef.current = null;

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = [latitude, longitude];
        setPath((prevPath) => {
          const updatedPath = [...prevPath, newPosition];
          if (lastPositionRef.current) {
            const dist = calculateDistance(
              lastPositionRef.current[0],
              lastPositionRef.current[1],
              latitude,
              longitude
            );
            setDistance((prevDistance) => prevDistance + dist);
            setPoints((prevPoints) => prevPoints + Math.floor(dist * 10)); // 10 points per km
          }
          lastPositionRef.current = newPosition;
          return updatedPath;
        });
      },
      (error) => {
        console.error('Erro de geolocalização:', error);
        let errorMessage = 'Erro ao obter localização: ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Permissão negada. Por favor, habilite a geolocalização nas configurações do seu navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Localização indisponível. Verifique sua conexão ou tente novamente.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Tempo limite excedido ao tentar obter a localização.';
            break;
          default:
            errorMessage += 'Erro desconhecido.';
            break;
        }
        setLocationError(errorMessage);
        stopTracking(); // Stop tracking on error
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    intervalRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    setIsTracking(true);
  };

  const stopTracking = async () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);

    if (path.length > 1) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `${config.API_BASE_URL}/walks/`,
          {
            dog_id: selectedDog,
            distance: distance,
            duration: duration,
            points: points,
            start_time: new Date(startTimeRef.current).toISOString(),
            end_time: new Date().toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage('Passeio salvo com sucesso!');
      } catch (error) {
        setMessage(error.response?.data?.message || 'Erro ao salvar o passeio.');
      }
    } else {
      setMessage('Passeio muito curto para ser salvo.');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d / 1000; // in kilometers
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0'),
    ].join(':');
  };

  return (
    <div className="walk-tracker-container">
      <h2>Iniciar Passeio</h2>
      <div className="controls">
        <select
          value={selectedDog || ''}
          onChange={(e) => setSelectedDog(e.target.value)}
          disabled={isTracking}
        >
          <option value="">Selecione um cão</option>
          {dogs.map((dog) => (
            <option key={dog.id} value={dog.id}>
              {dog.name}
            </option>
          ))}
        </select>
        {!isTracking ? (
          <button onClick={startTracking} disabled={!selectedDog}>
            Iniciar Passeio
          </button>
        ) : (
          <button onClick={stopTracking}>Parar Passeio</button>
        )}
      </div>

      {locationError && <p className="error-message">{locationError}</p>}
      {message && <p className="message">{message}</p>}

      <div className="metrics">
        <p>Distância: {distance.toFixed(2)} km</p>
        <p>Tempo: {formatTime(duration)}</p>
        <p>Pontos: {points}</p>
      </div>

      <div className="map-container">
        {(path.length > 0 || !isTracking) && (
          <MapContainer
            center={path.length > 0 ? path[path.length - 1] : [-23.5505, -46.6333]} // Default to São Paulo if no path
            zoom={13}
            style={{ height: '400px', width: '100%' }}
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
            {path.length > 0 && (
              <>
                <Marker position={path[0]} icon={L.divIcon({ className: 'start-marker', html: '<div style="background-color: green; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>' })} />
                <Polyline positions={path} color="blue" />
                <Marker position={path[path.length - 1]} />
                <AutoCenterMap positions={path} />
              </>
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default WalkTracker;


