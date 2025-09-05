import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

function Dogs() {
  const [dogs, setDogs] = useState([]);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDogs();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${config.API_BASE_URL}/dogs/`,
        {
          name,
          breed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setName('');
      setBreed('');
      fetchDogs();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao salvar cão');
    }
  };

  return (
    <div className="dogs-container">
      <h2>Meus Cães</h2>
      <form onSubmit={handleSubmit} className="dog-form">
        <input
          type="text"
          placeholder="Nome do Cão"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Raça (opcional)"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />
        <button type="submit">Adicionar Cão</button>
      </form>
      <div className="dog-list">
        {dogs.length === 0 ? (
          <p>Nenhum cão cadastrado ainda.</p>
        ) : (
          <ul>
            {dogs.map((dog) => (
              <li key={dog.id}>
                {dog.name} {dog.breed && `(${dog.breed})`}
              </li>
            ))}
          </ul>
        )}
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Dogs;


