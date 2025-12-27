/**
 * Invoice Calculation Utilities
 * All currency values are rounded to 2 decimal places
 */

export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

/**
 * Round a number to 2 decimal places
 */
export const roundTo2Decimals = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

/**
 * Calculate the amount for a single line item
 */
export const calculateLineAmount = (quantity: number, rate: number): number => {
  return roundTo2Decimals(quantity * rate);
};

/**
 * Calculate subtotal from all line items
 */
export const calculateSubtotal = (items: LineItem[]): number => {
  const sum = items.reduce((acc, item) => acc + item.amount, 0);
  return roundTo2Decimals(sum);
};

/**
 * Calculate tax amount based on subtotal and tax percentage
 */
export const calculateTaxAmount = (subtotal: number, taxPercent: number): number => {
  return roundTo2Decimals(subtotal * (taxPercent / 100));
};

/**
 * Calculate grand total
 * Formula: subtotal + taxAmount - discount
 */
export const calculateGrandTotal = (
  subtotal: number,
  taxAmount: number,
  discount: number
): number => {
  const total = subtotal + taxAmount - discount;
  return roundTo2Decimals(total);
};

/**
 * Validate that a number is positive
 */
export const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

/**
 * Validate that a number is non-negative
 */
export const isNonNegativeNumber = (value: number): boolean => {
  return !isNaN(value) && value >= 0;
};

/**
 * Validate tax percentage (0-100)
 */
export const isValidTaxPercent = (value: number): boolean => {
  return !isNaN(value) && value >= 0 && value <= 100;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const formatted = roundTo2Decimals(amount).toFixed(2);
  return `${currency} ${formatted}`;
};


