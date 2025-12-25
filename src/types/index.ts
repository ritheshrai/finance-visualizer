export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  source: 'manual' | 'gpay' | 'hdfc' | 'gpay-pdf' | 'unknown';
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
}
