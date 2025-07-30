// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Updated custom theme based on owner's colors (or your previous CSS)
const theme = createTheme({
  palette: {
    mode: 'light', // Assuming a light theme from your CSS snippet
    primary: {
      main: '#d3d02c', // Header background color
    },
    secondary: {
      main: '#ce3434', // Hover or accent color
    },
    background: {
      default: '#e9e6dd', // Body background color
      paper: '#ffffff',   // Paper background for cards, forms, etc.
    },
    text: {
      primary: '#020202', // Primary text color
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // Matching your CSS default
  },
  shape: {
    borderRadius: 8, // Customize if you want rounded corners
  },
});

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </MsalProvider>
  </React.StrictMode>
);
