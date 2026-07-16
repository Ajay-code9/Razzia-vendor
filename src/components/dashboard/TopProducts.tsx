import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, Watch, ShoppingBag, Glasses, Activity } from 'lucide-react';

interface ProductItem {
  name: string;
  sold: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

const products: ProductItem[] = [
  {
    name: 'Wireless Earbuds',
    sold: '1,245 sold',
    icon: <Headphones className="w-5 h-5" />,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    name: 'Smart Watch',
    sold: '965 sold',
    icon: <Watch className="w-5 h-5" />,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    name: 'Trendy Handbag',
    sold: '856 sold',
    icon: <ShoppingBag className="w-5 h-5" />,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  {
    name: 'Sunglasses',
    sold: '743 sold',
    icon: <Glasses className="w-5 h-5" />,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    name: 'Running Shoes',
    sold: '612 sold',
    icon: <Activity className="w-5 h-5" />,
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
];

export default function TopProducts() {
  return (
    <motion.div 
      whileHover={{ scale: 1.005, y: -1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm w-full md:w-[360px] lg:w-[380px] shrink-0 hover:shadow-widget transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
          Top Selling Products
        </h3>
        <Link 
          to="/products"
          className="text-[13px] font-extrabold text-brand hover:text-brand-hover transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Product list */}
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between group">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Product icon placeholder */}
              <div 
                className={`w-[44px] h-[44px] rounded-xl flex items-center justify-center shrink-0 border border-slate-50 transition-all duration-300 group-hover:scale-105 ${product.iconBg} ${product.iconColor}`}
              >
                {product.icon}
              </div>

              {/* Title */}
              <div className="min-w-0">
                <h4 className="text-[13.5px] font-bold text-slate-800 truncate group-hover:text-brand transition-colors">
                  {product.name}
                </h4>
              </div>
            </div>

            {/* Sales count */}
            <span className="text-[13px] font-extrabold text-slate-700 shrink-0">
              {product.sold}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
