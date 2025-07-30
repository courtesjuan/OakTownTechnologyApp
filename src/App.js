// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';
import LandingPage from './components/LandingPage';
import AuthenticatedApp from './AuthenticatedApp';

function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Router>
      {isAuthenticated ? <AuthenticatedApp /> : <LandingPage />}
    </Router>
  );
}

export default App;
