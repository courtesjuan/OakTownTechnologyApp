// src/components/ClientsList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClients, deleteClient } from '../api/api';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';

function ClientsList() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getClients();
      setClients(data);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      const res = await deleteClient(id);
      if (res && res.affectedRows) {
        setClients(clients.filter(client => client.id !== id));
      }
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Clients
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/clients/new">
        Add New Client
      </Button>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {clients.map(client => (
          <Grid item xs={12} sm={6} md={4} key={client.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {client.first_name} {client.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {client.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {client.phone}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/clients/${client.id}`}>
                  View Details
                </Button>
                <Button size="small" component={Link} to={`/clients/edit/${client.id}`}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(client.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ClientsList;
