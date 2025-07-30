// src/components/LandingPage.js
import React from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { loginRequest } from '../authConfig';

function LandingPage() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => {
      console.error(e);
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0ad4fa, #1a1a1a)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
          Oak Town Tech – Team Portal
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#1a1a1a' }}>
          Welcome to the team portal
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#333' }}>
          Sign in with SSO to access our collaborative platform and work on our innovative projects.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
          sx={{ textTransform: 'none', fontSize: 16, px: 3, py: 1 }}
        >
          Sign In with SSO
        </Button>
      </Paper>
    </Box>
  );
}

export default LandingPage;
