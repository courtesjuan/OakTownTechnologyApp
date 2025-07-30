// src/api/api.js

// ----------------------------
// Client API Functions
// ----------------------------

// Fetch Clients from the backend
export async function getClients() {
  try {
    const response = await fetch('/api/clients');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return [];
  }
}

// Create a new Client
export async function createClient(client) {
  try {
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to create client:', error);
    return null;
  }
}

// Delete a client
export async function deleteClient(id) {
  try {
    const response = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to delete client:', error);
    return null;
  }
}

// Get a single client by ID
export async function getClientById(id) {
  try {
    const response = await fetch(`/api/clients/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch client:', error);
    return null;
  }
}

// Update a client
export async function updateClient(id, client) {
  try {
    const response = await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to update client:', error);
    return null;
  }
}

// ----------------------------
// Invoice API Functions (New Structure)
// ----------------------------

// Fetch Invoices Summary (header data only; line_items are not returned here)
export async function getInvoices() {
  try {
    const response = await fetch('/api/invoices');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return [];
  }
}

// Create a new Invoice
// The expected invoice object should include: client_id, due_date, status, and line_items (an array of line item objects)
export async function createInvoice(invoice) {
  try {
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to create invoice:', error);
    return null;
  }
}

// Delete an invoice
export async function deleteInvoice(id) {
  try {
    const response = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to delete invoice:', error);
    return null;
  }
}

// Get a single invoice by ID (returns header fields along with a line_items array)
export async function getInvoiceById(id) {
  try {
    const response = await fetch(`/api/invoices/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch invoice:', error);
    return null;
  }
}

// Update an invoice (header & line_items)
export async function updateInvoice(id, invoice) {
  try {
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to update invoice:', error);
    return null;
  }
}
