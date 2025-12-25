import { Transaction } from '../types';

export const calculateStats = (transactions: Transaction[]) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  return {
    income,
    expense,
    balance: income - expense
  };
};

export const getMonthlyData = (transactions: Transaction[]) => {
  const monthlyMap = new Map<string, { income: number; expense: number }>();

  transactions.forEach(t => {
    const date = new Date(t.date);
    const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { income: 0, expense: 0 });
    }
    
    const entry = monthlyMap.get(monthKey)!;
    if (t.type === 'income') {
      entry.income += t.amount;
    } else {
      entry.expense += t.amount;
    }
  });

  return Array.from(monthlyMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .reverse(); // Assuming transactions are sorted new->old, we might want old->new for charts
};

export const getCategoryData = (transactions: Transaction[]) => {
  const categoryMap = new Map<string, number>();

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

  return Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};
