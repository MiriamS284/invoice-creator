"use client";

// ─────────────────────────────────────────────
//  Invoice Generator Page
//  Left: interactive editor form
//  Right: live A4 preview
//  Bottom: Print / PDF action button
// ─────────────────────────────────────────────

import { useState, useCallback } from "react";
import { InvoiceDocument } from "@/components/invoice";
import { InvoiceData, LineItem, DocumentType } from "@/types/invoice";
import { DEMO_INVOICE, DEMO_QUOTE } from "@/lib/demoData";
import {
  computeLineItems,
  computeSubtotal,
  formatCurrency,
  todayISO,
} from "@/lib/utils";

// ── Tiny helpers ──────────────────────────────

function Field({
  label,
  children,
  span2 = false,
}: {
  label: string;
  children: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <label className={`field${span2 ? " field--span2" : ""}`}>
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

function SectionHeading({ title }: { title: string }) {
  return <h3 className="section-heading">{title}</h3>;
}

// ── Line Item Row ────────────────────────────

function LineItemRow({
  item,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  item: LineItem;
  index: number;
  onChange: (
    index: number,
    field: keyof LineItem,
    value: string | number,
  ) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}) {
  const total = item.quantity * item.unitPrice;

  return (
    <div className="line-item-row">
      <textarea
        className="input line-desc"
        rows={3}
        placeholder="Leistungsbeschreibung…"
        value={item.description}
        onChange={(e) => onChange(index, "description", e.target.value)}
      />
      <input
        className="input line-qty"
        type="number"
        min={0}
        placeholder="Menge"
        value={item.quantity}
        onChange={(e) =>
          onChange(index, "quantity", parseFloat(e.target.value) || 0)
        }
      />
      <input
        className="input line-price"
        type="number"
        min={0}
        step="0.01"
        placeholder="Preis"
        value={item.unitPrice}
        onChange={(e) =>
          onChange(index, "unitPrice", parseFloat(e.target.value) || 0)
        }
      />
      <span className="line-total">{formatCurrency(total)}</span>
      <button
        type="button"
        className="btn-icon btn-remove"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        title="Position entfernen"
        aria-label="Position entfernen"
      >
        ×
      </button>
    </div>
  );
}

// ── Page Component ────────────────────────────

export default function InvoiceGeneratorPage() {
  const [data, setData] = useState<InvoiceData>(DEMO_INVOICE);

  // ── Generic updaters ──────────────────────

  const set = useCallback(
    <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setSender = useCallback(
    <K extends keyof InvoiceData["sender"]>(
      key: K,
      value: InvoiceData["sender"][K],
    ) => {
      setData((prev) => ({
        ...prev,
        sender: { ...prev.sender, [key]: value },
      }));
    },
    [],
  );

  const setRecipient = useCallback(
    <K extends keyof InvoiceData["recipient"]>(
      key: K,
      value: InvoiceData["recipient"][K],
    ) => {
      setData((prev) => ({
        ...prev,
        recipient: { ...prev.recipient, [key]: value },
      }));
    },
    [],
  );

  const updateLineItem = useCallback(
    (index: number, field: keyof LineItem, value: string | number) => {
      setData((prev) => {
        const updated = prev.lineItems.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        );
        return { ...prev, lineItems: updated };
      });
    },
    [],
  );

  const addLineItem = useCallback(() => {
    setData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { description: "", unitLabel: "Std.", quantity: 1, unitPrice: 0 },
      ],
    }));
  }, []);

  const removeLineItem = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
  }, []);

  // ── Doc type toggle ───────────────────────

  const switchDocType = (type: DocumentType) => {
    if (type === "QUOTE") {
      setData({ ...DEMO_QUOTE });
    } else {
      setData({ ...DEMO_INVOICE });
    }
  };

  // ── Print / PDF ───────────────────────────

  const handlePrint = () => window.print();

  // ── Derived totals for editor summary ────

  const enriched = computeLineItems(data.lineItems);
  const subtotal = computeSubtotal(enriched);
  const discount = data.discountAmount ?? 0;
  const total = subtotal - discount;

  return (
    <div className="page-root">
      {/* ── Top Bar ── */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-brand">
            <span className="topbar-logo">⬛</span>
            <span className="topbar-title">Invoice Generator</span>
          </div>

          <div className="doctype-tabs">
            {(["INVOICE", "QUOTE"] as DocumentType[]).map((type) => (
              <button
                key={type}
                type="button"
                className={`tab-btn${data.docType === type ? " tab-btn--active" : ""}`}
                onClick={() => switchDocType(type)}
              >
                {type === "INVOICE" ? "Rechnung" : "Angebot"}
              </button>
            ))}
          </div>

          <button type="button" className="btn-print" onClick={handlePrint}>
            <span className="btn-print-icon">⬡</span> PDF / Drucken
          </button>
        </div>
      </header>

      <div className="main-layout">
        {/* ═══════════════════════════════════
            LEFT – Editor
        ═══════════════════════════════════ */}
        <aside className="editor-panel no-print">
          <div className="editor-scroll">
            {/* Document Meta */}
            <SectionHeading title="Dokument" />
            <div className="field-grid">
              <Field
                label={
                  data.docType === "INVOICE"
                    ? "Rechnungsnummer"
                    : "Angebotsnummer"
                }
              >
                <input
                  className="input"
                  value={data.docNumber}
                  onChange={(e) => set("docNumber", e.target.value)}
                />
              </Field>
              <Field label="Datum">
                <input
                  className="input"
                  type="date"
                  value={data.issueDate}
                  onChange={(e) => set("issueDate", e.target.value)}
                />
              </Field>
              <Field
                label={
                  data.docType === "INVOICE" ? "Zahlungsziel" : "Gültig bis"
                }
                span2
              >
                <input
                  className="input"
                  value={data.paymentTerms ?? ""}
                  placeholder={
                    data.docType === "INVOICE"
                      ? "z.B. 14 Tage netto"
                      : "YYYY-MM-DD"
                  }
                  onChange={(e) => set("paymentTerms", e.target.value)}
                />
              </Field>
              <Field label="Leistungszeitraum" span2>
                <input
                  className="input"
                  value={data.period ?? ""}
                  placeholder="01.01.2025 – 31.01.2025"
                  onChange={(e) => set("period", e.target.value)}
                />
              </Field>
            </div>

            {/* Sender */}
            <SectionHeading title="Absender (Du)" />
            <div className="field-grid">
              <Field label="Name / Firma" span2>
                <input
                  className="input"
                  value={data.sender.name}
                  onChange={(e) => setSender("name", e.target.value)}
                />
              </Field>
              <Field label="Straße">
                <input
                  className="input"
                  value={data.sender.street}
                  onChange={(e) => setSender("street", e.target.value)}
                />
              </Field>
              <Field label="Hausnr.">
                <input
                  className="input"
                  value={data.sender.houseNumber}
                  onChange={(e) => setSender("houseNumber", e.target.value)}
                />
              </Field>
              <Field label="PLZ">
                <input
                  className="input"
                  value={data.sender.postalCode}
                  onChange={(e) => setSender("postalCode", e.target.value)}
                />
              </Field>
              <Field label="Ort">
                <input
                  className="input"
                  value={data.sender.city}
                  onChange={(e) => setSender("city", e.target.value)}
                />
              </Field>
              <Field label="Telefon">
                <input
                  className="input"
                  value={data.sender.phone ?? ""}
                  onChange={(e) => setSender("phone", e.target.value)}
                />
              </Field>
              <Field label="E-Mail">
                <input
                  className="input"
                  type="email"
                  value={data.sender.email ?? ""}
                  onChange={(e) => setSender("email", e.target.value)}
                />
              </Field>
              <Field label="Website">
                <input
                  className="input"
                  value={data.sender.website ?? ""}
                  onChange={(e) => setSender("website", e.target.value)}
                />
              </Field>
              <Field label="Steuer-Nr. / USt-Id">
                <input
                  className="input"
                  value={data.sender.taxId ?? ""}
                  onChange={(e) => setSender("taxId", e.target.value)}
                />
              </Field>
            </div>

            {/* Bank */}
            <SectionHeading title="Bankverbindung" />
            <div className="field-grid">
              <Field label="Kontoinhaber" span2>
                <input
                  className="input"
                  value={data.sender.bankOwner ?? ""}
                  onChange={(e) => setSender("bankOwner", e.target.value)}
                />
              </Field>
              <Field label="IBAN" span2>
                <input
                  className="input"
                  value={data.sender.iban ?? ""}
                  onChange={(e) => setSender("iban", e.target.value)}
                />
              </Field>
              <Field label="BIC">
                <input
                  className="input"
                  value={data.sender.bic ?? ""}
                  onChange={(e) => setSender("bic", e.target.value)}
                />
              </Field>
              <Field label="Bank">
                <input
                  className="input"
                  value={data.sender.bankName ?? ""}
                  onChange={(e) => setSender("bankName", e.target.value)}
                />
              </Field>
            </div>

            {/* Recipient */}
            <SectionHeading title="Empfänger (Kunde)" />
            <div className="field-grid">
              <Field label="Name / Firma" span2>
                <input
                  className="input"
                  value={data.recipient.name}
                  onChange={(e) => setRecipient("name", e.target.value)}
                />
              </Field>
              <Field label="Straße">
                <input
                  className="input"
                  value={data.recipient.street}
                  onChange={(e) => setRecipient("street", e.target.value)}
                />
              </Field>
              <Field label="Hausnr.">
                <input
                  className="input"
                  value={data.recipient.houseNumber}
                  onChange={(e) => setRecipient("houseNumber", e.target.value)}
                />
              </Field>
              <Field label="PLZ">
                <input
                  className="input"
                  value={data.recipient.postalCode}
                  onChange={(e) => setRecipient("postalCode", e.target.value)}
                />
              </Field>
              <Field label="Ort">
                <input
                  className="input"
                  value={data.recipient.city}
                  onChange={(e) => setRecipient("city", e.target.value)}
                />
              </Field>
              <Field label="E-Mail">
                <input
                  className="input"
                  type="email"
                  value={data.recipient.email ?? ""}
                  onChange={(e) => setRecipient("email", e.target.value)}
                />
              </Field>
              <Field label="Kundennummer">
                <input
                  className="input"
                  value={data.recipient.customerNumber ?? ""}
                  onChange={(e) =>
                    setRecipient("customerNumber", e.target.value)
                  }
                />
              </Field>
            </div>

            {/* Line Items */}
            <SectionHeading title="Positionen" />
            <div className="line-items-header">
              <span className="li-col-desc">Beschreibung</span>
              <span className="li-col-qty">Menge</span>
              <span className="li-col-price">Preis</span>
              <span className="li-col-total">Gesamt</span>
              <span className="li-col-action" />
            </div>

            {data.lineItems.map((item, idx) => (
              <LineItemRow
                key={idx}
                item={item}
                index={idx}
                onChange={updateLineItem}
                onRemove={removeLineItem}
                canRemove={data.lineItems.length > 1}
              />
            ))}

            <button
              type="button"
              className="btn-add-line"
              onClick={addLineItem}
            >
              + Position hinzufügen
            </button>

            {/* Optional discount */}
            <div className="field-grid" style={{ marginTop: "12px" }}>
              <Field label="Rabattbetrag (€)">
                <input
                  className="input"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  value={data.discountAmount ?? ""}
                  onChange={(e) =>
                    set("discountAmount", parseFloat(e.target.value) || 0)
                  }
                />
              </Field>
              <Field label="Rabattbezeichnung">
                <input
                  className="input"
                  value={data.discountLabel ?? ""}
                  placeholder="z.B. Treuerabatt"
                  onChange={(e) => set("discountLabel", e.target.value)}
                />
              </Field>
            </div>

            {/* Totals summary */}
            <div className="totals-summary">
              <div className="totals-row">
                <span>Zwischensumme</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="totals-row totals-discount">
                  <span>Rabatt</span>
                  <span>−{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="totals-row totals-total">
                <span>Gesamtbetrag</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Notes */}
            <SectionHeading title="Notizen / Abschluss" />
            <Field label="" span2>
              <textarea
                className="input"
                rows={4}
                value={data.notes ?? ""}
                placeholder="Abschlusstext, persönliche Nachricht…"
                onChange={(e) => set("notes", e.target.value)}
              />
            </Field>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.smallBusinessNote ?? false}
                onChange={(e) => set("smallBusinessNote", e.target.checked)}
              />
              §19 UStG Kleinunternehmer-Hinweis anzeigen
            </label>
          </div>
        </aside>

        {/* ═══════════════════════════════════
            RIGHT – A4 Live Preview
        ═══════════════════════════════════ */}
        <main className="preview-panel">
          <div className="preview-scroll">
            <div className="a4-sheet">
              <InvoiceDocument data={data} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
