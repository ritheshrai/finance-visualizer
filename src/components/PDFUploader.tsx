import React, { useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { parseGooglePayPDF } from '../utils/pdfParser';
import { useTransactions } from '../context/TransactionContext';

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
      const parsedTransactions = await parseGooglePayPDF(file);
      
      if (parsedTransactions.length === 0) {
        setError('No transactions found in the PDF. Please check the format.');
        setLoading(false);
        return;
      }

      const newTransactions = parsedTransactions.map(t => ({
        id: crypto.randomUUID(),
        ...t,
        category: 'Uncategorized', // Default category
        source: 'gpay-pdf' as const
      }));

      addTransactions(newTransactions);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to parse PDF. Ensure it is a valid Google Pay statement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-dark-card border border-slate-700 rounded-xl shadow-2xl p-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-4">
            <Upload size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Upload Google Pay PDF</h3>
          <p className="text-slate-400 text-sm mb-6">
            Upload your monthly statement to automatically import transactions.
          </p>

          <label className="block w-full cursor-pointer">
            <div className="w-full border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-8 transition-colors group">
              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                  <span className="text-slate-400">Parsing PDF...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="text-slate-500 group-hover:text-blue-400 transition-colors" size={32} />
                  <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                    Click to browse
                  </span>
                  <span className="text-xs text-slate-500">PDF files only</span>
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

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm text-left">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white font-medium text-sm"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUploader;
