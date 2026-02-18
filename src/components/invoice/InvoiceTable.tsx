"use client";

import { InvoiceData, LineItem } from "@/types/invoice";
import { computeLineItems, computeSubtotal, formatCurrency } from "@/lib/utils";
import { translations, Locale } from "@/lib/i18n";

interface Props {
  data: InvoiceData;
  locale: Locale;
}

export function InvoiceTable({ data, locale }: Props) {
  const t = translations[locale];
  const { lineItems, discountAmount, discountLabel, docType } = data;

  const enriched: LineItem[] = computeLineItems(lineItems);
  const subtotal = computeSubtotal(enriched);
  const discount = discountAmount ?? 0;
  const total = parseFloat((subtotal - discount).toFixed(2));
  const showSubtotalRow = discount > 0;

  // Use the first item's unitLabel as the column header (fallback to t.quantity)
  const unitColHeader = lineItems[0]?.unitLabel || t.quantity;

  return (
    <section className="invoice-table-section">
      <table className="invoice-table">
        <thead>
          <tr>
            <th className="col-desc">{t.description}</th>
            <th className="col-qty">{unitColHeader}</th>
            <th className="col-price">{t.unitPrice}</th>
            <th className="col-total">{t.total}</th>
          </tr>
        </thead>

        <tbody>
          {enriched.map((item, idx) => (
            <tr key={idx}>
              <td className="col-desc whitespace-pre-line">
                {item.description}
              </td>
              <td className="col-qty text-center">{item.quantity}</td>
              <td className="col-price text-right">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="col-total text-right">
                {formatCurrency(item.total!)}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          {showSubtotalRow && (
            <>
              <tr className="subtotal-row">
                <td colSpan={3} className="text-right font-medium">
                  {t.subtotal}
                </td>
                <td className="text-right font-medium">
                  {formatCurrency(subtotal)}
                </td>
              </tr>
              <tr className="discount-row">
                <td colSpan={3} className="text-right font-medium">
                  {discountLabel || t.discount}
                </td>
                <td className="text-right font-medium">
                  −{formatCurrency(discount)}
                </td>
              </tr>
            </>
          )}
          <tr className="total-row">
            <td colSpan={3} className="text-right font-bold">
              {docType === "QUOTE" ? t.quoteTotalLabel : t.grandTotalLabel}
            </td>
            <td className="text-right font-bold">{formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
