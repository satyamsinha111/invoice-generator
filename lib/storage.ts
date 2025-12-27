/**
 * Secure Storage Utility
 * Handles compression, encryption, and storage management for invoices
 */

import CryptoJS from 'crypto-js';
import LZString from 'lz-string';
import { InvoiceData } from './types';

// Encryption key (in production, this should be more secure)
const ENCRYPTION_KEY = 'invoice-gen-secure-key-2024';
const STORAGE_KEY = 'invoices_encrypted';

export interface StoredInvoice {
  id: string;
  data: InvoiceData;
  createdAt: string;
  updatedAt: string;
}

/**
 * Compress data using LZ-String
 */
function compress(data: string): string {
  return LZString.compressToUTF16(data);
}

/**
 * Decompress data using LZ-String
 */
function decompress(data: string): string {
  return LZString.decompressFromUTF16(data) || '';
}

/**
 * Encrypt data using AES
 */
function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

/**
 * Decrypt data using AES
 */
function decrypt(data: string): string {
  const bytes = CryptoJS.AES.decrypt(data, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if localStorage is full
 */
function isStorageFull(): boolean {
  try {
    const test = '__storage_full_test__';
    localStorage.setItem(test, 'x'.repeat(1024 * 1024)); // Try to store 1MB
    localStorage.removeItem(test);
    return false;
  } catch (e) {
    return true;
  }
}

/**
 * Get all invoices from storage
 */
export function getAllInvoices(): StoredInvoice[] {
  if (!isStorageAvailable()) {
    console.warn('localStorage not available');
    return [];
  }

  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) return [];

    const compressed = decrypt(encrypted);
    const jsonStr = decompress(compressed);
    const invoices = JSON.parse(jsonStr) as StoredInvoice[];
    
    return invoices;
  } catch (error) {
    console.error('Error reading invoices:', error);
    return [];
  }
}

/**
 * Save all invoices to storage
 */
function saveAllInvoices(invoices: StoredInvoice[]): boolean {
  if (!isStorageAvailable()) {
    console.warn('localStorage not available');
    return false;
  }

  try {
    const jsonStr = JSON.stringify(invoices);
    const compressed = compress(jsonStr);
    const encrypted = encrypt(compressed);
    
    localStorage.setItem(STORAGE_KEY, encrypted);
    return true;
  } catch (error: any) {
    // Check if storage is full
    if (error.name === 'QuotaExceededError' || isStorageFull()) {
      console.warn('localStorage is full, clearing all data');
      clearAllInvoices();
      // Try again after clearing
      try {
        const jsonStr = JSON.stringify(invoices);
        const compressed = compress(jsonStr);
        const encrypted = encrypt(compressed);
        localStorage.setItem(STORAGE_KEY, encrypted);
        return true;
      } catch (retryError) {
        console.error('Failed to save even after clearing:', retryError);
        return false;
      }
    }
    console.error('Error saving invoices:', error);
    return false;
  }
}

/**
 * Save a single invoice (create or update)
 */
export function saveInvoice(invoice: InvoiceData, id?: string): string | null {
  const invoices = getAllInvoices();
  const now = new Date().toISOString();
  
  if (id) {
    // Update existing invoice
    const index = invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      invoices[index] = {
        id,
        data: invoice,
        createdAt: invoices[index].createdAt,
        updatedAt: now,
      };
    } else {
      return null;
    }
  } else {
    // Create new invoice
    const newId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    invoices.push({
      id: newId,
      data: invoice,
      createdAt: now,
      updatedAt: now,
    });
    id = newId;
  }
  
  const success = saveAllInvoices(invoices);
  return success ? id : null;
}

/**
 * Get a single invoice by ID
 */
export function getInvoice(id: string): StoredInvoice | null {
  const invoices = getAllInvoices();
  return invoices.find(inv => inv.id === id) || null;
}

/**
 * Delete an invoice by ID
 */
export function deleteInvoice(id: string): boolean {
  const invoices = getAllInvoices();
  const filtered = invoices.filter(inv => inv.id !== id);
  
  if (filtered.length === invoices.length) {
    return false; // Invoice not found
  }
  
  return saveAllInvoices(filtered);
}

/**
 * Clear all invoices from storage
 */
export function clearAllInvoices(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing invoices:', error);
  }
}

/**
 * Get storage statistics
 */
export function getStorageStats(): {
  count: number;
  sizeKB: number;
  available: boolean;
} {
  const invoices = getAllInvoices();
  let sizeKB = 0;
  
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (encrypted) {
      sizeKB = Math.round((encrypted.length * 2) / 1024); // UTF-16 = 2 bytes per char
    }
  } catch (error) {
    console.error('Error calculating storage size:', error);
  }
  
  return {
    count: invoices.length,
    sizeKB,
    available: isStorageAvailable(),
  };
}

/**
 * Duplicate an invoice
 */
export function duplicateInvoice(id: string): string | null {
  const invoice = getInvoice(id);
  if (!invoice) return null;
  
  // Create a copy with updated invoice number
  const newInvoiceData = {
    ...invoice.data,
    metadata: {
      ...invoice.data.metadata,
      invoiceNumber: `${invoice.data.metadata.invoiceNumber}-COPY`,
    },
  };
  
  return saveInvoice(newInvoiceData);
}

