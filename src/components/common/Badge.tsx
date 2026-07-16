export type BadgeStatusType = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Packed' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Paid';

interface BadgeProps {
  status: BadgeStatusType | string;
}

export default function Badge({ status }: BadgeProps) {
  const getStyle = (val: string) => {
    switch (val) {
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Confirmed':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'Packed':
        return 'bg-pink-50 text-pink-600 border border-pink-100';
      case 'Shipped':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Delivered':
      case 'Paid':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Cancelled':
        return 'bg-slate-50 text-slate-500 border border-slate-150';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-normal ${getStyle(status)}`}>
      {status}
    </span>
  );
}
