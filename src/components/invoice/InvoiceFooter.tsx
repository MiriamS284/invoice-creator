"use client";

import { InvoiceData } from "@/types/invoice";
import { translations, Locale } from "@/lib/i18n";

interface Props {
  data: InvoiceData;
  locale: Locale;
}

export function InvoiceFooter({ data, locale }: Props) {
  const t = translations[locale];
  const { sender, notes, smallBusinessNote } = data;
  const hasBank = sender.iban || sender.bic || sender.bankOwner;

  return (
    <footer className="invoice-footer">
      {notes && <p className="invoice-notes whitespace-pre-line">{notes}</p>}

      <div className="footer-divider" />

      {hasBank && (
        <dl className="bank-details">
          {sender.bankOwner && (
            <>
              <dt>{t.accountOwner}</dt>
              <dd>{sender.bankOwner}</dd>
            </>
          )}
          {sender.iban && (
            <>
              <dt>{t.ibanLabel}</dt>
              <dd>{sender.iban}</dd>
            </>
          )}
          {sender.bic && (
            <>
              <dt>{t.bicLabel}</dt>
              <dd>{sender.bic}</dd>
            </>
          )}
          {sender.bankName && (
            <>
              <dt>{t.bankLabel}</dt>
              <dd>{sender.bankName}</dd>
            </>
          )}
        </dl>
      )}

      <div className="legal-notes">
        {sender.taxId && (
          <p>
            {t.taxIdLabel} {sender.taxId}
          </p>
        )}
        {smallBusinessNote && <p>{t.taxNote}</p>}
      </div>
    </footer>
  );
}
