import React, { useState } from 'react';
import { Calculator, IndianRupee, Info } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { motion } from 'framer-motion';

const TaxCalculator: React.FC = () => {
  const [income, setIncome] = useState<string>('');
  
  // Simplified tax calculation for FY 2024-25 (New Regime)
  // 0-3L: Nil
  // 3-7L: 5%
  // 7-10L: 10%
  // 10-12L: 15%
  // 12-15L: 20%
  // >15L: 30%
  // Standard Deduction: 75,000
  // Rebate u/s 87A: Tax is 0 if taxable income <= 7L
  
  const calculateTax = () => {
    const grossIncome = parseFloat(income) || 0;
    if (grossIncome === 0) return { tax: 0, cess: 0, total: 0 };

    let taxableIncome = grossIncome - 75000; // Standard Deduction
    if (taxableIncome < 0) taxableIncome = 0;

    // If taxable income <= 7L, no tax (Rebate 87A)
    // Note: The marginal relief is ignored for simplicity in this basic version
    if (taxableIncome <= 700000) {
      return { tax: 0, cess: 0, total: 0 };
    }

    let tax = 0;
    
    // Slab 1: 0-3L
    // Nil

    // Slab 2: 3-7L (4L width) @ 5%
    if (taxableIncome > 300000) {
      tax += Math.min(taxableIncome - 300000, 400000) * 0.05;
    }

    // Slab 3: 7-10L (3L width) @ 10%
    if (taxableIncome > 700000) {
      tax += Math.min(taxableIncome - 700000, 300000) * 0.10;
    }

    // Slab 4: 10-12L (2L width) @ 15%
    if (taxableIncome > 1000000) {
      tax += Math.min(taxableIncome - 1000000, 200000) * 0.15;
    }

    // Slab 5: 12-15L (3L width) @ 20%
    if (taxableIncome > 1200000) {
      tax += Math.min(taxableIncome - 1200000, 300000) * 0.20;
    }

    // Slab 6: >15L @ 30%
    if (taxableIncome > 1500000) {
      tax += (taxableIncome - 1500000) * 0.30;
    }

    const cess = tax * 0.04;
    return { tax, cess, total: tax + cess };
  };

  const result = calculateTax();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Tax Estimator</h2>
          <p className="text-slate-400">Estimate your income tax liability for FY 2024-25 (New Regime)</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-500/20">
          <Calculator className="text-emerald-400" size={32} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#151921]/80 backdrop-blur-xl border border-white/5 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <IndianRupee size={20} className="text-emerald-400" />
              Income Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Annual Gross Income
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">₹</span>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    placeholder="Enter your annual income"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                <Info className="text-blue-400 shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-blue-300/80">
                  <p className="font-medium text-blue-300 mb-1">Standard Deduction Applied</p>
                  <p>A standard deduction of ₹75,000 is automatically applied to your gross income as per the New Tax Regime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#151921]/90 to-[#151921]/50 backdrop-blur-xl border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <h3 className="text-lg font-semibold text-white mb-6">Tax Breakdown</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-slate-400">Gross Income</span>
                <span className="text-white font-medium">{formatCurrency(parseFloat(income) || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-slate-400">Standard Deduction</span>
                <span className="text-emerald-400 font-medium">- {formatCurrency(75000)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-slate-400">Taxable Income</span>
                <span className="text-white font-bold">{formatCurrency(Math.max(0, (parseFloat(income) || 0) - 75000))}</span>
              </div>
              
              <div className="pt-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Income Tax</span>
                  <span className="text-white">{formatCurrency(result.tax)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Health & Education Cess (4%)</span>
                  <span className="text-white">{formatCurrency(result.cess)}</span>
                </div>
              </div>

              <div className="pt-6 mt-2 border-t border-dashed border-white/10">
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 font-medium">Total Tax Liability</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {formatCurrency(result.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaxCalculator;
