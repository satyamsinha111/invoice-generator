'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllInvoices, deleteInvoice, duplicateInvoice, getStorageStats, StoredInvoice } from '@/lib/storage';

type ViewMode = 'card' | 'list';

export default function InvoiceListPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
  const [storageStats, setStorageStats] = useState({ count: 0, sizeKB: 0, available: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

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
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* GitHub Link */}
              <a
                href="https://github.com/satyamsinha111/invoice-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="View on GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              
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
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar and View Toggle */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
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
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2.5 rounded-l-lg transition-colors ${
                  viewMode === 'card'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Card View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-r-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Invoice Display - Card View */}
          {viewMode === 'card' && (
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
          )}

          {/* Invoice Display - List View */}
          {viewMode === 'list' && (
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-4 flex items-center gap-4">
                    {/* Invoice Number & Client */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {invoice.data.metadata.invoiceNumber}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          new Date(invoice.data.metadata.dueDate) < new Date()
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {new Date(invoice.data.metadata.dueDate) < new Date() ? 'Overdue' : 'Active'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {invoice.data.client.name || 'No client'}
                      </p>
                    </div>

                    {/* Dates */}
                    <div className="hidden md:flex flex-col items-end min-w-[140px]">
                      <span className="text-xs text-gray-500">Created {formatDate(invoice.createdAt)}</span>
                      <span className="text-xs text-gray-500">Due {formatDate(invoice.data.metadata.dueDate)}</span>
                    </div>

                    {/* Total */}
                    <div className="flex flex-col items-end min-w-[120px]">
                      <span className="text-xs text-gray-500 mb-0.5">Total</span>
                      <span className="font-semibold text-gray-900 text-sm">
                        {invoice.data.metadata.currency} {invoice.data.summary.grandTotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(invoice.id)}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(invoice.id)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDuplicate(invoice.id)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        title="Duplicate"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredInvoices.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-600">No invoices match your search</p>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
            <div className="flex items-center justify-center space-x-4 mb-3">
              <a
                href="https://github.com/satyamsinha111/invoice-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Star on GitHub
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="https://github.com/satyamsinha111/invoice-generator/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contribute
              </a>
            </div>
            <p className="text-xs text-gray-500">
              Invoice Generator - Open source and professional
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
