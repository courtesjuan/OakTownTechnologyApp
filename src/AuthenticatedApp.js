// src/AuthenticatedApp.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import ResponsiveNavBar from './components/ResponsiveNavBar'; // The new nav
import Dashboard from './components/Dashboard';
import ClientsList from './components/ClientsList';
import ClientForm from './components/ClientForm';
import ClientOverview from './components/ClientOverview';
import InvoicesCard from './components/InvoicesCard';
import InvoiceWizard from './components/InvoiceWizard';

function AuthenticatedApp() {
  return (
    <>
      {/* Our fancy new nav */}
      <ResponsiveNavBar />

      {/* Main content area */}
      <Box sx={{ p: 2 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/clients/new" element={<ClientForm />} />
          <Route path="/clients/edit/:id" element={<ClientForm />} />
          <Route path="/clients/:id" element={<ClientOverview />} />
          <Route path="/invoices" element={<InvoicesCard />} />
          <Route path="/invoices/new" element={<InvoiceWizard />} />
          <Route path="/invoices/edit/:id" element={<InvoiceWizard />} />
        </Routes>
      </Box>
    </>
  );
}

export default AuthenticatedApp;
