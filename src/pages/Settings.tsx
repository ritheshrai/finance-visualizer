import React, { useRef } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react';

const Settings: React.FC = () => {
  const { transactions, addTransactions, clearTransactions } = useTransactions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finviz-export-${new Date().toISOString().split('T')[0]}.json`;
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
          // Basic validation could go here
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Settings</h2>
      
      <div className="p-6 rounded-xl bg-dark-card border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4">Data Management</h3>
        <p className="text-dark-muted mb-6">
          Manage your transaction data. You can back up your data to a JSON file or restore it from a previous backup.
        </p>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
            >
              <Download size={18} />
              Export Data
            </button>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
            >
              <Upload size={18} />
              Import Data
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".json"
              onChange={handleImport}
            />
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
              <AlertTriangle size={18} />
              Danger Zone
            </h4>
            <button 
              onClick={handleClearData}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded-lg transition-colors font-medium"
            >
              <Trash2 size={18} />
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-dark-card border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4">About</h3>
        <div className="space-y-2 text-dark-muted">
            <p>Finance Visualizer v1.0.0</p>
            <p>Built with React, Vite, TailwindCSS, and Recharts.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
