'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useInvoice } from '@/contexts/InvoiceContext';
import InvoiceForm from '@/components/InvoiceForm';

export default function InvoiceEditorPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;
  const { invoiceData, setInvoiceData, loadInvoice, saveCurrentInvoice, resetToNew } = useInvoice();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load invoice on mount
  useEffect(() => {
    if (invoiceId === 'new') {
      resetToNew();
      setIsLoading(false);
    } else {
      const loaded = loadInvoice(invoiceId);
      if (!loaded) {
        alert('Invoice not found');
        router.push('/');
      }
      setIsLoading(false);
    }
  }, [invoiceId]);

  // Validate form data
  const validateInvoice = (): boolean => {
    const errors: string[] = [];

    // Business validation
    if (!invoiceData.business.name.trim()) {
      errors.push('Business name is required');
    }
    if (!invoiceData.business.address.trim()) {
      errors.push('Business address is required');
    }
    if (!invoiceData.business.email.trim()) {
      errors.push('Business email is required');
    }
    if (!invoiceData.business.phone.trim()) {
      errors.push('Business phone is required');
    }

    // Client validation
    if (!invoiceData.client.name.trim()) {
      errors.push('Client name is required');
    }
    if (!invoiceData.client.address.trim()) {
      errors.push('Client address is required');
    }
    if (!invoiceData.client.email.trim()) {
      errors.push('Client email is required');
    }
    if (!invoiceData.client.phone.trim()) {
      errors.push('Client phone is required');
    }

    // Metadata validation
    if (!invoiceData.metadata.invoiceNumber.trim()) {
      errors.push('Invoice number is required');
    }
    if (!invoiceData.metadata.invoiceDate) {
      errors.push('Invoice date is required');
    }
    if (!invoiceData.metadata.dueDate) {
      errors.push('Due date is required');
    }

    // Line items validation
    if (invoiceData.lineItems.length === 0) {
      errors.push('At least one line item is required');
    }

    invoiceData.lineItems.forEach((item, index) => {
      if (!item.description.trim()) {
        errors.push(`Line item ${index + 1}: Description is required`);
      }
      if (item.quantity <= 0) {
        errors.push(`Line item ${index + 1}: Quantity must be greater than 0`);
      }
      if (item.rate < 0) {
        errors.push(`Line item ${index + 1}: Rate cannot be negative`);
      }
    });

    // Summary validation
    if (invoiceData.summary.taxPercent < 0 || invoiceData.summary.taxPercent > 100) {
      errors.push('Tax percentage must be between 0 and 100');
    }
    if (invoiceData.summary.discount < 0) {
      errors.push('Discount cannot be negative');
    }
    if (invoiceData.summary.grandTotal < 0) {
      errors.push('Grand total cannot be negative');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSaveAndPreview = async () => {
    setValidationErrors([]);
    
    if (!validateInvoice()) {
      return;
    }

    setIsSaving(true);
    const savedId = saveCurrentInvoice();
    setIsSaving(false);

    if (savedId) {
      router.push(`/preview/${savedId}`);
    } else {
      alert('Failed to save invoice. Storage might be full.');
    }
  };

  const handleSave = () => {
    setValidationErrors([]);
    
    if (!validateInvoice()) {
      return;
    }

    setIsSaving(true);
    const savedId = saveCurrentInvoice();
    setIsSaving(false);

    if (savedId) {
      alert('Invoice saved successfully!');
      if (invoiceId === 'new') {
        router.push(`/invoice/${savedId}`);
      }
    } else {
      alert('Failed to save invoice. Storage might be full.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Back Button */}
              <button
                onClick={() => router.push('/')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Brand Text */}
              <div>
                <h1 className="text-xl font-semibold text-gray-900 leading-tight">
                  {invoiceId === 'new' ? 'New Invoice' : 'Edit Invoice'}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {invoiceData.metadata.invoiceNumber}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-secondary inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Error Messages */}
          {validationErrors.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-medium text-red-900 text-sm mb-2">
                    Please fix the following errors:
                  </h3>
                  <ul className="space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-red-800 text-sm flex items-start">
                        <span className="mr-2">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <InvoiceForm invoiceData={invoiceData} onDataChange={setInvoiceData} />

          {/* Preview Button - Sticky at bottom */}
          <div className="sticky bottom-6 mt-8">
            <button
              onClick={handleSaveAndPreview}
              disabled={isSaving}
              className="w-full btn-primary py-3 flex items-center justify-center text-base shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isSaving ? 'Saving...' : 'Save & Preview Invoice'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center">
        <p className="text-xs text-gray-500">
          Invoice auto-saves to secure encrypted storage
        </p>
      </footer>
    </main>
  );
}

