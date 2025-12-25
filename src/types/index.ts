export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  source: 'manual' | 'gpay-pdf';
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
}
