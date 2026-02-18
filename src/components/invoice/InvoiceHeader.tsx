"use client";

// ─────────────────────────────────────────────
//  InvoiceHeader
//  Renders the top section: branding bar, sender,
//  recipient address block and document meta.
// ─────────────────────────────────────────────

import { InvoiceData } from "@/types/invoice";
import { formatDate } from "@/lib/utils";

interface Props {
  data: InvoiceData;
}

const LABEL: Record<InvoiceData["docType"], string> = {
  INVOICE: "RECHNUNG",
  QUOTE: "ANGEBOT",
};

const TERMS_LABEL: Record<InvoiceData["docType"], string> = {
  INVOICE: "Zahlungsziel",
  QUOTE: "Gültig bis",
};

export function InvoiceHeader({ data }: Props) {
  const { docType, docNumber, issueDate, paymentTerms, period, sender, recipient } = data;

  return (
    <header className="invoice-header">
      {/* Top accent bar */}
      <div className="accent-bar" />
      <p className="brand-line">{sender.name}</p>

      {/* Three-column meta block */}
      <div className="header-grid">
        {/* Col 1 – Document type */}
        <div className="col-doctype">
          <h1 className="doc-title">{LABEL[docType]}</h1>
        </div>

        {/* Col 2 – Recipient + document numbers */}
        <div className="col-recipient">
          <address>
            <strong>{recipient.name}</strong>
            <br />
            {recipient.street} {recipient.houseNumber}
            <br />
            {recipient.postalCode} {recipient.city}
            {recipient.country ? <>, {recipient.country}</> : null}
          </address>

          <dl className="meta-list">
            {recipient.customerNumber && (
              <>
                <dt>Kundennr.:</dt>
                <dd>{recipient.customerNumber}</dd>
              </>
            )}
            {period && (
              <>
                <dt>Zeitraum:</dt>
                <dd>{period}</dd>
              </>
            )}
            <dt>{docType === "INVOICE" ? "Rechnungsnr.:" : "Angebotsnr.:"}</dt>
            <dd>{docNumber}</dd>
            {paymentTerms && (
              <>
                <dt>{TERMS_LABEL[docType]}:</dt>
                <dd>
                  {docType === "QUOTE" ? formatDate(paymentTerms) : paymentTerms}
                </dd>
              </>
            )}
          </dl>
        </div>

        {/* Col 3 – Sender contact */}
        <div className="col-sender">
          <strong>{sender.name}</strong>
          <br />
          {sender.street} {sender.houseNumber}
          <br />
          {sender.postalCode} {sender.city}

          <dl className="meta-list sender-meta">
            {sender.phone && (
              <>
                <dt>Tel.:</dt>
                <dd>{sender.phone}</dd>
              </>
            )}
            {sender.email && (
              <>
                <dt>E-Mail:</dt>
                <dd>{sender.email}</dd>
              </>
            )}
            {sender.website && (
              <>
                <dt>Web:</dt>
                <dd>{sender.website}</dd>
              </>
            )}
            <dt>Datum:</dt>
            <dd>{formatDate(issueDate)}</dd>
          </dl>
        </div>
      </div>
    </header>
  );
}
