'use client';

import React, { createContext, useContext, useState } from 'react';
import { InvoiceData } from '@/lib/types';
import { generateInvoiceNumber, getTodayDate, getDefaultDueDate } from '@/lib/invoiceNumber';
import { saveInvoice, getInvoice } from '@/lib/storage';

interface InvoiceContextType {
  invoiceData: InvoiceData;
  setInvoiceData: (data: InvoiceData) => void;
  updateInvoiceData: (updates: Partial<InvoiceData>) => void;
  currentInvoiceId: string | null;
  setCurrentInvoiceId: (id: string | null) => void;
  saveCurrentInvoice: () => string | null;
  loadInvoice: (id: string) => boolean;
  resetToNew: () => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

const getDefaultInvoiceData = (): InvoiceData => ({
  business: {
    name: '',
    logo: '',
    address: '',
    email: '',
    phone: '',
    gstNumber: '',
  },
  client: {
    name: '',
    address: '',
    email: '',
    phone: '',
    gstNumber: '',
  },
  metadata: {
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: getTodayDate(),
    dueDate: getDefaultDueDate(),
    currency: 'INR',
  },
  lineItems: [
    {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ],
  summary: {
    subtotal: 0,
    taxPercent: 0,
    taxAmount: 0,
    discount: 0,
    grandTotal: 0,
  },
  notes: '',
  paymentTerms: '',
});

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(getDefaultInvoiceData());
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);

  const updateInvoiceData = (updates: Partial<InvoiceData>) => {
    setInvoiceData(prev => ({ ...prev, ...updates }));
  };

  const saveCurrentInvoice = (): string | null => {
    const savedId = saveInvoice(invoiceData, currentInvoiceId || undefined);
    if (savedId && !currentInvoiceId) {
      setCurrentInvoiceId(savedId);
    }
    return savedId;
  };

  const loadInvoice = (id: string): boolean => {
    const stored = getInvoice(id);
    if (stored) {
      setInvoiceData(stored.data);
      setCurrentInvoiceId(id);
      return true;
    }
    return false;
  };

  const resetToNew = () => {
    setInvoiceData(getDefaultInvoiceData());
    setCurrentInvoiceId(null);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoiceData,
        setInvoiceData,
        updateInvoiceData,
        currentInvoiceId,
        setCurrentInvoiceId,
        saveCurrentInvoice,
        loadInvoice,
        resetToNew,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
}
