"use client";

import { InvoiceData } from "@/types/invoice";
import { formatDate } from "@/lib/utils";
import { translations, Locale } from "@/lib/i18n";

interface Props {
  data: InvoiceData;
  locale: Locale;
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="contact-row">
      <span className="contact-label">{label}</span>
      <span className="contact-value">{value}</span>
    </div>
  );
}

export function InvoiceHeader({ data, locale }: Props) {
  const t = translations[locale];
  const {
    docType,
    docNumber,
    issueDate,
    paymentTerms,
    period,
    sender,
    recipient,
  } = data;

  const docTitle = docType === "INVOICE" ? t.invoiceTitle : t.quoteTitle;
  const numberLabel = docType === "INVOICE" ? t.invoiceNr : t.quoteNr;
  const termsLabel =
    docType === "INVOICE" ? t.paymentTermsLabel : t.validUntilLabel;
  const termsValue =
    docType === "QUOTE" ? formatDate(paymentTerms ?? "") : (paymentTerms ?? "");

  return (
    <header className="invoice-header">
      <div className="accent-bar" />
      <p className="brand-line">{sender.name}</p>

      <div className="header-grid">
        <div className="col-doctype">
          <h1 className="doc-title">{docTitle}</h1>
        </div>

        <div className="col-recipient">
          <div className="address-block">
            <span className="address-name">{recipient.name}</span>
            <span>
              {recipient.street} {recipient.houseNumber}
            </span>
            <span>
              {recipient.postalCode} {recipient.city}
              {recipient.country ? `, ${recipient.country}` : ""}
            </span>
          </div>

          <div className="meta-list">
            {recipient.customerNumber && (
              <div className="meta-row">
                <span className="meta-label">{t.customerNr}</span>
                <span className="meta-value">{recipient.customerNumber}</span>
              </div>
            )}
            {period && (
              <div className="meta-row">
                <span className="meta-label">{t.periodLabel}</span>
                <span className="meta-value">{period}</span>
              </div>
            )}
            <div className="meta-row">
              <span className="meta-label">{numberLabel}</span>
              <span className="meta-value">{docNumber}</span>
            </div>
            {paymentTerms && (
              <div className="meta-row">
                <span className="meta-label">{termsLabel}</span>
                <span className="meta-value">{termsValue}</span>
              </div>
            )}
          </div>
        </div>

        <div className="col-sender">
          <div className="address-block address-block--right">
            <span className="address-name">{sender.name}</span>
            <span>
              {sender.street} {sender.houseNumber}
            </span>
            <span>
              {sender.postalCode} {sender.city}
            </span>
          </div>

          <div className="contact-list">
            {sender.phone && (
              <ContactRow label={t.telLabel} value={sender.phone} />
            )}
            {sender.email && (
              <ContactRow label={t.emailLabel} value={sender.email} />
            )}
            {sender.website && (
              <ContactRow label={t.webLabel} value={sender.website} />
            )}
            <ContactRow label={t.dateLabel} value={formatDate(issueDate)} />
          </div>
        </div>
      </div>
    </header>
  );
}
