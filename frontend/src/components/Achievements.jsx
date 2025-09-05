import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import MapComponent from './MapComponent';

function Achievements() {
  const [totalWalks, setTotalWalks] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [walkHistory, setWalkHistory] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserStats();
    fetchWalkHistory();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/social/user_stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const stats = response.data;
      setTotalWalks(stats.total_walks);
      setTotalDistance(stats.total_distance);
      setTotalDuration(stats.total_duration);
      setTotalPoints(stats.total_points);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao buscar estatísticas do usuário');
    }
  };

  const fetchWalkHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/walks/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWalkHistory(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao buscar histórico de passeios');
    }
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
    <div className="achievements-container">
      <h2>Conquistas</h2>
      <div className="stats-cards">
        <div className="card">
          <h3>Passeios Realizados</h3>
          <p>{totalWalks}</p>
        </div>
        <div className="card">
          <h3>Distância Total</h3>
          <p>{totalDistance.toFixed(2)} km</p>
        </div>
        <div className="card">
          <h3>Tempo Total</h3>
          <p>{formatTime(totalDuration)}</p>
        </div>
        <div className="card">
          <h3>Pontos Totais</h3>
          <p>{totalPoints}</p>
        </div>
      </div>

      <h3>Histórico de Passeios</h3>
      {message && <p className="message">{message}</p>}
      {walkHistory.length === 0 ? (
        <p>Nenhum passeio registrado ainda.</p>
      ) : (
        <div className="walk-history-list">
          {walkHistory.map((walk) => (
            <div key={walk.id} className="walk-item">
              <p><strong>Cão ID:</strong> {walk.dog_id}</p>
              <p><strong>Distância:</strong> {walk.distance.toFixed(2)} km</p>
              <p><strong>Duração:</strong> {formatTime(walk.duration)}</p>
              <p><strong>Pontos:</strong> {walk.points}</p>
              <p><strong>Início:</strong> {new Date(walk.start_time).toLocaleString()}</p>
              <p><strong>Fim:</strong> {new Date(walk.end_time).toLocaleString()}</p>
              {/* MapComponent will be integrated here if path data is available for past walks */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Achievements;


