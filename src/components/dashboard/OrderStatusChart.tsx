import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Pending', value: 320, color: '#F97316' },     // Orange
  { name: 'Confirmed', value: 420, color: '#8B5CF6' },   // Purple
  { name: 'Shipped', value: 320, color: '#3B82F6' },     // Blue
  { name: 'Delivered', value: 188, color: '#10B981' },   // Green
];

export default function OrderStatusChart() {
  return (
    <motion.div 
      whileHover={{ scale: 1.005, y: -1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm w-full md:w-[360px] lg:w-[380px] shrink-0 hover:shadow-widget transition-shadow duration-200"
    >
      <h3 className="text-[16px] font-bold text-slate-800 tracking-tight mb-4">
        Order Status
      </h3>

      {/* Chart and Legend wrapper */}
      <div className="flex items-center justify-between gap-4 h-[180px]">
        {/* Donut Container */}
        <div className="relative w-[160px] h-[160px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Absolute Count Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[22px] font-black text-slate-800 leading-none">
              1,248
            </span>
            <span className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-[13px] font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-500 font-semibold">{item.name}</span>
              </div>
              <span className="font-extrabold text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
