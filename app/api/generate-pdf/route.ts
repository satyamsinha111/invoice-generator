import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { InvoiceData } from '@/lib/types';

/**
 * Generate invoice HTML template for PDF
 */
function generateInvoiceHTML(data: InvoiceData): string {
  const { business, client, metadata, lineItems, summary, notes, paymentTerms } = data;

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${metadata.invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 12px;
          line-height: 1.6;
          color: #333;
          padding: 40px;
          background: white;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #2563eb;
        }
        
        .business-info {
          flex: 1;
        }
        
        .logo {
          max-height: 60px;
          margin-bottom: 15px;
        }
        
        .business-name {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        
        .invoice-title {
          text-align: right;
        }
        
        .invoice-title h1 {
          font-size: 36px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        
        .invoice-meta {
          font-size: 11px;
          color: #6b7280;
        }
        
        .invoice-meta p {
          margin: 3px 0;
        }
        
        .info-text {
          font-size: 11px;
          color: #6b7280;
          line-height: 1.5;
        }
        
        .info-text p {
          margin: 2px 0;
        }
        
        .bill-to {
          margin-bottom: 30px;
        }
        
        .bill-to h3 {
          font-size: 10px;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 10px;
          font-weight: 600;
        }
        
        .bill-to-content {
          background: #f9fafb;
          padding: 15px;
          border-radius: 5px;
        }
        
        .bill-to-name {
          font-weight: bold;
          font-size: 13px;
          color: #1f2937;
          margin-bottom: 8px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        
        thead {
          background: #f3f4f6;
        }
        
        th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        
        th.text-center {
          text-align: center;
        }
        
        th.text-right {
          text-align: right;
        }
        
        td {
          padding: 12px;
          border: 1px solid #d1d5db;
          font-size: 11px;
        }
        
        td.text-center {
          text-align: center;
        }
        
        td.text-right {
          text-align: right;
        }
        
        .summary {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        }
        
        .summary-table {
          width: 320px;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 12px;
        }
        
        .summary-row.total {
          font-size: 16px;
          font-weight: bold;
          padding-top: 12px;
          border-top: 2px solid #d1d5db;
        }
        
        .summary-label {
          color: #6b7280;
        }
        
        .summary-value {
          font-weight: 500;
        }
        
        .total .summary-value {
          color: #2563eb;
        }
        
        .notes-section {
          margin-bottom: 20px;
        }
        
        .notes-section h3 {
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .notes-content {
          font-size: 11px;
          color: #6b7280;
          background: #f9fafb;
          padding: 12px;
          border-radius: 5px;
          white-space: pre-line;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 10px;
          color: #9ca3af;
        }
        
        @media print {
          body {
            padding: 20px;
          }
        }
        
        @page {
          size: A4;
          margin: 20mm;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <div class="business-info">
            ${business.logo ? `<img src="${business.logo}" alt="Logo" class="logo">` : ''}
            <div class="business-name">${business.name || 'Your Business'}</div>
            <div class="info-text">
              ${business.address ? `<p>${business.address.replace(/\n/g, '<br>')}</p>` : ''}
              ${business.email ? `<p>Email: ${business.email}</p>` : ''}
              ${business.phone ? `<p>Phone: ${business.phone}</p>` : ''}
              ${business.gstNumber ? `<p>GST: ${business.gstNumber}</p>` : ''}
            </div>
          </div>
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <div class="invoice-meta">
              <p><strong>${metadata.invoiceNumber || 'INV-XXXXX'}</strong></p>
              <p>Date: ${formatDate(metadata.invoiceDate)}</p>
              <p>Due: ${formatDate(metadata.dueDate)}</p>
            </div>
          </div>
        </div>

        <!-- Bill To -->
        <div class="bill-to">
          <h3>Bill To</h3>
          <div class="bill-to-content">
            <div class="bill-to-name">${client.name || 'Client Name'}</div>
            <div class="info-text">
              ${client.address ? `<p>${client.address.replace(/\n/g, '<br>')}</p>` : ''}
              ${client.email ? `<p>Email: ${client.email}</p>` : ''}
              ${client.phone ? `<p>Phone: ${client.phone}</p>` : ''}
              ${client.gstNumber ? `<p>GST: ${client.gstNumber}</p>` : ''}
            </div>
          </div>
        </div>

        <!-- Line Items -->
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-center" style="width: 80px;">Qty</th>
              <th class="text-right" style="width: 120px;">Rate</th>
              <th class="text-right" style="width: 120px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${lineItems.map(item => `
              <tr>
                <td>${item.description || '-'}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">${metadata.currency} ${item.rate.toFixed(2)}</td>
                <td class="text-right"><strong>${metadata.currency} ${item.amount.toFixed(2)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Summary -->
        <div class="summary">
          <div class="summary-table">
            <div class="summary-row">
              <span class="summary-label">Subtotal:</span>
              <span class="summary-value">${metadata.currency} ${summary.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Tax (${summary.taxPercent}%):</span>
              <span class="summary-value">${metadata.currency} ${summary.taxAmount.toFixed(2)}</span>
            </div>
            ${summary.discount > 0 ? `
              <div class="summary-row">
                <span class="summary-label">Discount:</span>
                <span class="summary-value" style="color: #dc2626;">- ${metadata.currency} ${summary.discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="summary-row total">
              <span class="summary-label">Total:</span>
              <span class="summary-value">${metadata.currency} ${summary.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Notes -->
        ${notes ? `
          <div class="notes-section">
            <h3>Notes:</h3>
            <div class="notes-content">${notes}</div>
          </div>
        ` : ''}

        <!-- Payment Terms -->
        ${paymentTerms ? `
          <div class="notes-section">
            <h3>Payment Terms:</h3>
            <div class="notes-content">${paymentTerms}</div>
          </div>
        ` : ''}

        <!-- Footer -->
        <div class="footer">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * POST endpoint to generate PDF from invoice data
 */
export async function POST(request: NextRequest) {
  try {
    const invoiceData: InvoiceData = await request.json();

    // Generate HTML from invoice data
    const html = generateInvoiceHTML(invoiceData);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    // Set content and wait for images to load
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
    });

    await browser.close();

    // Return PDF as response (convert Buffer to Uint8Array for proper typing)
    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceData.metadata.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}


