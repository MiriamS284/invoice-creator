"use client";

// ─────────────────────────────────────────────
//  InvoiceDocument
//  Composes Header + Table + Footer into a
//  print-ready A4-style document layout.
//
//  Usage:
//    import { InvoiceDocument } from "@/components/invoice";
//    <InvoiceDocument data={myInvoiceData} />
// ─────────────────────────────────────────────

import { InvoiceData } from "@/types/invoice";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceFooter } from "./InvoiceFooter";

interface Props {
  data: InvoiceData;
  /** Extra CSS class for the wrapper, e.g. for custom print tweaks */
  className?: string;
}

export function InvoiceDocument({ data, className = "" }: Props) {
  return (
    <article
      id="invoice-document"
      className={`invoice-document ${className}`}
      aria-label={`${data.docType === "INVOICE" ? "Rechnung" : "Angebot"} ${data.docNumber}`}
    >
      <InvoiceHeader data={data} />
      <InvoiceTable data={data} />
      <InvoiceFooter data={data} />
    </article>
  );
}
