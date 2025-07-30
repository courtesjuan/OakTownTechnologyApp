import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Grid, Stepper, Step, StepLabel, Snackbar, Alert, Box
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import generateInvoicePDF from '../helpers/pdfGenerator';

const steps = ['Client Info', 'Line Items', 'Review'];
const generateUniqueId = () => Date.now() + Math.random().toString(16).slice(2);

const InvoicesWizard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [clients, setClients] = useState([]);
  const [invoice, setInvoice] = useState({
    client_id: '',
    client_first_name: '',
    client_last_name: '',
    client_email: '',
    client_company: '',
    invoice_date: dayjs().format('YYYY-MM-DD'),
    status: 'pending',
  });
  const [lineItems, setLineItems] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then(setClients)
      .catch((err) => console.error('Failed to fetch clients:', err));
  }, []);

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleLineItemChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...lineItems];
    updated[index][name] = value;

    const quantity = parseFloat(updated[index].quantity) || 0;
    const rate = parseFloat(updated[index].rate) || 0;
    updated[index].amount = (quantity * rate).toFixed(2);
    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: generateUniqueId(),
        item_date: dayjs().format('YYYY-MM-DD'),
        activity: '',
        description: '',
        quantity: '',
        rate: '',
        amount: '0.00',
      },
    ]);
  };

  const removeLineItem = (index) => {
    const updated = [...lineItems];
    updated.splice(index, 1);
    setLineItems(updated);
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleGeneratePDF = async () => {
    try {
      const payload = {
        client_id: invoice.client_id,
        invoice_date: invoice.invoice_date,
        status: invoice.status,
        line_items: lineItems,
      };

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save invoice');

      const saved = await response.json();

      const selectedClient = {
        first_name: invoice.client_first_name,
        last_name: invoice.client_last_name,
        email: invoice.client_email,
        company: invoice.client_company,
      };

      generateInvoicePDF({
        invoiceData: {
          invoice_number: saved.invoice_number,
          invoice_date: invoice.invoice_date,
          status: invoice.status,
        },
        selectedClient,
        lineItems,
      });

      setSnackbar({ open: true, message: 'Invoice saved and PDF generated!', severity: 'success' });
      navigate('/invoices');
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Failed to save invoice.', severity: 'error' });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Select Client"
                name="client_id"
                value={invoice.client_id || ''}
                onChange={(e) => {
                  const selected = clients.find((c) => c.id === parseInt(e.target.value));
                  if (selected) {
                    setInvoice((prev) => ({
                      ...prev,
                      client_id: selected.id,
                      client_first_name: selected.first_name || '',
                      client_last_name: selected.last_name || '',
                      client_email: selected.email || '',
                      client_company: selected.company || '',
                    }));
                  }
                }}
                SelectProps={{ native: true }}
              >
                <option value="">-- Select a Client --</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.first_name} {client.last_name} — {client.email}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="First Name" name="client_first_name" value={invoice.client_first_name} onChange={handleInvoiceChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Last Name" name="client_last_name" value={invoice.client_last_name} onChange={handleInvoiceChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Email" name="client_email" value={invoice.client_email} onChange={handleInvoiceChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Company" name="client_company" value={invoice.client_company} onChange={handleInvoiceChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="date" label="Invoice Date" name="invoice_date" value={invoice.invoice_date} onChange={handleInvoiceChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Status" name="status" value={invoice.status} onChange={handleInvoiceChange} />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <>
            {lineItems.map((item, index) => (
              <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <TextField fullWidth label="Date" type="date" name="item_date" value={item.item_date} onChange={(e) => handleLineItemChange(index, e)} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField fullWidth label="Activity" name="activity" value={item.activity} onChange={(e) => handleLineItemChange(index, e)} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Description" name="description" value={item.description} onChange={(e) => handleLineItemChange(index, e)} />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField fullWidth label="Qty" name="quantity" type="number" value={item.quantity} onChange={(e) => handleLineItemChange(index, e)} />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField fullWidth label="Rate" name="rate" type="number" value={item.rate} onChange={(e) => handleLineItemChange(index, e)} />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField fullWidth label="Amount" name="amount" value={item.amount} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button color="error" onClick={() => removeLineItem(index)} startIcon={<DeleteIcon />}>Remove</Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Button variant="outlined" onClick={addLineItem} startIcon={<AddIcon />}>
              Add Line Item
            </Button>
          </>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Review Invoice</Typography>
            <Typography>Client: {invoice.client_first_name} {invoice.client_last_name}</Typography>
            <Typography>Email: {invoice.client_email}</Typography>
            <Typography>Company: {invoice.client_company}</Typography>
            <Typography>Date: {invoice.invoice_date}</Typography>
            <Typography>Status: {invoice.status}</Typography>
            <Typography sx={{ mt: 2 }}>Line Items:</Typography>
            {lineItems.map((item, i) => (
              <Typography key={i}>• {item.activity} — {item.description} (${item.amount})</Typography>
            ))}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Invoice Wizard</Typography>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 4 }}>{renderStepContent()}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button disabled={currentStep === 0} onClick={handleBack}>Back</Button>
          {currentStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleGeneratePDF}>Save & Generate PDF</Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>Next</Button>
          )}
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default InvoicesWizard;
