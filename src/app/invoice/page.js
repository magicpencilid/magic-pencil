/* =============================================
   💳 INVOICE PAGE — Detail Invoice
   
   Bisa diakses lewat: /invoice?id=123
   atau nampilin form untuk cari invoice by nomor.
   ============================================= */

import InvoiceLookup from "@/components/InvoiceLookup";

export const metadata = {
  title: "Invoice | Magic Pencil",
};

export default function InvoicePage() {
  return <InvoiceLookup />;
}
