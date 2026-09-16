import { createContext, useContext, useState, type ReactNode } from "react";

export type InvoiceStatus = "draft" | "submitted" | "under-review" | "paid";

export interface InvoiceLineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface AppInvoice {
  id: string;
  company: "USV" | "CANONIC";
  project: string;
  vendorName: string;
  vendorAddress: string;
  billTo: string;
  lineItems: InvoiceLineItem[];
  createdBy: string;
  createdAt: string;
  status: InvoiceStatus;
  total: number;
  paymentReceipt?: string;
  paymentNote?: string;
  paidAt?: string;
  paidBy?: string;
}

interface InvoiceStore {
  invoices: AppInvoice[];
  addInvoice: (inv: AppInvoice) => void;
  markPaid: (id: string, receipt: string, note: string, paidBy: string) => void;
}

const InvoiceCtx = createContext<InvoiceStore>({
  invoices: [],
  addInvoice: () => {},
  markPaid: () => {},
});

const seed: AppInvoice[] = [
  {
    id: "INV-USV-2026-0041",
    company: "USV",
    project: "Abuja Housing Development — Phase II",
    vendorName: "Julius Steel Ltd",
    vendorAddress: "14 Industrial Avenue, Abuja",
    billTo: "USV Development Services Ltd",
    lineItems: [
      { id: "s1", description: "Reinforcement Steel Y16 — 28 metric tonnes", qty: 28, unitPrice: 1_100_000 },
      { id: "s2", description: "Reinforcement Steel Y12 — 14 metric tonnes", qty: 14, unitPrice: 1_050_000 },
    ],
    createdBy: "Mr. Peter Nzeka",
    createdAt: "04 Sep 2026, 09:30",
    status: "submitted",
    total: 28 * 1_100_000 + 14 * 1_050_000,
  },
  {
    id: "INV-CAN-2026-0019",
    company: "CANONIC",
    project: "Enugu Medical Centre",
    vendorName: "Geo-Survey Nigeria Ltd",
    vendorAddress: "Plot 8, Trans-Ekulu, Enugu",
    billTo: "Canonic Associates Ltd",
    lineItems: [
      { id: "s3", description: "Specialist site survey — 2nd geotechnical visit", qty: 1, unitPrice: 2_350_000 },
    ],
    createdBy: "Arc. Ngozi Okoro",
    createdAt: "06 Sep 2026, 11:00",
    status: "submitted",
    total: 2_350_000,
  },
  {
    id: "INV-USV-2026-0038",
    company: "USV",
    project: "Government Office Complex",
    vendorName: "Cladtech Nigeria Ltd",
    vendorAddress: "22 Adeola Odeku Street, V/I, Lagos",
    billTo: "USV Development Services Ltd",
    lineItems: [
      { id: "s4", description: "Curtain wall system — supply and install (Phase 1)", qty: 1, unitPrice: 42_000_000 },
    ],
    createdBy: "Mr. Peter Nzeka",
    createdAt: "05 Sep 2026, 14:30",
    status: "paid",
    total: 42_000_000,
    paymentReceipt: "Receipt_INV-USV-2026-0038_Cladtech.pdf",
    paymentNote: "Bank transfer confirmed. NIBSS reference: NBS20260905141200.",
    paidAt: "05 Sep 2026, 16:00",
    paidBy: "Mrs. Chioma Nwosu",
  },
];

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<AppInvoice[]>(seed);

  const addInvoice = (inv: AppInvoice) =>
    setInvoices((p) => [inv, ...p]);

  const markPaid = (id: string, receipt: string, note: string, paidBy: string) =>
    setInvoices((p) =>
      p.map((inv) =>
        inv.id === id
          ? { ...inv, status: "paid", paymentReceipt: receipt, paymentNote: note, paidAt: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }), paidBy }
          : inv
      )
    );

  return (
    <InvoiceCtx.Provider value={{ invoices, addInvoice, markPaid }}>
      {children}
    </InvoiceCtx.Provider>
  );
}

export const useInvoices = () => useContext(InvoiceCtx);

export function nairaFmt(n: number) {
  return "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
