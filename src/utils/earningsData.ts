export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  detail: string; // product name or card info
  type: 'Order Earnings' | 'Live Earnings' | 'Referral' | 'Bonus' | 'Withdrawal' | 'Refund' | 'Other Earnings';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Processing';
  runningBalance: number;
}

export interface BankAccountDetails {
  bankName: string;
  accountNumberMasked: string;
  ifsc: string;
  holderName: string;
  isVerified: boolean;
}

export const defaultBankDetails: BankAccountDetails = {
  bankName: 'HDFC Bank',
  accountNumberMasked: 'A/c No. 5020 XXXX 4567',
  ifsc: 'IFSC: HDFC0005020',
  holderName: 'Ajay Kumar',
  isVerified: true
};

export const initialTransactions: FinancialTransaction[] = [
  {
    id: 'TXN-701',
    date: '22 May, 2024 10:30 AM',
    description: 'Order #RAZ-1256',
    detail: 'Wireless Headphones',
    type: 'Order Earnings',
    amount: 3798,
    status: 'Completed',
    runningBalance: 32450
  },
  {
    id: 'TXN-702',
    date: '22 May, 2024 09:15 AM',
    description: 'Order #RAZ-1255',
    detail: 'Trendy Handbag',
    type: 'Order Earnings',
    amount: 1099,
    status: 'Completed',
    runningBalance: 28652
  },
  {
    id: 'TXN-703',
    date: '22 May, 2024 08:45 AM',
    description: 'Order #RAZ-1254',
    detail: 'Wireless Earbuds',
    type: 'Order Earnings',
    amount: 2098,
    status: 'Completed',
    runningBalance: 27553
  },
  {
    id: 'TXN-704',
    date: '21 May, 2024 07:30 PM',
    description: 'Live Stream Earnings',
    detail: 'Top Tech Deals Live',
    type: 'Live Earnings',
    amount: 1250,
    status: 'Completed',
    runningBalance: 25455
  },
  {
    id: 'TXN-705',
    date: '20 May, 2024 06:20 PM',
    description: 'Withdrawal to HDFC Bank',
    detail: 'A/c No. XXXX 4567',
    type: 'Withdrawal',
    amount: -10000,
    status: 'Completed',
    runningBalance: 24205
  },
  {
    id: 'TXN-706',
    date: '20 May, 2024 05:40 PM',
    description: 'Order #RAZ-1253',
    detail: 'Sunglasses',
    type: 'Order Earnings',
    amount: 599,
    status: 'Completed',
    runningBalance: 34205
  },
  {
    id: 'TXN-707',
    date: '19 May, 2024 11:10 AM',
    description: 'Referral Bonus',
    detail: 'Ref ID: REF-1253',
    type: 'Other Earnings',
    amount: 250,
    status: 'Completed',
    runningBalance: 33606
  }
];

export const loadWalletBalance = (): number => {
  const bal = localStorage.getItem('razzia_wallet_balance');
  return bal ? parseFloat(bal) : 32450;
};

export const saveWalletBalance = (bal: number): void => {
  localStorage.setItem('razzia_wallet_balance', bal.toString());
};

export const loadWithdrawnThisMonth = (): number => {
  const withdrawn = localStorage.getItem('razzia_withdrawn_month');
  return withdrawn ? parseFloat(withdrawn) : 10000;
};

export const saveWithdrawnThisMonth = (amt: number): void => {
  localStorage.setItem('razzia_withdrawn_month', amt.toString());
};

export const loadTransactions = (): FinancialTransaction[] => {
  const data = localStorage.getItem('razzia_transactions');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  return initialTransactions;
};

export const saveTransactions = (txns: FinancialTransaction[]): void => {
  localStorage.setItem('razzia_transactions', JSON.stringify(txns));
};
