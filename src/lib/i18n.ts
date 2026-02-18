// ─────────────────────────────────────────────
//  i18n – Translations (DE / EN)
//  Add more languages by extending this object.
// ─────────────────────────────────────────────

export type Locale = "de" | "en";

export const translations = {
  de: {
    // Topbar
    invoice: "Rechnung",
    quote: "Angebot",
    downloadPng: "PNG",
    printPdf: "PDF / Drucken",
    loading: "Lädt…",

    // Doc types
    invoiceTitle: "RECHNUNG",
    quoteTitle: "ANGEBOT",

    // Editor sections
    sectionDocument: "Dokument",
    sectionSender: "Absender (Du)",
    sectionBank: "Bankverbindung",
    sectionRecipient: "Empfänger (Kunde)",
    sectionItems: "Positionen",
    sectionNotes: "Notizen / Abschluss",

    // Document fields
    invoiceNumber: "Rechnungsnummer",
    quoteNumber: "Angebotsnummer",
    date: "Datum",
    paymentTerms: "Zahlungsziel",
    validUntil: "Gültig bis",
    period: "Leistungszeitraum",
    periodPlaceholder: "01.01.2025 – 31.01.2025",
    paymentPlaceholder: "z.B. 14 Tage netto",

    // Sender fields
    nameCompany: "Name / Firma",
    street: "Straße",
    houseNumber: "Hausnr.",
    postalCode: "PLZ",
    city: "Ort",
    phone: "Telefon",
    email: "E-Mail",
    website: "Website",
    taxId: "Steuer-Nr. / USt-Id",
    bankOwner: "Kontoinhaber",
    iban: "IBAN",
    bic: "BIC",
    bank: "Bank",
    customerNumber: "Kundennummer",

    // Table
    description: "Beschreibung",
    unitLabel: "Einheit",
    unitLabelPlaceholder: "z.B. Tage, Std., Stück",
    quantity: "Menge",
    unitPrice: "Einzelpreis",
    total: "Gesamt",
    addItem: "+ Position hinzufügen",
    removeItem: "Position entfernen",

    // Totals
    subtotal: "Zwischensumme",
    discount: "Rabatt",
    grandTotal: "Gesamtbetrag",
    discountAmount: "Rabattbetrag (€)",
    discountLabel: "Rabattbezeichnung",
    discountPlaceholder: "z.B. Treuerabatt",

    // Footer
    notes: "Notizen / Abschluss",
    notesPlaceholder: "Abschlusstext, persönliche Nachricht…",
    smallBusinessNote: "§19 UStG Kleinunternehmer-Hinweis anzeigen",

    // Invoice labels
    customerNr: "Kundennr.:",
    periodLabel: "Zeitraum:",
    invoiceNr: "Rechnungsnr.:",
    quoteNr: "Angebotsnr.:",
    paymentTermsLabel: "Zahlungsziel:",
    validUntilLabel: "Gültig bis:",
    telLabel: "Tel.:",
    emailLabel: "E-Mail:",
    webLabel: "Web:",
    dateLabel: "Datum:",
    grandTotalLabel: "Gesamtbetrag",
    quoteTotalLabel: "Angebotssumme",
    taxNote:
      "Gemäß §19 UStG wird keine Umsatzsteuer ausgewiesen (Kleinunternehmerregelung).",
    taxIdLabel: "Steuernummer / USt-IdNr.:",
    accountOwner: "Kontoinhaber:",
    ibanLabel: "IBAN:",
    bicLabel: "BIC:",
    bankLabel: "Bank:",
  },

  en: {
    // Topbar
    invoice: "Invoice",
    quote: "Quote",
    downloadPng: "PNG",
    printPdf: "PDF / Print",
    loading: "Loading…",

    // Doc types
    invoiceTitle: "INVOICE",
    quoteTitle: "QUOTE",

    // Editor sections
    sectionDocument: "Document",
    sectionSender: "Sender (You)",
    sectionBank: "Bank Details",
    sectionRecipient: "Recipient (Client)",
    sectionItems: "Line Items",
    sectionNotes: "Notes / Closing",

    // Document fields
    invoiceNumber: "Invoice Number",
    quoteNumber: "Quote Number",
    date: "Date",
    paymentTerms: "Payment Terms",
    validUntil: "Valid Until",
    period: "Service Period",
    periodPlaceholder: "01.01.2025 – 31.01.2025",
    paymentPlaceholder: "e.g. Net 14 days",

    // Sender fields
    nameCompany: "Name / Company",
    street: "Street",
    houseNumber: "No.",
    postalCode: "ZIP",
    city: "City",
    phone: "Phone",
    email: "E-Mail",
    website: "Website",
    taxId: "Tax ID / VAT No.",
    bankOwner: "Account Owner",
    iban: "IBAN",
    bic: "BIC / SWIFT",
    bank: "Bank",
    customerNumber: "Customer Number",

    // Table
    description: "Description",
    unitLabel: "Unit",
    unitLabelPlaceholder: "e.g. Days, Hrs, Units",
    quantity: "Qty",
    unitPrice: "Unit Price",
    total: "Total",
    addItem: "+ Add Line Item",
    removeItem: "Remove item",

    // Totals
    subtotal: "Subtotal",
    discount: "Discount",
    grandTotal: "Total Amount",
    discountAmount: "Discount (€)",
    discountLabel: "Discount Label",
    discountPlaceholder: "e.g. Loyalty discount",

    // Footer
    notes: "Notes / Closing",
    notesPlaceholder: "Closing text, personal message…",
    smallBusinessNote: "Show small business VAT exemption notice",

    // Invoice labels
    customerNr: "Customer No.:",
    periodLabel: "Period:",
    invoiceNr: "Invoice No.:",
    quoteNr: "Quote No.:",
    paymentTermsLabel: "Payment Terms:",
    validUntilLabel: "Valid Until:",
    telLabel: "Tel.:",
    emailLabel: "Email:",
    webLabel: "Web:",
    dateLabel: "Date:",
    grandTotalLabel: "Total Amount",
    quoteTotalLabel: "Quote Total",
    taxNote: "VAT not applicable under small business regulation.",
    taxIdLabel: "Tax ID / VAT No.:",
    accountOwner: "Account Owner:",
    ibanLabel: "IBAN:",
    bicLabel: "BIC:",
    bankLabel: "Bank:",
  },
} satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof typeof translations.de;
