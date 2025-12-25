import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import TransactionForm from '../components/TransactionForm';
import PDFUploader from '../components/PDFUploader';
import { Trash2, TrendingUp, TrendingDown, Upload, Plus, FileText, Calendar, Tag } from 'lucide-react';
import { clsx } from 'clsx';
import { formatCurrency } from '../utils/format';
import { motion, AnimatePresence } from 'framer-motion';

const Transactions: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white mb-1">Transactions</h2>
            <p className="text-slate-400">Manage and track your financial entries</p>
        </div>
        <div className="flex gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsUploadOpen(true)}
            className="px-5 py-2.5 bg-[#151921] hover:bg-[#1E232F] text-slate-300 hover:text-white border border-white/10 rounded-xl transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl hover:border-white/20"
          >
            <Upload size={18} />
            <span className="hidden sm:inline">Import PDF</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFormOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus size={18} />
            Add Transaction
          </motion.button>
        </div>
      </div>

      <div className="rounded-2xl bg-[#151921]/80 backdrop-blur-xl border border-white/5 overflow-hidden shadow-xl">
        {transactions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500">
                <FileText size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No transactions yet</h3>
            <p className="text-slate-400 max-w-sm mx-auto">
              Get started by adding a transaction manually or importing your monthly Google Pay statement.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-white/5 text-slate-300 uppercase font-semibold text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-5">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        Date
                    </div>
                  </th>
                  <th className="px-6 py-5">Description</th>
                  <th className="px-6 py-5">
                    <div className="flex items-center gap-2">
                        <Tag size={14} />
                        Category
                    </div>
                  </th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {transactions.map((transaction) => (
                    <motion.tr 
                      key={transaction.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-300">{transaction.date}</td>
                      <td className="px-6 py-4 font-medium text-white">{transaction.description}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={clsx(
                          "flex items-center gap-1.5 font-bold font-mono tracking-tight",
                          transaction.type === 'income' ? "text-emerald-400" : "text-red-400"
                        )}>
                          {transaction.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteTransaction(transaction.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && <TransactionForm onClose={() => setIsFormOpen(false)} />}
      {isUploadOpen && <PDFUploader onClose={() => setIsUploadOpen(false)} />}
    </motion.div>
  );
};

export default Transactions;
