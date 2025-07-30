// src/components/InvoicesCards.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { getInvoices, deleteInvoice, getInvoiceById, getClientById } from '../api/api';
import generateInvoicePDF from '../helpers/pdfGenerator'; // Shared PDF generator helper

// Helper: Return appropriate Chip color for a status.
const getStatusChipColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'paid':
      return 'success';
    case 'overdue':
      return 'error';
    default:
      return 'default';
  }
};

function InvoicesCards() {
  const [invoices, setInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch invoices from API.
  const fetchData = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete an invoice and update the list.
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      const res = await deleteInvoice(id);
      if (res && res.affectedRows) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      }
    }
  };

  // Handle filter changes.
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Filter invoices according to status.
  const filteredInvoices = invoices.filter((invoice) => {
    if (filterStatus === 'All') return true;
    return invoice.status.toLowerCase() === filterStatus.toLowerCase();
  });

  // -------------------------------------------
  // View PDF Handler
  // -------------------------------------------
  // When "View PDF" is clicked, always fetch the client details from getClientById.
  const handleViewPDF = async (invoiceId, clientId) => {
    console.log("View PDF clicked for invoiceId:", invoiceId, "clientId:", clientId);
    try {
      const invoiceData = await getInvoiceById(invoiceId);
      if (!invoiceData) {
        console.error("No invoice data returned");
        return;
      }
      // Always fetch client details for consistency.
      let clientData = {};
      if (clientId) {
        clientData = await getClientById(clientId);
      }
      console.log("Fetched invoiceData:", invoiceData, "Fetched clientData:", clientData);
      generateInvoicePDF({
        invoiceData,
        selectedClient: clientData,
        lineItems: invoiceData.line_items || [],
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Invoices
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="filter-status-label">Filter by Status</InputLabel>
          <Select
            labelId="filter-status-label"
            value={filterStatus}
            label="Filter by Status"
            onChange={handleFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={fetchData}>
          Refresh
        </Button>
      </Box>
      <Grid container spacing={3}>
        {filteredInvoices.map((invoice) => {
          // Compute total from line items if available, otherwise use invoice.total_due.
          const computedTotal =
            invoice.line_items && invoice.line_items.length > 0
              ? invoice.line_items.reduce(
                  (sum, item) => sum + (parseFloat(item.amount) || 0),
                  0
                )
              : parseFloat(invoice.total_due) || 0;
          return (
            <Grid item xs={12} sm={6} md={4} key={invoice.id}>
              <Card
                sx={{
                  backgroundColor: '#212121',
                  color: '#e8eaed',
                  borderRadius: 2,
                  boxShadow: 8,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.03)' },
                }}
              >
                <CardHeader
                  title={invoice.invoice_number || 'N/A'}
                  subheader={invoice.client_name || 'Unknown Client'}
                  sx={{
                    textAlign: 'center',
                    backgroundColor: '#303134',
                    color: '#e8eaed',
                    fontWeight: 'bold',
                  }}
                />
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Due:</strong>{' '}
                    {invoice.invoice_date
                      ? dayjs(invoice.invoice_date).format('MMM D, YYYY')
                      : 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Total:</strong> ${computedTotal.toFixed(2)}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={invoice.status}
                      color={getStatusChipColor(invoice.status)}
                    />
                  </Box>
                </CardContent>
                <CardActions
                  sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to={`/invoices/edit/${invoice.id}`}
                    sx={{ borderColor: '#0ad4fa', color: '#0ad4fa' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDelete(invoice.id)}
                    sx={{ borderColor: '#ff5252', color: '#ff5252' }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to={`/invoices/details/${invoice.id}`}
                    sx={{ borderColor: '#2196f3', color: '#2196f3' }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      handleViewPDF(invoice.id, invoice.client_id)
                    }
                    sx={{ borderColor: '#0ad4fa', color: '#0ad4fa' }}
                  >
                    View PDF
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default InvoicesCards;
