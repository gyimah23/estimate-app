
export interface Material {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface Labor {
  id: string;
  description: string;
  hours: number;
  hourlyRate: number;
  total: number;
}

export interface Estimate {
  id: string;
  projectTitle: string;
  clientName: string;
  clientAddress: string;
  date: string;
  materials: Material[];
  labor: Labor[];
  materialsCost: number;
  laborCost: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  status?: string;
  notes?: string;
}
