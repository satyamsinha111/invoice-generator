'use client';

import React from 'react';
import { InvoiceData } from '@/lib/types';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
}

export default function InvoicePreview({ invoiceData }: InvoicePreviewProps) {
  const { business, client, metadata, lineItems, summary, notes, paymentTerms } = invoiceData;

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

  return (
    <div className="card-preview" id="invoice-preview">
      <div className="p-12 max-w-5xl mx-auto bg-white">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10 pb-8 border-b-2 border-gray-900">
          <div className="flex-1">
            {business.logo && (
              <div className="mb-4">
                <img
                  src={business.logo}
                  alt="Business Logo"
                  className="h-14 object-contain"
                />
              </div>
            )}
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              {business.name || 'Your Business'}
            </h1>
            <div className="text-sm text-gray-600 space-y-0.5 leading-relaxed">
              {business.address && <p className="whitespace-pre-line">{business.address}</p>}
              {business.email && <p>{business.email}</p>}
              {business.phone && <p>{business.phone}</p>}
              {business.gstNumber && <p>GST: {business.gstNumber}</p>}
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              INVOICE
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-base text-gray-900">{metadata.invoiceNumber || 'INV-XXXXX'}</p>
              <p>Date: {formatDate(metadata.invoiceDate)}</p>
              <p>Due: {formatDate(metadata.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="mb-10">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bill To</h3>
          <div className="bg-gray-50 p-5 rounded-md border border-gray-200">
            <p className="font-semibold text-base text-gray-900 mb-2">
              {client.name || 'Client Name'}
            </p>
            <div className="text-sm text-gray-600 space-y-0.5 leading-relaxed">
              {client.address && <p className="whitespace-pre-line">{client.address}</p>}
              {client.email && <p>{client.email}</p>}
              {client.phone && <p>{client.phone}</p>}
              {client.gstNumber && <p>GST: {client.gstNumber}</p>}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-10">
          <div className="overflow-hidden border border-gray-300 rounded-md">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase w-24">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase w-32">
                    Rate
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase w-32">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lineItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                      {metadata.currency} {item.rate.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      {metadata.currency} {item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="flex justify-end mb-10">
          <div className="w-96">
            <div className="bg-gray-50 rounded-md p-5 border border-gray-200">
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    {metadata.currency} {summary.subtotal.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Tax ({summary.taxPercent}%):</span>
                  <span className="font-semibold text-gray-900">
                    {metadata.currency} {summary.taxAmount.toFixed(2)}
                  </span>
                </div>
                
                {summary.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Discount:</span>
                    <span className="font-semibold text-gray-600">
                      - {metadata.currency} {summary.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="border-t border-gray-300 pt-2.5 mt-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {metadata.currency} {summary.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {notes && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-md border border-gray-200 leading-relaxed">
              {notes}
            </p>
          </div>
        )}

        {/* Payment Terms Section */}
        {paymentTerms && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Terms</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-md border border-gray-200 leading-relaxed">
              {paymentTerms}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">Thank you for your business</p>
        </div>
      </div>
    </div>
  );
}
