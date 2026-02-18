"use client";

import { useState, useCallback } from "react";

import html2canvas from "html2canvas";
import { InvoiceDocument } from "@/components/invoice";
import { InvoiceData, LineItem, DocumentType } from "@/types/invoice";
import { DEMO_INVOICE, DEMO_QUOTE } from "@/lib/demoData";
import { computeLineItems, computeSubtotal, formatCurrency } from "@/lib/utils";
import { Locale, translations } from "@/lib/i18n";

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

// ── Line Item Row ─────────────────────────────

function LineItemRow({
  item,
  index,
  onChange,
  onRemove,
  canRemove,
  unitLabelPlaceholder,
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
  unitLabelPlaceholder: string;
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
        className="input line-unit"
        type="text"
        placeholder={unitLabelPlaceholder}
        value={item.unitLabel ?? ""}
        onChange={(e) => onChange(index, "unitLabel", e.target.value)}
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
  const [locale, setLocale] = useState<Locale>("de");
  const [pngLoading, setPngLoading] = useState(false);

  const t = translations[locale];

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
      setData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      }));
    },
    [],
  );

  const addLineItem = useCallback(() => {
    setData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        {
          description: "",
          unitLabel: prev.lineItems[0]?.unitLabel ?? "Std.",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    }));
  }, []);

  const removeLineItem = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
  }, []);

  const switchDocType = (type: DocumentType) => {
    setData(type === "QUOTE" ? { ...DEMO_QUOTE } : { ...DEMO_INVOICE });
  };

  const handlePrint = () => window.print();

  const handleDownloadPng = async () => {
    const element = document.getElementById("invoice-document");
    if (!element) return;
    setPngLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const canvas = await (html2canvas as any)(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${data.docNumber || "rechnung"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setPngLoading(false);
    }
  };

  const enriched = computeLineItems(data.lineItems);
  const subtotal = computeSubtotal(enriched);
  const discount = data.discountAmount ?? 0;
  const total = subtotal - discount;

  return (
    <div className="page-root">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-brand">
            <span className="topbar-logo">⬛</span>
            <span className="topbar-title">Invoice Generator</span>
          </div>

          {/* Doc type tabs */}
          <div className="doctype-tabs">
            {(["INVOICE", "QUOTE"] as DocumentType[]).map((type) => (
              <button
                key={type}
                type="button"
                className={`tab-btn${data.docType === type ? " tab-btn--active" : ""}`}
                onClick={() => switchDocType(type)}
              >
                {type === "INVOICE" ? t.invoice : t.quote}
              </button>
            ))}
          </div>

          {/* Language switcher */}
          <div className="lang-tabs">
            {(["de", "en"] as Locale[]).map((l) => (
              <button
                key={l}
                type="button"
                className={`lang-btn${locale === l ? " lang-btn--active" : ""}`}
                onClick={() => setLocale(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-png"
            onClick={handleDownloadPng}
            disabled={pngLoading}
          >
            <span>⬇</span> {pngLoading ? t.loading : t.downloadPng}
          </button>

          <button type="button" className="btn-print" onClick={handlePrint}>
            <span className="btn-print-icon">⬡</span> {t.printPdf}
          </button>
        </div>
      </header>

      <div className="main-layout">
        {/* ── LEFT – Editor ── */}
        <aside className="editor-panel no-print">
          <div className="editor-scroll">
            <SectionHeading title={t.sectionDocument} />
            <div className="field-grid">
              <Field
                label={
                  data.docType === "INVOICE" ? t.invoiceNumber : t.quoteNumber
                }
              >
                <input
                  className="input"
                  value={data.docNumber}
                  onChange={(e) => set("docNumber", e.target.value)}
                />
              </Field>
              <Field label={t.date}>
                <input
                  className="input"
                  type="date"
                  value={data.issueDate}
                  onChange={(e) => set("issueDate", e.target.value)}
                />
              </Field>
              <Field
                label={
                  data.docType === "INVOICE" ? t.paymentTerms : t.validUntil
                }
                span2
              >
                <input
                  className="input"
                  value={data.paymentTerms ?? ""}
                  placeholder={
                    data.docType === "INVOICE"
                      ? t.paymentPlaceholder
                      : "YYYY-MM-DD"
                  }
                  onChange={(e) => set("paymentTerms", e.target.value)}
                />
              </Field>
              <Field label={t.period} span2>
                <input
                  className="input"
                  value={data.period ?? ""}
                  placeholder={t.periodPlaceholder}
                  onChange={(e) => set("period", e.target.value)}
                />
              </Field>
            </div>

            <SectionHeading title={t.sectionSender} />
            <div className="field-grid">
              <Field label={t.nameCompany} span2>
                <input
                  className="input"
                  value={data.sender.name}
                  onChange={(e) => setSender("name", e.target.value)}
                />
              </Field>
              <Field label={t.street}>
                <input
                  className="input"
                  value={data.sender.street}
                  onChange={(e) => setSender("street", e.target.value)}
                />
              </Field>
              <Field label={t.houseNumber}>
                <input
                  className="input"
                  value={data.sender.houseNumber}
                  onChange={(e) => setSender("houseNumber", e.target.value)}
                />
              </Field>
              <Field label={t.postalCode}>
                <input
                  className="input"
                  value={data.sender.postalCode}
                  onChange={(e) => setSender("postalCode", e.target.value)}
                />
              </Field>
              <Field label={t.city}>
                <input
                  className="input"
                  value={data.sender.city}
                  onChange={(e) => setSender("city", e.target.value)}
                />
              </Field>
              <Field label={t.phone}>
                <input
                  className="input"
                  value={data.sender.phone ?? ""}
                  onChange={(e) => setSender("phone", e.target.value)}
                />
              </Field>
              <Field label={t.email}>
                <input
                  className="input"
                  type="email"
                  value={data.sender.email ?? ""}
                  onChange={(e) => setSender("email", e.target.value)}
                />
              </Field>
              <Field label={t.website}>
                <input
                  className="input"
                  value={data.sender.website ?? ""}
                  onChange={(e) => setSender("website", e.target.value)}
                />
              </Field>
              <Field label={t.taxId}>
                <input
                  className="input"
                  value={data.sender.taxId ?? ""}
                  onChange={(e) => setSender("taxId", e.target.value)}
                />
              </Field>
            </div>

            <SectionHeading title={t.sectionBank} />
            <div className="field-grid">
              <Field label={t.bankOwner} span2>
                <input
                  className="input"
                  value={data.sender.bankOwner ?? ""}
                  onChange={(e) => setSender("bankOwner", e.target.value)}
                />
              </Field>
              <Field label={t.iban} span2>
                <input
                  className="input"
                  value={data.sender.iban ?? ""}
                  onChange={(e) => setSender("iban", e.target.value)}
                />
              </Field>
              <Field label={t.bic}>
                <input
                  className="input"
                  value={data.sender.bic ?? ""}
                  onChange={(e) => setSender("bic", e.target.value)}
                />
              </Field>
              <Field label={t.bank}>
                <input
                  className="input"
                  value={data.sender.bankName ?? ""}
                  onChange={(e) => setSender("bankName", e.target.value)}
                />
              </Field>
            </div>

            <SectionHeading title={t.sectionRecipient} />
            <div className="field-grid">
              <Field label={t.nameCompany} span2>
                <input
                  className="input"
                  value={data.recipient.name}
                  onChange={(e) => setRecipient("name", e.target.value)}
                />
              </Field>
              <Field label={t.street}>
                <input
                  className="input"
                  value={data.recipient.street}
                  onChange={(e) => setRecipient("street", e.target.value)}
                />
              </Field>
              <Field label={t.houseNumber}>
                <input
                  className="input"
                  value={data.recipient.houseNumber}
                  onChange={(e) => setRecipient("houseNumber", e.target.value)}
                />
              </Field>
              <Field label={t.postalCode}>
                <input
                  className="input"
                  value={data.recipient.postalCode}
                  onChange={(e) => setRecipient("postalCode", e.target.value)}
                />
              </Field>
              <Field label={t.city}>
                <input
                  className="input"
                  value={data.recipient.city}
                  onChange={(e) => setRecipient("city", e.target.value)}
                />
              </Field>
              <Field label={t.email}>
                <input
                  className="input"
                  type="email"
                  value={data.recipient.email ?? ""}
                  onChange={(e) => setRecipient("email", e.target.value)}
                />
              </Field>
              <Field label={t.customerNumber}>
                <input
                  className="input"
                  value={data.recipient.customerNumber ?? ""}
                  onChange={(e) =>
                    setRecipient("customerNumber", e.target.value)
                  }
                />
              </Field>
            </div>

            <SectionHeading title={t.sectionItems} />
            <div className="line-items-header">
              <span className="li-col-desc">{t.description}</span>
              <span className="li-col-unit">{t.unitLabel}</span>
              <span className="li-col-qty">{t.quantity}</span>
              <span className="li-col-price">{t.unitPrice}</span>
              <span className="li-col-total">{t.total}</span>
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
                unitLabelPlaceholder={t.unitLabelPlaceholder}
              />
            ))}

            <button
              type="button"
              className="btn-add-line"
              onClick={addLineItem}
            >
              {t.addItem}
            </button>

            <div className="field-grid" style={{ marginTop: "12px" }}>
              <Field label={t.discountAmount}>
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
              <Field label={t.discountLabel}>
                <input
                  className="input"
                  value={data.discountLabel ?? ""}
                  placeholder={t.discountPlaceholder}
                  onChange={(e) => set("discountLabel", e.target.value)}
                />
              </Field>
            </div>

            <div className="totals-summary">
              <div className="totals-row">
                <span>{t.subtotal}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="totals-row totals-discount">
                  <span>{t.discount}</span>
                  <span>−{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="totals-row totals-total">
                <span>{t.grandTotal}</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <SectionHeading title={t.sectionNotes} />
            <Field label="" span2>
              <textarea
                className="input"
                rows={4}
                value={data.notes ?? ""}
                placeholder={t.notesPlaceholder}
                onChange={(e) => set("notes", e.target.value)}
              />
            </Field>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.smallBusinessNote ?? false}
                onChange={(e) => set("smallBusinessNote", e.target.checked)}
              />
              {t.smallBusinessNote}
            </label>
          </div>
        </aside>

        {/* ── RIGHT – A4 Live Preview ── */}
        <main className="preview-panel">
          <div className="preview-scroll">
            <div className="a4-sheet">
              <InvoiceDocument data={data} locale={locale} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
