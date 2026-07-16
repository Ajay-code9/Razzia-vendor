import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingCart, 
  Radio, 
  Gift, 
  Calendar, 
  ArrowUpRight, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  CheckCircle2, 
  SlidersHorizontal,
  Wallet,
  FileCheck,
  CreditCard,
  Building,
  Info,
  Copy,
  AlertTriangle,
  ArrowDownRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import type { FinancialTransaction, BankAccountDetails } from '../utils/earningsData';
import { 
  loadWalletBalance, 
  saveWalletBalance, 
  loadWithdrawnThisMonth, 
  saveWithdrawnThisMonth, 
  loadTransactions, 
  saveTransactions, 
  defaultBankDetails 
} from '../utils/earningsData';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';

// Sparklines mockup charts
const overviewSparklines = {
  total: [{ val: 32000 }, { val: 40000 }, { val: 35000 }, { val: 45000 }, { val: 41000 }, { val: 44000 }, { val: 45680 }],
  orders: [{ val: 28000 }, { val: 32000 }, { val: 31000 }, { val: 37000 }, { val: 34000 }, { val: 36000 }, { val: 38650 }],
  live: [{ val: 3500 }, { val: 5200 }, { val: 4200 }, { val: 5800 }, { val: 5100 }, { val: 5600 }, { val: 5820 }],
  other: [{ val: 900 }, { val: 1100 }, { val: 1050 }, { val: 1250 }, { val: 1120 }, { val: 1180 }, { val: 1210 }]
};

