import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Printer, 
  Download, 
  Copy, 
  MessageSquare, 
  Phone, 
  Check, 
  Package, 
  Headphones,
  Watch,
  ShoppingBag,
  Glasses,
  Activity
} from 'lucide-react';
import { mockOrders } from '../utils/ordersData';
import type { ProductItem, TimelineEvent } from '../utils/ordersData';
import Badge from '../components/common/Badge';

// Helper to copy text to clipboard
const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  alert('Copied transaction/order details to clipboard!');
};

// Icon Renderer
const ProductThumb = ({ type }: { type: ProductItem['iconName'] }) => {
  const getIcon = () => {
    switch (type) {
      case 'headphones':
        return <Headphones className="w-5 h-5 text-indigo-600" />;
      case 'watch':
        return <Watch className="w-5 h-5 text-emerald-600" />;
      case 'bag':
        return <ShoppingBag className="w-5 h-5 text-rose-600" />;
      case 'glasses':
        return <Glasses className="w-5 h-5 text-amber-600" />;
      case 'activity':
        return <Activity className="w-5 h-5 text-sky-600" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-slate-500" />;
    }
  };

  const getBg = () => {
    switch (type) {
      case 'headphones': return 'bg-indigo-50 border-indigo-100';
      case 'watch': return 'bg-emerald-50 border-emerald-100';
      case 'bag': return 'bg-rose-50 border-rose-100';
      case 'glasses': return 'bg-amber-50 border-amber-100';
      case 'activity': return 'bg-sky-50 border-sky-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${getBg()}`}>
      {getIcon()}
    </div>
  );
};

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  // Find matching order or fallback to first order for safety
  const order = mockOrders.find((o) => o.id.replace('#', '') === id) || mockOrders[0];

  const subtotal = order.products.reduce((acc, p) => acc + (p.price * p.qty), 0);
  const shippingCharges = 0; // Mock free shipping

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800">
      
      {/* Title, Breadcrumb & Header Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">
            Order Details
          </h1>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
            <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <Link to="/orders" className="hover:text-brand transition-colors">Orders</Link>
            <span>&gt;</span>
            <span className="text-slate-500">Order Details</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* Back to Orders */}
          <Link 
            to="/orders"
            className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4.5 h-4.5 text-slate-400" />
            <span>Back to Orders</span>
          </Link>
          
          {/* Print Invoice */}
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center w-11 h-11 border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
            aria-label="Print Invoice"
          >
            <Printer className="w-4.5 h-4.5" />
          </button>

          {/* Download Invoice */}
          <button 
            onClick={() => alert('Downloading invoice PDF...')}
            className="flex items-center gap-2 px-5 h-11 bg-brand hover:bg-brand-hover text-white font-extrabold text-[13px] rounded-xl transition-all duration-300 shadow-md shadow-brand/10"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Download Invoice</span>
          </button>
        </div>
      </div>

      {/* Top Full-Width Summary Card */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
        
        {/* Order ID */}
        <div className="flex flex-col gap-1.5 pb-4 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Order ID
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-black text-slate-800">
              {order.id}
            </span>
            <button 
              onClick={() => handleCopy(order.id)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50 transition-colors"
              aria-label="Copy Order ID"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[12px] font-medium text-slate-400">
            {order.date} • {order.time}
          </span>
          <div className="mt-1">
            <Badge status={order.orderStatus} />
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-1.5 pt-4 sm:pt-0 lg:pl-6">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Payment Method
          </span>
          <span className="text-[15px] font-extrabold text-slate-800 mt-0.5 leading-tight">
            {order.paymentMethod}
          </span>
          <span className={`text-[12px] font-extrabold leading-none ${
            order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-500'
          }`}>
            {order.paymentStatus}
          </span>
          {order.transactionId && (
            <div className="flex flex-col mt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Transaction ID
              </span>
              <span className="text-[11px] font-medium text-slate-500 mt-0.5 truncate select-all">
                {order.transactionId}
              </span>
            </div>
          )}
        </div>

        {/* Shipping Method */}
        <div className="flex flex-col gap-1.5 pt-4 sm:pt-0 lg:pl-6">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Shipping Method
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {/* Truck Icon Representing Standard/Express */}
            <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span className="text-[14px] font-bold text-slate-700">
              {order.shippingMethod}
            </span>
          </div>
          <div className="flex flex-col mt-1.5">
            <span className="text-[11px] font-semibold text-slate-400">
              Expected Delivery
            </span>
            <span className="text-[13px] font-extrabold text-indigo-600 mt-0.5">
              {order.expectedDelivery}
            </span>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex flex-col gap-1 pt-4 sm:pt-0 lg:pl-6 justify-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Amount
          </span>
          <span className="text-[26px] font-black text-slate-800 tracking-tight leading-none mt-1">
            ₹{order.amount.toLocaleString('en-IN')}
          </span>
          <span className="text-[12px] font-semibold text-slate-400 mt-1">
            {order.products.reduce((acc, p) => acc + p.qty, 0)} Items
          </span>
        </div>

      </div>

      {/* Grid Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left column: Products table, Customer Address, Order Notes */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Products Table Card */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
              Products ({order.products.length})
            </h3>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/20">
                    <th className="py-3 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="py-3 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider text-right">
                      Price
                    </th>
                    <th className="py-3 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider text-center w-20">
                      Qty
                    </th>
                    <th className="py-3 pr-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider text-right">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.products.map((item, index) => (
                    <tr key={index} className="group">
                      {/* Product thumb & names */}
                      <td className="py-4 px-4 flex items-center gap-3.5">
                        <ProductThumb type={item.iconName} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-bold text-slate-800 truncate">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5 leading-none">
                            SKU: {item.sku}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5 leading-none">
                            {item.color}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 text-[13px] font-bold text-slate-700 text-right">
                        ₹{item.price.toLocaleString('en-IN')}
                      </td>

                      {/* Qty */}
                      <td className="py-4 px-4 text-[13px] font-semibold text-slate-500 text-center">
                        {item.qty}
                      </td>

                      {/* Total */}
                      <td className="py-4 pr-4 text-[13px] font-extrabold text-slate-800 text-right">
                        {item.isFree ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-100 select-none">
                            Free Gift
                          </span>
                        ) : (
                          `₹${(item.price * item.qty).toLocaleString('en-IN')}`
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subtotals nested block */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <div className="w-[280px] space-y-2.5 text-[13px] font-medium text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Charges</span>
                  <span className="font-bold text-slate-800">
                    {shippingCharges === 0 ? '₹0' : `₹${shippingCharges}`}
                  </span>
                </div>
                <div className="flex justify-between text-[14px] font-bold pt-2 border-t border-slate-50">
                  <span className="text-slate-700">Total Amount</span>
                  <span className="text-brand text-[15px] font-black">₹{order.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Customer & Address Card */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-5">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
              Customer & Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* Profile details */}
              <div className="pb-5 md:pb-0 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-100 overflow-hidden shrink-0">
                    <svg viewBox="0 0 32 32" className="w-full h-full text-slate-400" fill="currentColor">
                      <path d="M16 8a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm0 10c-6.13 0-11 3.87-11 8a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1c0-4.13-4.87-8-11-8z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-bold text-slate-800">
                        {order.customer.name}
                      </span>
                      {order.customer.isVerified && (
                        <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wide leading-none select-none">
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] text-slate-400 mt-0.5 leading-none">
                      {order.customer.email}
                    </span>
                  </div>
                </div>
                <span className="text-[12px] font-semibold text-slate-500">
                  {order.customer.phone}
                </span>
              </div>

              {/* Shipping address */}
              <div className="pt-5 md:pt-0 md:pl-6 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Shipping Address
                </span>
                <p className="text-[13px] font-medium text-slate-600 leading-relaxed mt-1">
                  {order.shippingAddress}
                </p>
              </div>

              {/* Billing address */}
              <div className="pt-5 md:pt-0 md:pl-6 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Billing Address
                </span>
                <p className="text-[13px] font-medium text-slate-600 leading-relaxed mt-1">
                  {order.billingAddress}
                </p>
              </div>

            </div>
          </div>

          {/* Order Notes Card */}
          {order.customerNote && (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-3">
              <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
                Order Notes
              </h3>
              <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-xl">
                <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-700">Customer Note: </span>
                  {order.customerNote}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Right column: Order Status Timeline, Summary & actions */}
        <div className="w-full lg:w-[360px] xl:w-[380px] flex flex-col gap-6 shrink-0">
          
          {/* Order Status Timeline Card */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight mb-5">
              Order Status
            </h3>

            {/* Vertical Connecting Timeline */}
            <div className="relative pl-6 space-y-6">
              {/* Vertical connector line */}
              <div className="absolute top-2 bottom-2 left-[11px] w-[2px] bg-slate-100" />

              {order.timeline.map((event, index) => {
                const isCompleted = event.status === 'completed';
                const isActive = event.status === 'active';
                
                return (
                  <div key={index} className="relative flex gap-4 text-left">
                    {/* Circle icon marker on line */}
                    <div className="absolute -left-[20px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white z-10">
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white border border-brand shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        </div>
                      ) : isActive ? (
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white border border-amber-500 shrink-0">
                          <Package className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-200 shrink-0" />
                      )}
                    </div>

                    {/* Event Description Card */}
                    <div className="flex-1 min-w-0 pl-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className={`text-[13px] font-bold ${
                          isCompleted || isActive ? 'text-slate-800' : 'text-slate-400'
                        }`}>
                          {event.title}
                        </h4>
                      </div>
                      
                      {event.date !== 'Pending' ? (
                        <span className="text-[11px] font-medium text-slate-400 block mt-0.5 leading-none">
                          {event.date} {event.time}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400 block mt-0.5 uppercase tracking-wide leading-none">
                          Pending
                        </span>
                      )}

                      {event.description && (
                        <p className="text-[12px] font-medium text-slate-500 mt-1 leading-relaxed bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100/50">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
              Order Summary
            </h3>
            
            <div className="space-y-3 text-[13px] font-medium text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal ({order.products.reduce((acc, p) => acc + p.qty, 0)} Items)</span>
                <span className="font-bold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span className="font-bold text-slate-800">
                  {shippingCharges === 0 ? '₹0' : `₹${shippingCharges}`}
                </span>
              </div>
              <div className="h-px bg-slate-100 my-2" />
              <div className="flex justify-between text-[15px] font-bold pt-1">
                <span className="text-slate-700">Total Amount</span>
                <span className="text-brand text-[17px] font-black">₹{order.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Customer Actions Card */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
              Customer Actions
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Message */}
              <button 
                onClick={() => alert(`Messaging customer ${order.customer.name}...`)}
                className="h-11 px-4 border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-bold text-slate-700 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>Message Customer</span>
              </button>

              {/* Call */}
              <button 
                onClick={() => alert(`Calling ${order.customer.phone}...`)}
                className="h-11 px-4 bg-brand-light hover:bg-brand text-brand hover:text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-brand/5 shadow-sm shadow-brand/2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Customer</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
