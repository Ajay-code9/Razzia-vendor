import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  Radio, 
  ClipboardList, 
  BarChart3, 
  Percent, 
  Wallet 
} from 'lucide-react';

interface ActionItem {
  label: string;
  icon: ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  path: string;
}

export default function QuickActions() {
  const actions: ActionItem[] = [
    {
      label: 'Add Product',
      icon: <PlusCircle className="w-5 h-5" />,
      color: 'text-brand',
      bgColor: 'bg-brand/5',
      borderColor: 'hover:border-brand/35 hover:shadow-brand/5',
      path: '/products/add',
    },
    {
      label: 'Go Live',
      icon: <Radio className="w-5 h-5" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'hover:border-orange-200 hover:shadow-orange-500/5',
      path: '/live-streaming',
    },
    {
      label: 'Manage Orders',
      icon: <ClipboardList className="w-5 h-5" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'hover:border-blue-200 hover:shadow-blue-500/5',
      path: '/orders',
    },
    {
      label: 'View Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'hover:border-emerald-200 hover:shadow-emerald-500/5',
      path: '/analytics',
    },
    {
      label: 'Create Coupon',
      icon: <Percent className="w-5 h-5" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'hover:border-purple-200 hover:shadow-purple-500/5',
      path: '/marketing',
    },
    {
      label: 'Withdraw Earnings',
      icon: <Wallet className="w-5 h-5" />,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'hover:border-amber-200 hover:shadow-amber-500/5',
      path: '/earnings',
    },
  ];

  return (
    <motion.div 
      whileHover={{ scale: 1.005, y: -1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm w-full md:w-[360px] lg:w-[380px] shrink-0 hover:shadow-widget transition-shadow duration-200"
    >
      <h3 className="text-[16px] font-bold text-slate-800 tracking-tight mb-4">
        Quick Actions
      </h3>

      {/* Grid container */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex flex-col items-center justify-center p-4 border border-slate-100 bg-white rounded-xl transition-all duration-200 group hover:shadow-md ${item.borderColor}`}
          >
            {/* Icon Container */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-105 ${item.bgColor} ${item.color}`}>
              {item.icon}
            </div>
            {/* Label */}
            <span className="text-[12px] font-bold text-slate-700 leading-snug text-center">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
