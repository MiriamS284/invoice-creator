"use client";

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

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="contact-row">
      <span className="contact-label">{label}</span>
      <span className="contact-value">{value}</span>
    </div>
  );
}

export function InvoiceHeader({ data }: Props) {
  const {
    docType,
    docNumber,
    issueDate,
    paymentTerms,
    period,
    sender,
    recipient,
  } = data;

  return (
    <header className="invoice-header">
      <div className="accent-bar" />
      <p className="brand-line">{sender.name}</p>

      <div className="header-grid">
        <div className="col-doctype">
          <h1 className="doc-title">{LABEL[docType]}</h1>
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
                <span className="meta-label">Kundennr.:</span>
                <span className="meta-value">{recipient.customerNumber}</span>
              </div>
            )}
            {period && (
              <div className="meta-row">
                <span className="meta-label">Zeitraum:</span>
                <span className="meta-value">{period}</span>
              </div>
            )}
            <div className="meta-row">
              <span className="meta-label">
                {docType === "INVOICE" ? "Rechnungsnr.:" : "Angebotsnr.:"}
              </span>
              <span className="meta-value">{docNumber}</span>
            </div>
            {paymentTerms && (
              <div className="meta-row">
                <span className="meta-label">{TERMS_LABEL[docType]}:</span>
                <span className="meta-value">
                  {docType === "QUOTE"
                    ? formatDate(paymentTerms)
                    : paymentTerms}
                </span>
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
            {sender.phone && <ContactRow label="Tel.:" value={sender.phone} />}
            {sender.email && (
              <ContactRow label="E-Mail:" value={sender.email} />
            )}
            {sender.website && (
              <ContactRow label="Web:" value={sender.website} />
            )}
            <ContactRow label="Datum:" value={formatDate(issueDate)} />
          </div>
        </div>
      </div>
    </header>
  );
}
