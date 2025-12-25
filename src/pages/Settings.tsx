import React, { useRef } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Download, Upload, Trash2, AlertTriangle, Database, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const { transactions, addTransactions, clearTransactions } = useTransactions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expensecheck-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        if (Array.isArray(importedData)) {
          addTransactions(importedData);
          alert('Data imported successfully!');
        } else {
          alert('Invalid file format');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to parse file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearTransactions();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">Settings</h2>
        <p className="text-slate-400">Manage your data and application preferences</p>
      </div>
      
      <div className="p-8 rounded-2xl bg-[#151921]/80 backdrop-blur-xl border border-white/5 shadow-xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Database size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Data Management</h3>
            <p className="text-slate-400 mt-1">
              Your data is stored locally in your browser. You can export it for backup or transfer it to another device.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-[#0B0E14] hover:bg-[#1E232F] text-slate-300 hover:text-white border border-white/10 rounded-xl transition-all font-medium shadow-lg group"
            >
              <Download size={20} className="text-emerald-400 group-hover:text-emerald-300" />
              <div className="text-left">
                <span className="block text-sm font-semibold text-white">Export Data</span>
                <span className="text-xs text-slate-500">Download JSON backup</span>
              </div>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-[#0B0E14] hover:bg-[#1E232F] text-slate-300 hover:text-white border border-white/10 rounded-xl transition-all font-medium shadow-lg group"
            >
              <Upload size={20} className="text-blue-400 group-hover:text-blue-300" />
              <div className="text-left">
                <span className="block text-sm font-semibold text-white">Import Data</span>
                <span className="text-xs text-slate-500">Restore from JSON file</span>
              </div>
            </motion.button>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".json"
              onChange={handleImport}
            />
          </div>

          <div className="pt-6 border-t border-white/5">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h4 className="text-white font-medium">Danger Zone</h4>
                    <p className="text-xs text-slate-400">Irreversible action</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearData}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors font-medium text-sm"
              >
                <Trash2 size={16} />
                Clear All Data
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-[#151921]/80 backdrop-blur-xl border border-white/5 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
            <Info size={20} className="text-slate-400" />
            <h3 className="text-lg font-bold text-white">About</h3>
        </div>
        <div className="space-y-2 text-slate-400 text-sm">
            <p>ExpenseCheck v1.0.0</p>
            <p>Built with React, Vite, TailwindCSS, and Recharts.</p>
            <p className="pt-2 text-slate-500">
                Privacy Note: All data is stored locally on your device. No data is sent to any server.
            </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
