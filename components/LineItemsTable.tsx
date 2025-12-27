'use client';

import React from 'react';
import { LineItem } from '@/lib/types';
import { calculateLineAmount } from '@/lib/calculations';

interface LineItemsTableProps {
  items: LineItem[];
  onItemsChange: (items: LineItem[]) => void;
}

export default function LineItemsTable({ items, onItemsChange }: LineItemsTableProps) {
  // Add a new line item
  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    onItemsChange([...items, newItem]);
  };

  // Remove a line item (minimum 1 item required)
  const removeItem = (id: string) => {
    if (items.length > 1) {
      onItemsChange(items.filter(item => item.id !== id));
    }
  };

  // Update a specific field in a line item
  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Recalculate amount when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updated.amount = calculateLineAmount(
            Number(updated.quantity),
            Number(updated.rate)
          );
        }
        
        return updated;
      }
      return item;
    });
    onItemsChange(updatedItems);
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Description
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-28">
                  Quantity
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-32">
                  Rate
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase w-32">
                  Amount
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2.5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      required
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      min="0.01"
                      step="0.01"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      required
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                      min="0"
                      step="0.01"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      required
                    />
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="font-semibold text-gray-900 text-sm">
                      {item.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="btn-danger disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                      title={items.length === 1 ? 'At least one item required' : 'Remove item'}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <button
        type="button"
        onClick={addItem}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors font-medium text-sm flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Line Item
      </button>
    </div>
  );
}


