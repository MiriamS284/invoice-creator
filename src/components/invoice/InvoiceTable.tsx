"use client";

// ─────────────────────────────────────────────
//  InvoiceTable
//  Renders line items, subtotal, optional discount
//  and grand total row.
// ─────────────────────────────────────────────

import { InvoiceData, LineItem } from "@/types/invoice";
import { computeLineItems, computeSubtotal, formatCurrency } from "@/lib/utils";

interface Props {
  data: InvoiceData;
}

export function InvoiceTable({ data }: Props) {
  const { lineItems, discountAmount, discountLabel, docType } = data;

  const enriched: LineItem[] = computeLineItems(lineItems);
  const subtotal = computeSubtotal(enriched);
  const discount = discountAmount ?? 0;
  const total = parseFloat((subtotal - discount).toFixed(2));

  const showSubtotalRow = discount > 0;

  return (
    <section className="invoice-table-section">
      <table className="invoice-table">
        <thead>
          <tr>
            <th className="col-desc">Beschreibung</th>
            <th className="col-qty">
              {lineItems[0]?.unitLabel ?? "Menge"}
            </th>
            <th className="col-price">Einzelpreis</th>
            <th className="col-total">Gesamt</th>
          </tr>
        </thead>

        <tbody>
          {enriched.map((item, idx) => (
            <tr key={idx}>
              <td className="col-desc whitespace-pre-line">{item.description}</td>
              <td className="col-qty text-center">{item.quantity}</td>
              <td className="col-price text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="col-total text-right">{formatCurrency(item.total!)}</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          {showSubtotalRow && (
            <>
              <tr className="subtotal-row">
                <td colSpan={3} className="text-right font-medium">Zwischensumme</td>
                <td className="text-right font-medium">{formatCurrency(subtotal)}</td>
              </tr>
              <tr className="discount-row">
                <td colSpan={3} className="text-right font-medium">
                  {discountLabel ?? "Rabatt"}
                </td>
                <td className="text-right font-medium text-emerald-700">
                  −{formatCurrency(discount)}
                </td>
              </tr>
            </>
          )}

          <tr className="total-row">
            <td colSpan={3} className="text-right font-bold">
              {docType === "QUOTE" ? "Angebotssumme" : "Gesamtbetrag"}
            </td>
            <td className="text-right font-bold">{formatCurrency(total)}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
