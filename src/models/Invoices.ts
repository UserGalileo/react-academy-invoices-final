export interface InvoiceItem {
  id: number;
  text: string;
  price: number;
}

export interface InvoiceInfo {
  id: number;
  title: string;
  clientId: number | null;
  items: InvoiceItem[]
}

export interface Client {
  id: number;
  name: string;
}