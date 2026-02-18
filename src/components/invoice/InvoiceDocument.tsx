"use client";

import { InvoiceData } from "@/types/invoice";
import { Locale } from "@/lib/i18n";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceFooter } from "./InvoiceFooter";

interface Props {
  data: InvoiceData;
  locale?: Locale;
  className?: string;
}

export function InvoiceDocument({
  data,
  locale = "de",
  className = "",
}: Props) {
  return (
    <article
      id="invoice-document"
      className={`invoice-document ${className}`}
      aria-label={`${data.docType} ${data.docNumber}`}
    >
      <InvoiceHeader data={data} locale={locale} />
      <InvoiceTable data={data} locale={locale} />
      <InvoiceFooter data={data} locale={locale} />
    </article>
  );
}
