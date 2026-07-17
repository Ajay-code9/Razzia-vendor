import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  amount: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
  date: string;
}

const orders: Order[] = [
  { id: '#RAZ12345', customer: 'Rohit Sharma', amount: '₹1,299', status: 'Pending', date: '22 May, 2024' },
  { id: '#RAZ12344', customer: 'Neha Patel', amount: '₹899', status: 'Confirmed', date: '22 May, 2024' },
  { id: '#RAZ12343', customer: 'Aman Verma', amount: '₹1,499', status: 'Shipped', date: '21 May, 2024' },
  { id: '#RAZ12342', customer: 'Priya Singh', amount: '₹659', status: 'Delivered', date: '21 May, 2024' },
  { id: '#RAZ12341', customer: 'Karan Mehta', amount: '₹1,009', status: 'Delivered', date: '20 May, 2024' },
];

export default function RecentOrders() {
  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Confirmed':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'Shipped':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.005, y: -1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex-1 min-w-0 hover:shadow-widget transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
          Recent Orders
        </h3>
        <Link 
          to="/orders"
          className="text-[13px] font-extrabold text-brand hover:text-brand-hover transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Table responsive container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[580px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 pr-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="pb-3 pr-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="pb-3 pr-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="pb-3 pr-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="pb-3 pr-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th className="pb-3 text-[12px] font-bold text-slate-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((order) => (
              <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-4 pr-4 text-[13px] font-bold text-slate-850">
                  {order.id}
                </td>
                <td className="py-4 pr-4 text-[13px] font-semibold text-slate-700">
                  {order.customer}
                </td>
                <td className="py-4 pr-4 text-[13px] font-extrabold text-slate-850">
                  {order.amount}
                </td>
                <td className="py-4 pr-4 text-[13px]">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 pr-4 text-[13px] font-semibold text-slate-400">
                  {order.date}
                </td>
                <td className="py-4 text-[13px] text-right">
                  <Link 
                    to={`/orders/${order.id.replace('#', '')}`}
                    className="p-1.5 text-slate-400 hover:text-brand hover:bg-brand-light rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                  >
                    <Eye className="w-4.5 h-4.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