// Animated Number helper component
function AnimatedNumber({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 650; // ms
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        clearInterval(timer);
        setCurrent(value);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{current.toLocaleString('en-IN')}</span>;
}

export default function EarningsPage() {
  const { showToast } = useToast();

  // Load wallet stats
  const [balance, setBalance] = useState(() => loadWalletBalance());
  const [withdrawnMonth, setWithdrawnMonth] = useState(() => loadWithdrawnThisMonth());
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => loadTransactions());
  const [bankDetails, setBankDetails] = useState<BankAccountDetails>(defaultBankDetails);

  // Search & Filter queries
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dropdown menus
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Quick withdraw input field
  const [withdrawInput, setWithdrawInput] = useState('');

  // Modals state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<FinancialTransaction | null>(null);

  // Bank Form State
  const [bankFormName, setBankFormName] = useState(bankDetails.bankName);
  const [bankFormAccount, setBankFormAccount] = useState('5020XXXX4567');
  const [bankFormIfsc, setBankFormIfsc] = useState('HDFC0005020');

  // Table pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync click-out menus
  useEffect(() => {
    const handleClose = () => setActiveMenuId(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  // Filter Transaction list
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = t.description.toLowerCase().includes(query) || 
                            t.id.toLowerCase().includes(query) || 
                            t.detail.toLowerCase().includes(query);

      const matchesType = !typeFilter || t.type === typeFilter;
      const matchesStatus = !statusFilter || t.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, searchQuery, typeFilter, statusFilter]);

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  // Presets update input field
  const handleApplyPreset = (amt: number) => {
    setWithdrawInput(amt.toString());
  };

  const handleApplyMax = () => {
    setWithdrawInput(Math.floor(balance).toString());
  };

  // Withdraw flow triggers
  const handleQuickWithdrawTrigger = () => {
    const amt = parseFloat(withdrawInput);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid withdrawal amount.', 'error');
      return;
    }
    if (amt < 500) {
      showToast('Minimum withdrawal amount is ₹500.', 'error');
      return;
    }
    if (amt > balance) {
      showToast('Amount exceeds your available wallet balance.', 'error');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleProcessWithdrawal = (amt: number) => {
    const newBal = balance - amt;
    const newWithdrawn = withdrawnMonth + amt;

    // Create a new Transaction record
    const newTxn: FinancialTransaction = {
      id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleString('en-US', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      description: `Withdrawal to ${bankDetails.bankName}`,
      detail: bankDetails.accountNumberMasked.replace('A/c No. ', 'A/c '),
      type: 'Withdrawal',
      amount: -amt,
      status: 'Completed',
      runningBalance: newBal
    };

    const updatedTxns = [newTxn, ...transactions];

    // Persist states
    setBalance(newBal);
    saveWalletBalance(newBal);
    setWithdrawnMonth(newWithdrawn);
    saveWithdrawnThisMonth(newWithdrawn);
    setTransactions(updatedTxns);
    saveTransactions(updatedTxns);

    setWithdrawInput('');
    setIsConfirmModalOpen(false);
    setIsWithdrawModalOpen(false);
    showToast(`Withdrawal of ₹${amt.toLocaleString('en-IN')} completed successfully!`, 'success');
  };

  const handleUpdateBankDetails = () => {
    const updated: BankAccountDetails = {
      bankName: bankFormName,
      accountNumberMasked: `A/c No. ${bankFormAccount.slice(0, 4)} XXXX ${bankFormAccount.slice(-4)}`,
      ifsc: `IFSC: ${bankFormIfsc.toUpperCase()}`,
      holderName: 'Ajay Kumar',
      isVerified: true
    };
    setBankDetails(updated);
    setIsBankModalOpen(false);
    showToast('Bank account details updated successfully.', 'success');
  };

  const handleExportCSV = () => {
    const headers = 'Transaction ID,Date,Description,Type,Amount,Status,Running Balance\n';
    const rows = filteredTransactions.map(t => 
      `${t.id},${t.date},"${t.description} - ${t.detail}",${t.type},₹${t.amount},${t.status},₹${t.runningBalance}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `razzia_transactions_list_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    showToast('Transactions history list exported as CSV.', 'success');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 text-left relative">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">
            Earnings & Wallet
          </h1>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
            <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-slate-500">Earnings & Wallet</span>
          </div>
        </div>

        {/* Action Button controllers */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* Transaction History log */}
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
          >
            <FileCheck className="w-4.5 h-4.5 text-slate-400" />
            <span>Transaction History</span>
          </button>

          {/* Withdraw funds */}
          <button 
            onClick={() => setIsWithdrawModalOpen(true)}
            className="flex items-center gap-2 px-5 h-11 bg-brand hover:bg-brand-hover text-white font-extrabold text-[13px] rounded-xl transition-all duration-300 shadow-md shadow-brand/10 cursor-pointer"
          >
            <Wallet className="w-4.5 h-4.5" />
            <span>Withdraw Funds</span>
          </button>
        </div>
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column blocks (2/3 width) */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          
          {/* Available Balance Box banner */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-center gap-4 text-left">
              {/* Wallet illustration */}
              <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center shrink-0 shadow-inner">
                <Wallet className="w-8 h-8 text-brand" />
              </div>
              <div className="leading-tight">
                <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider block">Available Balance</span>
                <span className="text-[32px] font-black text-slate-850 block mt-1 tracking-tight leading-none">
                  ₹<AnimatedNumber value={balance} />.00
                </span>
                
                {/* bottom rows */}
                <div className="flex gap-4 mt-3 text-[12px] font-bold">
                  <span className="text-slate-400">Total Earnings: <strong className="text-emerald-500 font-extrabold">₹2,45,680.00</strong></span>
                  <span className="text-slate-400">This Month: <strong className="text-blue-500 font-extrabold">₹45,680.00</strong></span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsWithdrawModalOpen(true)}
              className="h-10 px-5 border border-brand text-brand hover:bg-brand hover:text-white font-black text-[12.5px] rounded-xl transition-all duration-200 cursor-pointer bg-white"
            >
              Withdraw Funds
            </button>
          </div>

          {/* Earnings Overview KPI layout */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
                Earnings Overview
              </h3>
              <select className="h-9 px-3 bg-slate-50 border border-slate-100 rounded-lg text-[12px] font-bold text-slate-655 cursor-pointer">
                <option value="This Month">This Month</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Total Earnings */}
              <KPICard 
                title="Total Earnings"
                metric={45680}
                description="vs last month"
                trend="+ 20.8%"
                isPositive={true}
                sparklineData={overviewSparklines.total}
                color="#10B981"
                icon={<DollarSign className="w-4.5 h-4.5 text-emerald-500" />}
              />

              {/* Order Earnings */}
              <KPICard 
                title="Order Earnings"
                metric={38650}
                description="vs last month"
                trend="+ 18.6%"
                isPositive={true}
                sparklineData={overviewSparklines.orders}
                color="#3B82F6"
                icon={<ShoppingCart className="w-4.5 h-4.5 text-blue-500" />}
              />

              {/* Live Streaming Earnings */}
              <KPICard 
                title="Live Streaming"
                metric={5820}
                description="vs last month"
                trend="+ 25.4%"
                isPositive={true}
                sparklineData={overviewSparklines.live}
                color="#F59E0B"
                icon={<Radio className="w-4.5 h-4.5 text-amber-500" />}
              />

              {/* Other Earnings */}
              <KPICard 
                title="Other Earnings"
                metric={1210}
                description="vs last month"
                trend="+ 12.3%"
                isPositive={true}
                sparklineData={overviewSparklines.other}
                color="#8B5CF6"
                icon={<Gift className="w-4.5 h-4.5 text-purple-500" />}
              />
            </div>
          </div>

          {/* Transaction History layout */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-2">
              <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
                Transaction History
              </h3>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative w-full sm:w-[180px]">
                  <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search transaction..."
                    className="w-full h-9 pl-8 pr-3 text-[11.5px] border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white bg-slate-50/20 transition-all font-medium text-slate-800"
                  />
                </div>

                <select 
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9 px-3 bg-slate-50 border border-slate-100 rounded-lg text-[12px] font-bold text-slate-655 cursor-pointer"
                >
                  <option value="">All Transactions</option>
                  <option value="Order Earnings">Order Earnings</option>
                  <option value="Live Earnings">Live Earnings</option>
                  <option value="Withdrawal">Withdrawal</option>
                  <option value="Other Earnings">Other Earnings</option>
                </select>

                <button 
                  onClick={() => showToast('Toggle transaction table filters', 'info')}
                  className="flex items-center gap-1.5 h-9 px-3 border border-slate-100 bg-white rounded-lg hover:bg-slate-50 text-[12px] font-bold text-slate-655 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Table lists */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px] min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11.5px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Balance</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((txn) => {
                      const isPositive = txn.amount > 0;
                      return (
                        <tr key={txn.id} className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-450 leading-tight">
                            {txn.date}
                          </td>
                          <td className="py-3.5 px-4 text-left">
                            <span className="font-bold text-slate-800 block leading-tight">{txn.description}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{txn.detail}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              txn.type === 'Order Earnings' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              txn.type === 'Live Earnings' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                              txn.type === 'Withdrawal' ? 'bg-rose-50 text-rose-600 border border-rose-105' :
                              'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                              {txn.type}
                            </span>
                          </td>
                          <td className={`py-3.5 px-4 font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {isPositive ? '+' : '-'} ₹{Math.abs(txn.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                              txn.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {txn.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            ₹{txn.runningBalance.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="relative inline-block">
                              <button 
                                onClick={() => setActiveMenuId(activeMenuId === txn.id ? null : txn.id)}
                                className="p-1 text-slate-400 hover:text-slate-655 rounded transition-colors cursor-pointer"
                              >
                                <MoreVertical className="w-4.5 h-4.5" />
                              </button>

                              <AnimatePresence>
                                {activeMenuId === txn.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 mt-1 w-40 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-20 text-left text-[11.5px] font-semibold text-slate-700"
                                  >
                                    <button 
                                      onClick={() => {
                                        setSelectedTxn(txn);
                                        setIsDetailsModalOpen(true);
                                      }}
                                      className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Info className="w-3.5 h-3.5 text-slate-400" />
                                      <span>View Details</span>
                                    </button>
                                    <button 
                                      onClick={() => showToast('Receipt download started.', 'success')}
                                      className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Download className="w-3.5 h-3.5 text-slate-400" />
                                      <span>Download Receipt</span>
                                    </button>
                                    <button 
                                      onClick={() => {
                                        navigator.clipboard.writeText(txn.id);
                                        showToast('Transaction ID copied.', 'success');
                                      }}
                                      className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                                      <span>Copy ID</span>
                                    </button>
                                    <button 
                                      onClick={() => showToast('Issue report ticket generated.', 'info')}
                                      className="w-full px-3 py-1.5 hover:bg-[#FFF0F0] text-brand flex items-center gap-2 cursor-pointer border-t border-slate-50"
                                    >
                                      <AlertTriangle className="w-3.5 h-3.5 text-brand" />
                                      <span>Report Issue</span>
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-450 font-medium">No transactions found matching your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-50 pt-4 text-[12px] font-bold text-slate-400 select-none">
                <span>Page {currentPage} of {totalPages}</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-50 text-slate-600 flex items-center justify-center cursor-pointer bg-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg border border-slate-100 hover:bg-slate-50 disabled:opacity-50 text-slate-600 flex items-center justify-center cursor-pointer bg-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column details cards (1/3 width) */}
        <div className="space-y-6 shrink-0">
          
          {/* Bank Account Details Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left space-y-4">
            <div className="flex justify-between items-baseline border-b border-slate-50 pb-2">
              <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">
                Bank Account
              </h3>
              <button 
                onClick={() => setIsBankModalOpen(true)}
                className="text-[11.5px] font-extrabold text-brand hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            {/* Account Info details */}
            <div className="flex items-start gap-4">
              <div className="w-[44px] h-[44px] rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
                <Building className="w-5 h-5 text-blue-500" />
              </div>

              <div className="leading-tight text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-850 text-[13.5px]">{bankDetails.bankName}</span>
                  <span className="bg-emerald-50 text-emerald-600 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full border border-emerald-100 select-none">
                    Verified
                  </span>
                </div>
                <span className="text-[12.5px] text-slate-505 block mt-1.5 font-mono">{bankDetails.accountNumberMasked}</span>
                <span className="text-[11.5px] text-slate-400 font-bold block mt-1 uppercase font-mono">{bankDetails.ifsc}</span>
                
                {/* Account holder */}
                <div className="mt-3">
                  <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Account Holder Name</span>
                  <span className="text-[12.5px] font-bold text-slate-800 block mt-0.5">{bankDetails.holderName}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setBankFormName(bankDetails.bankName);
                setBankFormAccount('502045679912');
                setBankFormIfsc('HDFC0005020');
                setIsBankModalOpen(true);
              }}
              className="w-full h-10 border border-slate-150 hover:bg-slate-50 text-slate-655 font-extrabold text-[12.5px] rounded-xl transition-all cursor-pointer bg-white"
            >
              Change Bank Account
            </button>
          </div>

          {/* Earnings Summary details */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left space-y-4">
            <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight border-b border-slate-50 pb-2">
              Earnings Summary
            </h3>

            <div className="space-y-3.5 text-[12.5px] font-semibold text-slate-505 text-left">
              <div className="flex justify-between items-baseline gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Available Balance
                </span>
                <span className="font-extrabold text-emerald-600 font-mono">₹{balance.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Pending Amount
                </span>
                <span className="font-bold text-slate-800 font-mono">₹2,350.00</span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Processing
                </span>
                <span className="font-bold text-slate-800 font-mono">₹1,680.00</span>
              </div>
              <div className="flex justify-between items-baseline gap-2 border-t border-slate-50 pt-3">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Withdrawn (This Month)
                </span>
                <span className="font-extrabold text-purple-600 font-mono">₹{withdrawnMonth.toLocaleString('en-IN')}.00</span>
              </div>
            </div>
          </div>

          {/* Quick Withdraw widget Form */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left space-y-4">
            <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight border-b border-slate-50 pb-2">
              Quick Withdraw
            </h3>

            <div className="space-y-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Enter Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-[14.5px] font-black text-slate-400">₹</span>
                  <input 
                    type="number" 
                    value={withdrawInput}
                    onChange={(e) => setWithdrawInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-11 pl-8 pr-4 text-[14.5px] font-extrabold border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white bg-slate-50/20 transition-all text-slate-850"
                  />
                </div>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button 
                  onClick={() => handleApplyPreset(1000)}
                  className="h-8 border border-slate-100 bg-white hover:bg-slate-50 text-[11.5px] font-bold text-slate-655 rounded-lg transition-colors cursor-pointer"
                >
                  ₹1,000
                </button>
                <button 
                  onClick={() => handleApplyPreset(5000)}
                  className="h-8 border border-slate-100 bg-white hover:bg-slate-50 text-[11.5px] font-bold text-slate-655 rounded-lg transition-colors cursor-pointer"
                >
                  ₹5,000
                </button>
                <button 
                  onClick={() => handleApplyPreset(10000)}
                  className="h-8 border border-slate-100 bg-white hover:bg-slate-50 text-[11.5px] font-bold text-slate-655 rounded-lg transition-colors cursor-pointer"
                >
                  ₹10,000
                </button>
                <button 
                  onClick={handleApplyMax}
                  className="h-8 border border-slate-100 bg-white hover:bg-slate-50 text-[11.5px] font-bold text-slate-655 rounded-lg transition-colors cursor-pointer"
                >
                  Max
                </button>
              </div>

              <button 
                onClick={handleQuickWithdrawTrigger}
                className="w-full h-11 bg-[#FFF0F0] border border-red-50 hover:bg-[#FFF0F0]/50 text-brand font-black text-[13px] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-brand" />
                <span>Withdraw Now</span>
              </button>
              <span className="text-[10px] text-slate-400 text-center block">Min. withdrawal amount is ₹500</span>
            </div>
          </div>

        </div>

      </div>

      {/* Main Withdraw Funds Form Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Withdraw Funds"
        footerButtons={
          <>
            <button 
              onClick={() => setIsWithdrawModalOpen(false)}
              className="h-10 px-4 border border-slate-150 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-xl transition-colors cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button 
              onClick={handleQuickWithdrawTrigger}
              className="h-10 px-5 bg-brand hover:bg-brand-hover text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
            >
              Next
            </button>
          </>
        }
      >
        <div className="space-y-4 max-w-[480px] text-left text-[13px]">
          <p className="text-slate-450 leading-relaxed">Select destination account and specify payout details to request funds release.</p>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Destination Bank Account</label>
            <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-800 block">{bankDetails.bankName}</span>
                <span className="text-[11.5px] text-slate-400 font-mono mt-0.5">{bankDetails.accountNumberMasked}</span>
              </div>
              <span className="bg-emerald-50 text-emerald-600 font-extrabold text-[9.5px] px-1.5 py-0.5 rounded border border-emerald-100 select-none">Active</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Withdrawal Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-[14px] font-black text-slate-400">₹</span>
              <input 
                type="number" 
                value={withdrawInput}
                onChange={(e) => setWithdrawInput(e.target.value)}
                placeholder="0.00"
                className="w-full h-11 pl-8 pr-4 text-[14.5px] font-extrabold border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white bg-slate-50/20 transition-all"
              />
            </div>
            <span className="text-[11px] text-slate-400">Available: ₹{balance.toLocaleString('en-IN')}.00</span>
          </div>
        </div>
      </Modal>

      {/* Confirmation withdrawal Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Payout Request"
        footerButtons={
          <>
            <button 
              onClick={() => setIsConfirmModalOpen(false)}
              className="h-10 px-4 border border-slate-150 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-xl transition-colors cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleProcessWithdrawal(parseFloat(withdrawInput))}
              className="h-10 px-5 bg-brand hover:bg-brand-hover text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer animate-pulse"
            >
              Confirm Withdrawal
            </button>
          </>
        }
      >
        <div className="space-y-3.5 max-w-[480px] text-left text-[13.5px] font-semibold text-slate-655 leading-relaxed">
          <p>Please confirm that you want to initiate a withdrawal transaction. Payouts are usually processed within 24 hours.</p>
          
          <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-1.5 text-[12.5px]">
            <div className="flex justify-between">
              <span>Payout Amount</span>
              <strong className="text-slate-850">₹{parseFloat(withdrawInput).toLocaleString('en-IN')}.00</strong>
            </div>
            <div className="flex justify-between">
              <span>Transfer Fees</span>
              <strong className="text-emerald-500 font-extrabold">₹0.00 (Free)</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200/50 pt-2 text-[13px]">
              <span>Destination Account</span>
              <strong className="text-slate-850">{bankDetails.bankName}</strong>
            </div>
          </div>
        </div>
      </Modal>

      {/* Bank Management Form Modal */}
      <Modal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        title="Update Bank Details"
        footerButtons={
          <>
            <button 
              onClick={() => setIsBankModalOpen(false)}
              className="h-10 px-4 border border-slate-150 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-xl transition-colors cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdateBankDetails}
              className="h-10 px-5 bg-brand hover:bg-brand-hover text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
            >
              Save Bank
            </button>
          </>
        }
      >
        <div className="space-y-4 max-w-[480px] text-left text-[13px]">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Bank Name</label>
            <input 
              type="text" 
              value={bankFormName}
              onChange={(e) => setBankFormName(e.target.value)}
              className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Account Number</label>
            <input 
              type="text" 
              value={bankFormAccount}
              onChange={(e) => setBankFormAccount(e.target.value)}
              className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">IFSC Code</label>
            <input 
              type="text" 
              value={bankFormIfsc}
              onChange={(e) => setBankFormIfsc(e.target.value)}
              className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5"
            />
          </div>
        </div>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Transaction Details"
        footerButtons={
          <button 
            onClick={() => setIsDetailsModalOpen(false)}
            className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        }
      >
        {selectedTxn && (
          <div className="space-y-4 max-w-[480px] text-left text-[13px] leading-relaxed">
            <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-2 font-bold text-slate-655 text-[12.5px]">
              <div className="flex justify-between">
                <span>Transaction ID</span>
                <span className="text-slate-800 font-mono">{selectedTxn.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time</span>
                <span className="text-slate-800 font-mono">{selectedTxn.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Type</span>
                <span className="text-slate-800">{selectedTxn.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Description</span>
                <span className="text-slate-800">{selectedTxn.description}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-emerald-600 font-extrabold">{selectedTxn.status}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/50 pt-2 text-[13px]">
                <span>Running Balance</span>
                <span className="text-slate-850">₹{selectedTxn.runningBalance.toLocaleString('en-IN')}.00</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}

// KPI widget Component
interface KPICardProps {
  title: string;
  metric: number;
  metricPrefix?: string;
  description: string;
  trend: string;
  isPositive: boolean;
  sparklineData: { val: number }[];
  color: string;
  icon: React.ReactNode;
}

function KPICard({ 
  title, 
  metric, 
  metricPrefix = '', 
  description, 
  trend, 
  isPositive, 
  sparklineData, 
  color, 
  icon 
}: KPICardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left flex flex-col justify-between min-h-[145px] hover:shadow-widget transition-shadow duration-200 group relative"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 shrink-0 group-hover:scale-105 transition-transform duration-200">
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">{title}</span>
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <span className="text-[19px] font-black text-slate-850 tracking-tight leading-none font-sans">
              {metricPrefix}
              <AnimatedNumber value={metric} />
            </span>
          </div>
        </div>
      </div>

      {/* Sparkline & trend metrics */}
      <div className="flex items-center justify-between gap-4 mt-3 border-t border-slate-50 pt-2.5">
        <div className="text-[10px] font-semibold text-slate-400 text-left">
          <span className={`font-extrabold mr-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>{trend}</span>
          <span>{description}</span>
        </div>
        {/* Sparkline box */}
        <div className="w-16 h-[24px] pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <Area type="monotone" dataKey="val" stroke={color} strokeWidth={1.5} fillOpacity={0.04} fill={color} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
