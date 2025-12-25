import React, { useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { parsePDF } from '../utils/pdfParser';
import { useTransactions } from '../context/TransactionContext';
import { motion, AnimatePresence } from 'framer-motion';

const PDFUploader: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addTransactions } = useTransactions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const parsedTransactions = await parsePDF(file);
      
      if (parsedTransactions.length === 0) {
        setError('No transactions found in the PDF. Please ensure you uploaded a valid Google Pay or HDFC Bank statement.');
        setLoading(false);
        return;
      }

      const newTransactions = parsedTransactions.map(t => ({
        id: crypto.randomUUID(),
        ...t,
        category: 'Uncategorized', // Default category
      }));

      addTransactions(newTransactions);
      
      // Short delay to show success state if desired, or close immediately
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to parse PDF. Please try a different file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#151921] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white">Import Statement</h3>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
              <Upload size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Upload Statement PDF</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Supports <strong>Google Pay</strong> transaction history and <strong>HDFC Bank</strong> statements.
            </p>

            <label className="block w-full cursor-pointer">
              <div className="w-full bg-[#0B0E14] border-2 border-dashed border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/5 rounded-xl p-10 transition-all group relative overflow-hidden">
                {loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-emerald-500" size={36} />
                    <span className="text-emerald-400 font-medium">Processing statement...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="text-slate-500 group-hover:text-emerald-400 transition-colors" size={36} />
                    <div className="space-y-1">
                      <p className="text-slate-300 font-medium group-hover:text-white transition-colors">
                        Click to browse file
                      </p>
                      <p className="text-xs text-slate-500">PDF files only</p>
                    </div>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={loading}
              />
            </label>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 bg-white/5 py-2 px-4 rounded-full w-fit mx-auto">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Processed locally. Your data never leaves this device.</span>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm text-left"
              >
                <AlertCircle size={20} className="shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PDFUploader;
