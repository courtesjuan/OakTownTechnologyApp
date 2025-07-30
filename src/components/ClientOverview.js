// src/components/ClientOverviewGenZ.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClientById } from '../api/api';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Box,
  Divider
} from '@mui/material';

function ClientOverviewGenZ() {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    async function fetchClient() {
      const data = await getClientById(id);
      setClient(data);
    }
    fetchClient();
  }, [id]);

  if (!client) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" align="center">
          Loading... hang tight!
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 4,
          background: 'linear-gradient(135deg, #2e2e2e, #464646)',
          color: '#fff',
          overflow: 'visible'
        }}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  bgcolor: '#1e1e1e',
                  fontSize: 36,
                  border: '3px solid #fff'
                }}
              >
                {client.first_name.charAt(0)}{client.last_name.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {client.first_name} {client.last_name}
              </Typography>
              <Typography variant="h6" sx={{ fontStyle: 'italic', color: '#ccc' }}>
                {client.email}
              </Typography>
              <Typography variant="h6" sx={{ color: '#ccc' }}>
                {client.phone}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: '#777' }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              Address
            </Typography>
            <Typography variant="body1" sx={{ color: '#ddd' }}>
              {client.address_line1}
              {client.address_line2 ? `, ${client.address_line2}` : ''}
            </Typography>
            <Typography variant="body1" sx={{ color: '#ddd' }}>
              {client.city}, {client.state} {client.zip}
            </Typography>
            <Typography variant="body1" sx={{ color: '#ddd' }}>
              {client.country}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ClientOverviewGenZ;
