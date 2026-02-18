# ⬛ Invoice Generator

> A clean, reusable **invoice & quote generator** built with **Next.js 15 App Router** + **TypeScript**. Live preview, print-to-PDF, no backend required.

![Preview](./preview.png)

---

## ✨ Features

- **Invoice & Quote** modes with one-click toggle
- **Live editor** – changes appear instantly in the A4 preview
- **Print / PDF** via native browser print dialog (no external lib)
- **Print / PNG** via native browser print dialog (no external lib)
- **Dynamic line items** – add, remove, auto-calculate totals
- **Optional discount** with custom label
- **Bank details** + §19 UStG Kleinunternehmer notice (optional)
- **A4 preview** pixel-accurate, screen and print
- 🇩🇪 German locale formatting (easily adaptable) & ENG English locale formatting
- 💯 **Zero runtime dependencies** beyond Next.js + React

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── globals.css          # Full design system (CSS variables, layout, print)
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page: editor + live preview
│
├── components/
│   └── invoice/
│       ├── index.ts              # Barrel export
│       ├── InvoiceDocument.tsx   # Composite root component
│       ├── InvoiceHeader.tsx     # Sender / recipient / doc meta
│       ├── InvoiceTable.tsx      # Line items + totals
│       └── InvoiceFooter.tsx     # Bank details, legal notes, closing
│
├── lib/
│   ├── demoData.ts          # DEMO_INVOICE / DEMO_QUOTE dummy data
│   └── utils.ts             # Pure helper functions (formatting, math)
│
└── types/
    └── invoice.ts           # All TypeScript interfaces
```

---

## Quick Start

### Prerequisites

- Node.js ≥ 18
- npm / yarn / pnpm

### Install & Run

```bash
git clone https://github.com/YOUR_USERNAME/invoice-generator.git
cd invoice-generator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo directly at [vercel.com/new](https://vercel.com/new).

---

## 🔧 How to Use as a Component

The `InvoiceDocument` component is fully self-contained and reusable:

```tsx
import { InvoiceDocument } from "@/components/invoice";
import { InvoiceData } from "@/types/invoice";

const myData: InvoiceData = {
  docType: "INVOICE",
  docNumber: "INV-2025-0001",
  issueDate: "2025-03-15",
  paymentTerms: "14 Tage netto",
  sender: {
    name: "Your Company",
    street: "Main Street",
    houseNumber: "1",
    postalCode: "10115",
    city: "Berlin",
    email: "hello@yourcompany.com",
    iban: "DE89 ...",
    taxId: "DE123456789",
  },
  recipient: {
    name: "Client GmbH",
    street: "Client Road",
    houseNumber: "42",
    postalCode: "20095",
    city: "Hamburg",
  },
  lineItems: [
    {
      description: "Web Development",
      unitLabel: "Tage",
      quantity: 5,
      unitPrice: 900,
    },
  ],
};

export default function MyPage() {
  return <InvoiceDocument data={myData} />;
}
```

---

## 📦 Dependencies

| Package      | Version | Purpose                  |
| ------------ | ------- | ------------------------ |
| `next`       | ^14.2.0 | App Router, SSR, routing |
| `react`      | ^18.3.0 | UI rendering             |
| `react-dom`  | ^18.3.0 | DOM rendering            |
| `typescript` | ^5.4.0  | Type safety (dev only)   |

> **No additional runtime dependencies.** Formatting is handled by the native `Intl` API.

---

## 🎨 Design System

The design uses **CSS Variables** and **DM Mono + DM Serif Display** (Google Fonts). The palette is a refined editorial monochrome:

| Variable      | Value     | Usage               |
| ------------- | --------- | ------------------- |
| `--c-accent`  | `#2a6ca8` | Accent / table head |
| `--c-panel`   | `#1a1a1a` | Editor sidebar      |
| `--c-bg`      | `#f5f4f0` | Page background     |
| `--c-surface` | `#ffffff` | A4 sheet            |

---

## 🔒 Adapting for Production

1. **Replace `DEMO_INVOICE`** in `src/lib/demoData.ts` with your real data source (API, DB, etc.)
2. **Add authentication** if invoices are user-specific
3. **Connect to a backend** (e.g. Supabase) to persist documents
4. **Extend `InvoiceData`** type for VAT, custom fields, etc.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

Made with ♥ using Next.js + TypeScript
