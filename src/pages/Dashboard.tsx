import React, { useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { calculateStats, getMonthlyData, getCategoryData } from '../utils/analytics';
import { formatCurrency } from '../utils/format';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

const Dashboard: React.FC = () => {
  const { transactions } = useTransactions();

  const stats = useMemo(() => calculateStats(transactions), [transactions]);
  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categoryData = useMemo(() => getCategoryData(transactions), [transactions]);

  // Reverse monthly data to show chronological order
  const chartData = [...monthlyData].reverse();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#151921]/95 border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-slate-400 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm font-medium mb-1">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-300">{entry.name}:</span>
              <span className="text-white ml-auto font-mono">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold text-white mb-1">Dashboard</h2>
            <p className="text-slate-400">Financial overview and analytics</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-[#151921]/80 backdrop-blur-xl border border-white/5 shadow-lg group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold text-white mt-1 font-mono tracking-tight">{formatCurrency(stats.income)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-[#151921]/80 backdrop-blur-xl border border-white/5 shadow-lg group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-white mt-1 font-mono tracking-tight">{formatCurrency(stats.expense)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-[#151921]/80 backdrop-blur-xl border border-white/5 shadow-lg group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Net Balance</p>
              <p className={`text-2xl font-bold mt-1 font-mono tracking-tight ${stats.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                {formatCurrency(stats.balance)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#151921]/80 backdrop-blur-xl border border-white/5 shadow-lg min-h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white">Financial Activity</h3>
            <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-400">Income</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-slate-400">Expense</span>
                </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value/1000}k`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="income" 
                name="Income"
                stroke="#10B981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorIncome)" 
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                name="Expense"
                stroke="#EF4444" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorExpense)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense by Category Chart */}
        <div className="p-6 rounded-2xl bg-[#151921]/80 backdrop-blur-xl border border-white/5 shadow-lg min-h-[450px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Expense Distribution</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 overflow-y-auto max-h-[150px] custom-scrollbar pr-2">
            {categoryData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                    <div 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-slate-400 truncate flex-1">{entry.name}</span>
                    <span className="text-white font-mono">{((entry.value / stats.expense) * 100).toFixed(0)}%</span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
