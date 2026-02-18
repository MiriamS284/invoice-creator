// ─────────────────────────────────────────────
//  Demo / Dummy Data
//  Replace with your real data or API calls.
// ─────────────────────────────────────────────

import { InvoiceData } from "@/types/invoice";
import { todayISO, addDays } from "@/lib/utils";

const today = todayISO();

export const DEMO_INVOICE: InvoiceData = {
  docType: "INVOICE",
  docNumber: "INV-2025-0042",
  issueDate: today,
  paymentTerms: "14 Tage netto",
  period: "01.03.2025 – 31.03.2025",

  sender: {
    name: "Alex Studio GmbH",
    street: "Musterstraße",
    houseNumber: "12",
    postalCode: "10115",
    city: "Berlin",
    country: "Deutschland",
    phone: "+49 30 1234567",
    email: "hallo@alex-studio.de",
    website: "alex-studio.de",
    taxId: "DE123456789",
    bankOwner: "Alex Studio GmbH",
    iban: "DE89 3704 0044 0532 0130 00",
    bic: "COBADEFFXXX",
    bankName: "Commerzbank Berlin",
  },

  recipient: {
    name: "Musterfirma AG",
    street: "Beispielweg",
    houseNumber: "7",
    postalCode: "20095",
    city: "Hamburg",
    country: "Deutschland",
    email: "buchhaltung@musterfirma.de",
    customerNumber: "KD-0815",
  },

  lineItems: [
    {
      description:
        "UI/UX Design – Konzeption & Prototyping\nWireframes, Figma-Designs, Interaktionsprototyp",
      unitLabel: "",
      quantity: 5,
      unitPrice: 900,
    },
    {
      description:
        "Frontend-Entwicklung (React / Next.js)\nKomponentenbibliothek, responsive Layout, Animationen",
      unitLabel: "Menge",
      quantity: 8,
      unitPrice: 950,
    },
    {
      description: "Projektmanagement & Abstimmungsgespräche",
      unitLabel: "Std.",
      quantity: 4,
      unitPrice: 150,
    },
  ],

  notes:
    "Vielen Dank für Ihr Vertrauen. Bei Fragen stehe ich jederzeit zur Verfügung.\n\nMit freundlichen Grüßen\nAlex Studio GmbH",

  smallBusinessNote: false,
};

export const DEMO_QUOTE: InvoiceData = {
  ...DEMO_INVOICE,
  docType: "QUOTE",
  docNumber: "QUOT-2025-0011",
  paymentTerms: addDays(today, 14),
  notes:
    "Ich freue mich auf eine erfolgreiche Zusammenarbeit!\n\nMit freundlichen Grüßen\nAlex Studio GmbH",
};
