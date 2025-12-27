'use client';

import React, { useState, useEffect } from 'react';
import { InvoiceData, LineItem } from '@/lib/types';
import { generateInvoiceNumber, getTodayDate, getDefaultDueDate } from '@/lib/invoiceNumber';
import {
  calculateSubtotal,
  calculateTaxAmount,
  calculateGrandTotal,
  roundTo2Decimals,
} from '@/lib/calculations';
import LineItemsTable from './LineItemsTable';

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  onDataChange: (data: InvoiceData) => void;
}

export default function InvoiceForm({ invoiceData, onDataChange }: InvoiceFormProps) {
  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onDataChange({
          ...invoiceData,
          business: { ...invoiceData.business, logo: reader.result as string },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Update business details
  const updateBusiness = (field: string, value: string) => {
    onDataChange({
      ...invoiceData,
      business: { ...invoiceData.business, [field]: value },
    });
  };

  // Update client details
  const updateClient = (field: string, value: string) => {
    onDataChange({
      ...invoiceData,
      client: { ...invoiceData.client, [field]: value },
    });
  };

  // Update metadata
  const updateMetadata = (field: string, value: string) => {
    onDataChange({
      ...invoiceData,
      metadata: { ...invoiceData.metadata, [field]: value },
    });
  };

  // Update line items and recalculate summary
  const updateLineItems = (items: LineItem[]) => {
    const subtotal = calculateSubtotal(items);
    const taxAmount = calculateTaxAmount(subtotal, invoiceData.summary.taxPercent);
    const grandTotal = calculateGrandTotal(subtotal, taxAmount, invoiceData.summary.discount);

    onDataChange({
      ...invoiceData,
      lineItems: items,
      summary: {
        ...invoiceData.summary,
        subtotal,
        taxAmount,
        grandTotal,
      },
    });
  };

  // Update tax percent and recalculate
  const updateTaxPercent = (value: number) => {
    const taxPercent = Math.max(0, Math.min(100, value)); // Clamp between 0-100
    const taxAmount = calculateTaxAmount(invoiceData.summary.subtotal, taxPercent);
    const grandTotal = calculateGrandTotal(
      invoiceData.summary.subtotal,
      taxAmount,
      invoiceData.summary.discount
    );

    onDataChange({
      ...invoiceData,
      summary: {
        ...invoiceData.summary,
        taxPercent,
        taxAmount,
        grandTotal,
      },
    });
  };

  // Update discount and recalculate
  const updateDiscount = (value: number) => {
    const discount = Math.max(0, value); // Ensure non-negative
    const grandTotal = calculateGrandTotal(
      invoiceData.summary.subtotal,
      invoiceData.summary.taxAmount,
      discount
    );

    onDataChange({
      ...invoiceData,
      summary: {
        ...invoiceData.summary,
        discount,
        grandTotal,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Business Details Section */}
      <div className="form-section">
        <h2 className="section-title">Business Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Business Name *</label>
            <input
              type="text"
              value={invoiceData.business.name}
              onChange={(e) => updateBusiness('name', e.target.value)}
              className="input-field"
              required
              placeholder="Your Business Name"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="label">Logo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="input-field file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer"
            />
            {invoiceData.business.logo && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200 inline-block">
                <img
                  src={invoiceData.business.logo}
                  alt="Business Logo"
                  className="h-16 object-contain"
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="label">Address *</label>
            <textarea
              value={invoiceData.business.address}
              onChange={(e) => updateBusiness('address', e.target.value)}
              className="input-field"
              rows={3}
              required
              placeholder="Business Address"
            />
          </div>

          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              value={invoiceData.business.email}
              onChange={(e) => updateBusiness('email', e.target.value)}
              className="input-field"
              required
              placeholder="business@example.com"
            />
          </div>

          <div>
            <label className="label">Phone *</label>
            <input
              type="tel"
              value={invoiceData.business.phone}
              onChange={(e) => updateBusiness('phone', e.target.value)}
              className="input-field"
              required
              placeholder="+91 1234567890"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">GST Number (Optional)</label>
            <input
              type="text"
              value={invoiceData.business.gstNumber}
              onChange={(e) => updateBusiness('gstNumber', e.target.value)}
              className="input-field"
              placeholder="22AAAAA0000A1Z5"
            />
          </div>
        </div>
      </div>

      {/* Client Details Section */}
      <div className="form-section">
        <h2 className="section-title">Client Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Client Name *</label>
            <input
              type="text"
              value={invoiceData.client.name}
              onChange={(e) => updateClient('name', e.target.value)}
              className="input-field"
              required
              placeholder="Client Name"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Address *</label>
            <textarea
              value={invoiceData.client.address}
              onChange={(e) => updateClient('address', e.target.value)}
              className="input-field"
              rows={3}
              required
              placeholder="Client Address"
            />
          </div>

          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              value={invoiceData.client.email}
              onChange={(e) => updateClient('email', e.target.value)}
              className="input-field"
              required
              placeholder="client@example.com"
            />
          </div>

          <div>
            <label className="label">Phone *</label>
            <input
              type="tel"
              value={invoiceData.client.phone}
              onChange={(e) => updateClient('phone', e.target.value)}
              className="input-field"
              required
              placeholder="+91 9876543210"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">GST Number (Optional)</label>
            <input
              type="text"
              value={invoiceData.client.gstNumber}
              onChange={(e) => updateClient('gstNumber', e.target.value)}
              className="input-field"
              placeholder="22BBBBB0000B1Z5"
            />
          </div>
        </div>
      </div>

      {/* Invoice Metadata Section */}
      <div className="form-section">
        <h2 className="section-title">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Invoice Number *</label>
            <input
              type="text"
              value={invoiceData.metadata.invoiceNumber}
              onChange={(e) => updateMetadata('invoiceNumber', e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label">Currency</label>
            <select
              value={invoiceData.metadata.currency}
              onChange={(e) => updateMetadata('currency', e.target.value)}
              className="input-field"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div>
            <label className="label">Invoice Date *</label>
            <input
              type="date"
              value={invoiceData.metadata.invoiceDate}
              onChange={(e) => updateMetadata('invoiceDate', e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label">Due Date *</label>
            <input
              type="date"
              value={invoiceData.metadata.dueDate}
              onChange={(e) => updateMetadata('dueDate', e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>
      </div>

      {/* Line Items Section */}
      <div className="form-section">
        <h2 className="section-title">Line Items</h2>
        <LineItemsTable items={invoiceData.lineItems} onItemsChange={updateLineItems} />
      </div>

      {/* Summary Section */}
      <div className="form-section">
        <h2 className="section-title">Summary</h2>
        <div className="bg-gray-50 rounded-md p-5 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md ml-auto">
            <div className="text-right font-medium text-gray-700 text-sm">Subtotal:</div>
            <div className="text-right font-semibold text-gray-900">
              {invoiceData.metadata.currency} {invoiceData.summary.subtotal.toFixed(2)}
            </div>

            <div>
              <label className="label text-right">Tax %</label>
              <input
                type="number"
                value={invoiceData.summary.taxPercent}
                onChange={(e) => updateTaxPercent(Number(e.target.value))}
                min="0"
                max="100"
                step="0.01"
                className="input-field"
              />
            </div>
            <div className="text-right self-end pb-2 font-semibold text-gray-900">
              {invoiceData.metadata.currency} {invoiceData.summary.taxAmount.toFixed(2)}
            </div>

            <div>
              <label className="label text-right">Discount</label>
              <input
                type="number"
                value={invoiceData.summary.discount}
                onChange={(e) => updateDiscount(Number(e.target.value))}
                min="0"
                step="0.01"
                className="input-field"
              />
            </div>
            <div className="text-right self-end pb-2 font-medium text-gray-600">
              - {invoiceData.metadata.currency} {invoiceData.summary.discount.toFixed(2)}
            </div>

            <div className="col-span-2 border-t border-gray-300 my-2"></div>

            <div className="text-right font-semibold text-gray-900">Grand Total:</div>
            <div className="text-right font-bold text-xl text-blue-600">
              {invoiceData.metadata.currency} {invoiceData.summary.grandTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Notes and Payment Terms Section */}
      <div className="form-section">
        <h2 className="section-title">Additional Information</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Notes</label>
            <textarea
              value={invoiceData.notes}
              onChange={(e) => onDataChange({ ...invoiceData, notes: e.target.value })}
              className="input-field resize-none"
              rows={3}
              placeholder="Any additional notes or comments..."
            />
          </div>

          <div>
            <label className="label">Payment Terms</label>
            <textarea
              value={invoiceData.paymentTerms}
              onChange={(e) => onDataChange({ ...invoiceData, paymentTerms: e.target.value })}
              className="input-field resize-none"
              rows={3}
              placeholder="Payment terms and conditions..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}


