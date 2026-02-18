// ─────────────────────────────────────────────
//  Invoice Types
//  Copy-paste friendly, extend as needed.
// ─────────────────────────────────────────────

export type DocumentType = "INVOICE" | "QUOTE";

export interface Address {
  name: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country?: string;
}

export interface Sender extends Address {
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  bankOwner?: string;
  iban?: string;
  bic?: string;
  bankName?: string;
}

export interface Recipient extends Address {
  email?: string;
  customerNumber?: string;
}

export interface LineItem {
  description: string;
  /** unit label shown in the column header, default "Qty" */
  unitLabel?: string;
  quantity: number;
  unitPrice: number;
  /** computed automatically: quantity × unitPrice */
  total?: number;
}

export interface InvoiceData {
  docType: DocumentType;
  docNumber: string;
  issueDate: string;          // ISO date string, e.g. "2025-03-15"
  /** For invoices: payment terms text; for quotes: valid-until ISO date */
  paymentTerms?: string;
  period?: string;            // e.g. "01.01.2025 – 28.02.2025"
  sender: Sender;
  recipient: Recipient;
  lineItems: LineItem[];
  /** Optional flat discount amount (not %) */
  discountAmount?: number;
  discountLabel?: string;
  /** Footer / notes */
  notes?: string;
  smallBusinessNote?: boolean; // show §19 UStG notice
}
