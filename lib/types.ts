/**
 * Type definitions for Invoice Generator
 */

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface BusinessDetails {
  name: string;
  logo: string;
  address: string;
  email: string;
  phone: string;
  gstNumber: string;
}

export interface ClientDetails {
  name: string;
  address: string;
  email: string;
  phone: string;
  gstNumber: string;
}

export interface InvoiceMetadata {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
}

export interface InvoiceSummary {
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discount: number;
  grandTotal: number;
}

export interface InvoiceData {
  business: BusinessDetails;
  client: ClientDetails;
  metadata: InvoiceMetadata;
  lineItems: LineItem[];
  summary: InvoiceSummary;
  notes: string;
  paymentTerms: string;
}


