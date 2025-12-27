# Invoice Generator

A **professional, secure** invoice generator web application built with Next.js, TypeScript, and Tailwind CSS. Manage multiple invoices with encrypted storage, search functionality, and PDF generation.

## ✨ Key Features

### 🔐 Secure Storage System
- **Encrypted Storage** - AES encryption for all invoice data
- **Compressed Data** - LZ-String compression saves space (60-80% reduction)
- **Multiple Invoices** - Store and manage hundreds of invoices
- **Auto-Clear** - Automatically clears storage when full
- **Local Only** - All data stays on your device, never uploaded

### 📋 Invoice Management
- **List View** - Browse all invoices with search functionality
- **Create/Edit** - Easy-to-use forms with validation
- **Duplicate** - Copy existing invoices quickly
- **Delete** - Remove invoices with confirmation
- **View** - Preview invoices before downloading
- **Statistics** - See count and storage usage

### 🎯 Professional Design
- **Clean Interface** - Banking-app inspired aesthetic
- **Responsive Grid** - Cards layout adapts to screen size
- **Search** - Find invoices by number, client, or business
- **Status Badges** - See overdue/active status at a glance
- **Empty States** - Friendly onboarding when no invoices exist

### 📋 Invoice Components
- **Business Details**: Name, logo upload, address, email, phone, GST number
- **Client Details**: Name, address, email, phone, GST number
- **Invoice Metadata**: Auto-generated (editable) invoice number, dates, currency selection
- **Dynamic Line Items**: Add/remove items with auto-calculated amounts
- **Automatic Calculations**: Subtotal, tax, discount, and grand total
- **Additional Info**: Notes and payment terms sections

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

That's it! No database, no auth, no complexity.

## 📐 How It Works

### Three-Page System

1. **Invoice List** (`/`) - Homepage
   - See all your invoices in a grid layout
   - Search by invoice number, client name, or business
   - Quick actions: View, Edit, Duplicate, Delete
   - Shows storage statistics
   - Empty state when no invoices exist

2. **Invoice Editor** (`/invoice/new` or `/invoice/[id]`)
   - Create new or edit existing invoices
   - Real-time validation
   - Save button to store invoice
   - Save & Preview button to review immediately

3. **Invoice Preview** (`/preview/[id]`)
   - Professional invoice layout
   - Edit button to return to editor
   - Download PDF button
   - Back button to invoice list

### Secure Storage
- **Encryption**: All invoices encrypted with AES before storage
- **Compression**: LZ-String reduces storage by 60-80%
- **Auto-Save**: Each invoice is securely stored on save
- **Storage Management**: Auto-clears when localStorage is full
- **Local Only**: No cloud sync, complete privacy

## 🎨 Design Philosophy

### Trust-First Approach
- **Professional Colors**: Solid blue and grays, no flashy gradients
- **Clean Typography**: Medium font weights for readability
- **Minimal Decoration**: Focus on content, not visual effects
- **Clear Hierarchy**: Through spacing and typography
- **Banking-App Feel**: Inspires confidence and trust

### Visual Characteristics
- **Background**: Clean gray (`bg-gray-50`)
- **Cards**: Pure white with subtle shadows
- **Primary Color**: Professional blue (`#2563eb`)
- **Borders**: Simple rounded corners (`rounded-md`)
- **Fonts**: Medium (500) to Semibold (600) weights only

## 🔢 Accurate Calculations

All values calculated in real-time with proper rounding:

```typescript
// Line item amount
amount = quantity × rate

// Subtotal
subtotal = sum of all line item amounts

// Tax amount
taxAmount = subtotal × (taxPercent / 100)

// Grand total
grandTotal = subtotal + taxAmount - discount

// All values rounded to 2 decimal places
```

## 📁 Project Structure

```
invoice-generator/
├── app/
│   ├── page.tsx              # Editor page
│   ├── preview/
│   │   └── page.tsx          # Preview page
│   ├── layout.tsx            # Root layout with context
│   ├── globals.css           # Design system
│   └── api/
│       └── generate-pdf/
│           └── route.ts      # PDF generation
│
├── components/
│   ├── InvoiceForm.tsx       # Form component
│   ├── InvoicePreview.tsx    # Preview component
│   └── LineItemsTable.tsx    # Line items table
│
├── contexts/
│   └── InvoiceContext.tsx    # State management
│
├── lib/
│   ├── types.ts              # TypeScript types
│   ├── calculations.ts       # Calculation utilities
│   └── invoiceNumber.ts      # Invoice number generator
│
└── README.md
```

## ✅ Validation

Comprehensive validation before preview:
- All required fields must be filled
- Quantity must be greater than 0
- Rate cannot be negative
- Tax percentage between 0-100%
- Discount must be non-negative
- Grand total cannot be negative

## 📄 PDF Output

Generated PDFs include:
- A4 size format
- Professional layout matching preview
- Proper margins and spacing
- Print-optimized styling
- All business and client information
- Complete line items table
- Accurate summary calculations

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Generation**: Puppeteer
- **State**: React Context API
- **Storage**: localStorage with encryption & compression
- **Encryption**: crypto-js (AES)
- **Compression**: lz-string
- **Runtime**: Node.js

## 💻 Development

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🎯 Use Cases

Perfect for:
- Freelancers and consultants
- Small businesses
- Professional service providers
- Anyone needing clean, trustworthy invoices

## 🎨 Design Goals

✅ **Professional** - Banking-app aesthetic  
✅ **Trustworthy** - Clean and minimal  
✅ **Focused** - Separate pages for editing and preview  
✅ **Simple** - No unnecessary decoration  
✅ **Clear** - Easy to understand and use  

## 📚 Documentation

- **README.md** (this file) - Project overview
- **STORAGE-SYSTEM.md** - Complete storage & encryption docs
- **SETUP.md** - Detailed setup instructions
- **UPDATED-DESIGN.md** - Design system documentation
- **HEADER-IMPROVEMENTS.md** - Header design details

## 🌟 What Makes This Professional?

1. **Clean Design** - No loud colors or flashy effects
2. **Focused UX** - Separate pages reduce cognitive load
3. **Clear Navigation** - Always know where you are
4. **Proper Validation** - Prevents errors before they happen
5. **Auto-Save** - Never lose your work
6. **Professional Output** - PDFs that look trustworthy

## 🚫 Intentional Limitations

This is a focused invoice generator:
- No authentication system
- No database storage
- No cloud integration
- No AI features
- No payment processing

These limitations keep the app simple, fast, and focused on generating professional invoices.

## 📝 License

Open source and available for personal and commercial use.

---

**Built with Next.js, TypeScript, and Tailwind CSS**

*A professional invoice generator that inspires trust and confidence.* 🎯
