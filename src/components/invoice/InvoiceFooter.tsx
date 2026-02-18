"use client";

// ─────────────────────────────────────────────
//  InvoiceFooter
//  Bank details, legal notice, custom notes.
// ─────────────────────────────────────────────

import { InvoiceData } from "@/types/invoice";

interface Props {
  data: InvoiceData;
}

export function InvoiceFooter({ data }: Props) {
  const { sender, notes, smallBusinessNote } = data;
  const hasBank = sender.iban || sender.bic || sender.bankOwner;

  return (
    <footer className="invoice-footer">
      {/* Notes / personal closing */}
      {notes && (
        <p className="invoice-notes whitespace-pre-line">{notes}</p>
      )}

      <div className="footer-divider" />

      {/* Bank details */}
      {hasBank && (
        <dl className="bank-details">
          {sender.bankOwner && (
            <>
              <dt>Kontoinhaber:</dt>
              <dd>{sender.bankOwner}</dd>
            </>
          )}
          {sender.iban && (
            <>
              <dt>IBAN:</dt>
              <dd>{sender.iban}</dd>
            </>
          )}
          {sender.bic && (
            <>
              <dt>BIC:</dt>
              <dd>{sender.bic}</dd>
            </>
          )}
          {sender.bankName && (
            <>
              <dt>Bank:</dt>
              <dd>{sender.bankName}</dd>
            </>
          )}
        </dl>
      )}

      {/* Legal notices */}
      <div className="legal-notes">
        {sender.taxId && (
          <p>Steuernummer / USt-IdNr.: {sender.taxId}</p>
        )}
        {smallBusinessNote && (
          <p>
            Gemäß §19 UStG (Kleinunternehmerregelung) wird keine Umsatzsteuer
            ausgewiesen.
          </p>
        )}
      </div>
    </footer>
  );
}
