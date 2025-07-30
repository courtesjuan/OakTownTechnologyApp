import React, { useEffect, useState } from 'react';
import { getClients } from '../api/api';

function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      const data = await getClients();
      setClients(data);
    }
    fetchClients();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <ul>
        {clients.map(client => (
          <li key={client.id}>
            <strong>{client.name}</strong> - {client.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clients;
