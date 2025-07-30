import { jsPDF } from 'jspdf';
import dayjs from 'dayjs';
import ottInvLogo from '../assets/ottinvlogo.jpg';

const generateInvoicePDF = ({ invoiceData, selectedClient, lineItems }) => {
  const doc = new jsPDF('p', 'pt');
  doc.setFont('helvetica', 'normal');

  const black = [0, 0, 0];
  const white = [255, 255, 255];
  const darkGray = [43, 43, 43];
  const green = [56, 122, 61];       // #387A3D
  const yellow = [255, 243, 127];    // #FFF37F
  const lightGray = [244, 244, 244]; // #F4F4F4

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const left = 40;
  const usableWidth = pageWidth - 2 * left;

  // Header - Invoice #
  const invoiceNumber = invoiceData?.invoice_number || 'OTT-XXX';
  doc.setFontSize(24).setFont('helvetica', 'bold').setTextColor(...black);
  doc.text(`INVOICE #${invoiceNumber}`, left, 60);
  doc.setFontSize(12).setFont('helvetica', 'normal')
     .text(dayjs(invoiceData?.invoice_date).format('DDMMMYYYY').toUpperCase(), left, 80);
  doc.setDrawColor(...black).setLineWidth(1).line(left, 90, left + 200, 90);

  // Company Info
  doc.setFontSize(12).setTextColor(...black);
  let y = 110;
  doc.text('OakTown Technology', left, y); y += 18;
  doc.text('1901 Harrison Street, Suite 1100 - #8057', left, y); y += 16;
  doc.text('Oakland, CA 94601', left, y); y += 16;
  doc.text('bills@oaktowntechnology.com', left, y); y += 16;
  doc.text('(510) 563 - 7149', left, y);

  // Logo
  try {
    doc.addImage(ottInvLogo, 'JPEG', pageWidth - 230, 30, 180, 120);
  } catch {}

  // Bill To & Description Sections
  const sectionTop = 200;
  const sectionH = 80;
  const halfW = usableWidth / 2 - 10;

  // Bill To header
  doc.setFillColor(...green).rect(left, sectionTop, halfW, 30, 'F');
  doc.setFontSize(12).setTextColor(...white)
     .text('Bill To', left + 10, sectionTop + 20);
  // Bill To body
  doc.setFillColor(...yellow).rect(left, sectionTop + 30, halfW, sectionH, 'F');
  const client = selectedClient;
  let btY = sectionTop + 48;
  doc.setFontSize(10).setTextColor(...black);
  if (client) {
    const fullName = `${client.first_name || ''} ${client.last_name || ''}`.trim();
    if (fullName) {
      doc.text(fullName, left + 10, btY);
      btY += 16;
    }
    [ client.company,
      client.address_line1,
      client.address_line2,
      `${client.city}, ${client.state} ${client.zip}`.trim()
    ].filter(Boolean).forEach(line => {
      doc.text(line, left + 10, btY);
      btY += 16;
    });
  } else {
    doc.text('Client details not available', left + 10, btY);
  }

  // Description header
  doc.setFillColor(...green).rect(left + halfW + 20, sectionTop, halfW, 30, 'F');
  doc.setFontSize(12).setTextColor(...white)
     .text('Description of Work', left + halfW + 30, sectionTop + 20);
  // Description body
  doc.setFillColor(...yellow).rect(left + halfW + 20, sectionTop + 30, halfW, sectionH, 'F');
  doc.setFontSize(10).setTextColor(...black)
     .text(invoiceData.description || 'Troubleshoot office phones not working',
           left + halfW + 30, sectionTop + 48, { maxWidth: halfW - 20 });

  // Contact box
  const contactTop = sectionTop + sectionH + 60;
  doc.setFillColor(...green).rect(left, contactTop, usableWidth, 30, 'F');
  doc.setFontSize(12).setTextColor(...white).text('Contact', left + 10, contactTop + 20);
  doc.setFillColor(...yellow).rect(left, contactTop + 30, usableWidth, 30, 'F');
  doc.setFontSize(10).setTextColor(...black)
     .text(client?.email || '—', left + 10, contactTop + 50);

  // Table header
  const tableTop = contactTop + 80;
  doc.setFillColor(...lightGray).rect(left, tableTop, usableWidth, 30, 'F');
  doc.setFontSize(11).setTextColor(...black).setFont('helvetica', 'bold');
  doc.text('Activity', left + 10, tableTop + 20);
  doc.text('Unit Price', left + usableWidth / 2, tableTop + 20, { align: 'center' });
  doc.text('Quantity', left + usableWidth - 10, tableTop + 20, { align: 'right' });

  // Line items
  let currentY = tableTop + 40;
  doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...black);
  lineItems.forEach(item => {
    const rateNum = parseFloat(item.rate) || 0;
    const qtyNum  = parseFloat(item.quantity) || 0;
    doc.text(item.activity || '', left + 10, currentY);
    doc.text(`$${rateNum.toFixed(2)}`, left + usableWidth / 2, currentY, { align: 'center' });
    doc.text(`${qtyNum}`, left + usableWidth - 10, currentY, { align: 'right' });
    currentY += 24;
  });

  // Footer – Thank you!
  doc.setFont('helvetica', 'italic').setFontSize(16).setTextColor(...black);
  doc.text('Thank you!', pageWidth / 2, pageHeight - 80, { align: 'center' });

  // Save
  doc.save(`Invoice_${invoiceNumber}.pdf`);
};

export default generateInvoicePDF;
