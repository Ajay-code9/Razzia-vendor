import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

const mockData = [
  { date: '16 May', sales: 20000 },
  { date: '17 May', sales: 30000 },
  { date: '18 May', sales: 25000 },
  { date: '19 May', sales: 45000 },
  { date: '20 May', sales: 35000 },
  { date: '21 May', sales: 32000 },
  { date: '22 May', sales: 60000 },
];

const formatCurrency = (val: number) => {
  return '₹' + val.toLocaleString('en-IN');
};

const formatYAxis = (val: number) => {
  if (val === 0) return '₹0';
  if (val >= 1000) return `₹${val / 1000}k`;
  return `₹${val}`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-md border border-slate-800">
        <p className="text-slate-400 font-medium mb-0.5">{payload[0].payload.date}</p>
        <p className="text-brand font-bold text-sm">{formatCurrency(payload[0].value as number)}</p>
      </div>
    );
  }
  return null;
};


export default function SalesChart() {
  return (
    <motion.div 
      whileHover={{ scale: 1.005, y: -1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex-1 hover:shadow-widget transition-shadow duration-200"
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
            Sales Overview
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[22px] font-black text-slate-800 tracking-tight">
              ₹1,24,560
            </span>
            <span className="flex items-center text-[11px] font-bold text-[#10B981] bg-emerald-50 px-1.5 py-0.5 rounded-md">
              <ArrowUpRight className="w-3.5 h-3.5" />
              + 18.4%
            </span>
          </div>
        </div>

        {/* Dropdown Selector */}
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-100 text-[13px] font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <span>This Week</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FE060D" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#FE060D" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="4 4" 
              vertical={false} 
              stroke="#F1F5F9" 
            />
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
              ticks={[0, 25000, 50000, 75000, 100000]}
              domain={[0, 100000]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#FE060D"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#salesGradient)"
              dot={{ stroke: '#FE060D', strokeWidth: 2, fill: '#FFFFFF', r: 5 }}
              activeDot={{ stroke: '#FE060D', strokeWidth: 2, fill: '#FE060D', r: 7 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
