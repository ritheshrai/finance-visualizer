import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import TransactionForm from '../components/TransactionForm';
import PDFUploader from '../components/PDFUploader';
import { Trash2, TrendingUp, TrendingDown, Upload } from 'lucide-react';
import { clsx } from 'clsx';

const Transactions: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Transactions</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <Upload size={18} />
            <span className="hidden sm:inline">Import PDF</span>
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
          >
            Add Transaction
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-dark-card border border-slate-800 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-dark-muted">
            No transactions found. Add one manually or upload a statement.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-800/50 text-slate-200 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{transaction.date}</td>
                    <td className="px-6 py-4 font-medium text-white">{transaction.description}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={clsx(
                        "flex items-center gap-1 font-bold",
                        transaction.type === 'income' ? "text-green-400" : "text-red-400"
                      )}>
                        {transaction.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteTransaction(transaction.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && <TransactionForm onClose={() => setIsFormOpen(false)} />}
      {isUploadOpen && <PDFUploader onClose={() => setIsUploadOpen(false)} />}
    </div>
  );
};

export default Transactions;
