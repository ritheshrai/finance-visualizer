import React, { useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { calculateStats, getMonthlyData, getCategoryData } from '../utils/analytics';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

const Dashboard: React.FC = () => {
  const { transactions } = useTransactions();

  const stats = useMemo(() => calculateStats(transactions), [transactions]);
  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categoryData = useMemo(() => getCategoryData(transactions), [transactions]);

  // Reverse monthly data to show chronological order
  const chartData = [...monthlyData].reverse();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-dark-card border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-500/10 text-green-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-dark-muted text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold text-white">${stats.income.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-dark-card border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-500/10 text-red-400">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-dark-muted text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-white">${stats.expense.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-dark-card border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-dark-muted text-sm font-medium">Net Balance</p>
              <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                ${stats.balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense Chart */}
        <div className="p-6 rounded-xl bg-dark-card border border-slate-800 h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Income & Expenses</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense by Category Chart */}
        <div className="p-6 rounded-xl bg-dark-card border border-slate-800 h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Expense by Category</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {categoryData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
