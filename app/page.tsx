'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllInvoices, deleteInvoice, duplicateInvoice, getStorageStats, StoredInvoice } from '@/lib/storage';

export default function InvoiceListPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
  const [storageStats, setStorageStats] = useState({ count: 0, sizeKB: 0, available: true });
  const [searchTerm, setSearchTerm] = useState('');

  // Load invoices on mount
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    const allInvoices = getAllInvoices();
    setInvoices(allInvoices);
    setStorageStats(getStorageStats());
  };

  const handleCreateNew = () => {
    router.push('/invoice/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/invoice/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
      loadInvoices();
    }
  };

  const handleDuplicate = (id: string) => {
    const newId = duplicateInvoice(id);
    if (newId) {
      loadInvoices();
      router.push(`/invoice/${newId}`);
    }
  };

  const handleView = (id: string) => {
    router.push(`/preview/${id}`);
  };

  // Filter invoices based on search
  const filteredInvoices = invoices.filter(invoice =>
    invoice.data.metadata.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.data.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.data.business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Show create form if no invoices
  if (invoices.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          {/* Empty State Icon */}
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            No Invoices Yet
          </h1>
          <p className="text-gray-600 mb-8">
            Create your first professional invoice in minutes
          </p>

          <button
            onClick={handleCreateNew}
            className="btn-primary inline-flex items-center px-6 py-3 text-base"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create First Invoice
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo Icon */}
              <div className="bg-blue-600 rounded-lg p-2.5 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              {/* Brand Text */}
              <div>
                <h1 className="text-xl font-semibold text-gray-900 leading-tight">
                  Invoice Generator
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} • {storageStats.sizeKB}KB used
                </p>
              </div>
            </div>
            
            {/* Create Button */}
            <button
              onClick={handleCreateNew}
              className="btn-primary inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Invoice
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search invoices by number, client, or business..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 pr-4"
              />
            </div>
          </div>

          {/* Invoice Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                {/* Invoice Card Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base mb-1">
                        {invoice.data.metadata.invoiceNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {invoice.data.client.name || 'No client'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      new Date(invoice.data.metadata.dueDate) < new Date()
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {new Date(invoice.data.metadata.dueDate) < new Date() ? 'Overdue' : 'Active'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-semibold text-gray-900">
                      {invoice.data.metadata.currency} {invoice.data.summary.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Invoice Card Meta */}
                <div className="px-5 py-3 bg-gray-50 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Created {formatDate(invoice.createdAt)}</span>
                    <span>Due {formatDate(invoice.data.metadata.dueDate)}</span>
                  </div>
                </div>

                {/* Invoice Card Actions */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => handleView(invoice.id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(invoice.id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDuplicate(invoice.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    title="Duplicate"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredInvoices.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-600">No invoices match your search</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
