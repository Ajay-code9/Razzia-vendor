import { useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  Upload, 
  Download, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  RefreshCw,
  Package, 
  CheckCircle2, 
  EyeOff, 
  Tag, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  Trash
} from 'lucide-react';
import { loadProducts, saveProducts } from '../utils/productsData';
import type { Product } from '../utils/productsData';
import { useToast } from '../context/ToastContext';
import Badge from '../components/common/Badge';
import FilterSelect from '../components/common/FilterSelect';
import Modal from '../components/common/Modal';

export default function ProductsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // State from LocalStorage
  const [products, setProducts] = useState<Product[]>(() => loadProducts());
  
  // Search, Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting State
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock' | 'createdDate'>('createdDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selection State
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [productToView, setProductToView] = useState<Product | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Spacing and Spacers Layout for Stats Counts
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.status === 'Active').length;
    const inactive = products.filter(p => p.status === 'Inactive').length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    return { total, active, inactive, outOfStock };
  }, [products]);

  // Product categories in database
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats).map(c => ({ label: c, value: c }));
  }, [products]);

  const categoryOptions = [{ label: 'All Categories', value: '' }, ...categories];
  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Draft', value: 'Draft' },
  ];
  const stockOptions = [
    { label: 'All Stock Status', value: '' },
    { label: 'In Stock', value: 'In Stock' },
    { label: 'Low Stock', value: 'Low Stock' },
    { label: 'Out of Stock', value: 'Out of Stock' },
  ];

  // Helper to determine Stock Status
  const getStockStatus = (p: Product) => {
    if (p.stock === 0) return 'Out of Stock';
    if (p.stock <= p.lowStockAlert) return 'Low Stock';
    return 'In Stock';
  };

  // CSV Exporter
  const handleExportCSV = (selectedOnly = false) => {
    const listToExport = selectedOnly 
      ? products.filter(p => selectedProductIds.includes(p.id))
      : products;
    
    if (listToExport.length === 0) {
      showToast('No products selected to export.', 'warning');
      return;
    }

    const headers = ['Product ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Created At'];
    const csvRows = [headers.join(',')];

    listToExport.forEach(p => {
      const row = [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`,
        p.sku,
        p.category,
        p.price,
        p.stock,
        p.status,
        `"${p.createdDate} ${p.createdTime}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `razzia_products_${selectedOnly ? 'selection' : 'all'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${listToExport.length} products to CSV.`, 'success');
  };

  // CSV Importer
  const handleCSVImportTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const rows = text.split('\n').map(row => row.split(','));
      if (rows.length <= 1) {
        showToast('CSV file is empty or missing headers.', 'error');
        return;
      }

      // Quick Parse (ignore headers on row 0)
      const importedProducts: Product[] = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 5 || !row[0]) continue;
        
        const cleanName = row[1]?.replace(/"/g, '') || 'Imported Product';
        const cleanPrice = parseFloat(row[4]) || 0;
        const cleanStock = parseInt(row[5]) || 0;

        importedProducts.push({
          id: `PROD-IMP-${Math.floor(Math.random() * 9000) + 1000}`,
          name: cleanName,
          subtext: 'CSV Imported Item',
          sku: row[2] || `SKU-IMP-${Math.floor(Math.random() * 9000)}`,
          category: row[3] || 'Imported',
          price: cleanPrice,
          stock: cleanStock,
          lowStockAlert: 5,
          unit: 'Pcs',
          shortDescription: 'CSV Imported description',
          fullDescription: 'CSV Imported details',
          status: (row[6] as Product['status']) || 'Draft',
          createdDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          createdTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          images: [],
          iconName: 'bag'
        });
      }

      if (importedProducts.length > 0) {
        const updated = [...products, ...importedProducts];
        setProducts(updated);
        saveProducts(updated);
        showToast(`Successfully imported ${importedProducts.length} products from CSV!`, 'success');
      } else {
        showToast('No valid rows found in CSV.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // clear select state
  };

  // Sorting trigger function
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Search & Multi-Filters processing
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Query Search (Name, SKU, Category)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesCategory) return false;
      }
      // Category filter
      if (categoryFilter && p.category !== categoryFilter) {
        return false;
      }
      // Status filter
      if (statusFilter && p.status !== statusFilter) {
        return false;
      }
      // Stock filter
      if (stockFilter) {
        const stockStatus = getStockStatus(p);
        if (stockStatus !== stockFilter) return false;
      }
      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // convert string prices/stock checks
      if (sortField === 'price' || sortField === 'stock') {
        const numA = Number(valA);
        const numB = Number(valB);
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
      if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [products, searchQuery, categoryFilter, statusFilter, stockFilter, sortField, sortOrder]);

  // Pagination processing
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Row Selection logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProductIds(paginatedProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProductIds(prev => [...prev, id]);
    } else {
      setSelectedProductIds(prev => prev.filter(item => item !== id));
    }
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    const updated = products.filter(p => !selectedProductIds.includes(p.id));
    setProducts(updated);
    saveProducts(updated);
    showToast(`Deleted ${selectedProductIds.length} products.`, 'success');
    setSelectedProductIds([]);
  };

  const handleBulkChangeStatus = (newStatus: Product['status']) => {
    const updated = products.map(p => {
      if (selectedProductIds.includes(p.id)) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    setProducts(updated);
    saveProducts(updated);
    showToast(`Changed status to ${newStatus} for ${selectedProductIds.length} products.`, 'success');
    setSelectedProductIds([]);
  };

  // Delete product logic
  const confirmDelete = (p: Product) => {
    setProductToDelete(p);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!productToDelete) return;
    const updated = products.filter(p => p.id !== productToDelete.id);
    setProducts(updated);
    saveProducts(updated);
    showToast(`Product ${productToDelete.name} was successfully deleted.`, 'success');
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Helper icons logic for table product cells
  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case 'Electronics':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Fashion':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'Footwear':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  };

  const getStockColumn = (p: Product) => {
    const status = getStockStatus(p);
    switch (status) {
      case 'Out of Stock':
        return (
          <div className="flex flex-col">
            <span className="text-[13px] font-extrabold text-rose-500">0</span>
            <span className="text-[11px] font-bold text-rose-500 leading-none mt-0.5">Out of Stock</span>
          </div>
        );
      case 'Low Stock':
        return (
          <div className="flex flex-col">
            <span className="text-[13px] font-extrabold text-amber-500">{p.stock}</span>
            <span className="text-[11px] font-bold text-amber-500 leading-none mt-0.5">Low Stock</span>
          </div>
        );
      case 'In Stock':
      default:
        return (
          <div className="flex flex-col">
            <span className="text-[13px] font-extrabold text-slate-800">{p.stock}</span>
            <span className="text-[11px] font-bold text-emerald-600 leading-none mt-0.5">In Stock</span>
          </div>
        );
    }
  };

  const getProductSVG = (icon: Product['iconName']) => {
    switch (icon) {
      case 'headphones':
        return <Package className="w-5 h-5 text-indigo-500" />;
      case 'watch':
        return <Package className="w-5 h-5 text-emerald-500" />;
      case 'bag':
        return <Package className="w-5 h-5 text-rose-500" />;
      case 'glasses':
        return <Package className="w-5 h-5 text-amber-500" />;
      case 'activity':
      default:
        return <Package className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800">
      
      {/* CSV Input Hidden element */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleCSVImport} 
        accept=".csv" 
        className="hidden" 
      />

      {/* Header breadcrumb & top buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">
            Products
          </h1>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
            <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-slate-500">Products</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Import */}
          <button 
            onClick={handleCSVImportTrigger}
            className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Upload className="w-4.5 h-4.5 text-slate-400" />
            <span>Import</span>
          </button>
          
          {/* Export */}
          <button 
            onClick={() => handleExportCSV(false)}
            className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4.5 h-4.5 text-slate-400" />
            <span>Export</span>
          </button>

          {/* Add Product */}
          <Link 
            to="/products/add"
            className="flex items-center gap-1.5 px-5 h-11 bg-brand hover:bg-brand-hover text-white font-extrabold text-[13px] rounded-xl transition-all duration-300 shadow-md shadow-brand/10"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Products */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full shrink-0 bg-red-50 text-brand">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[13px] font-bold text-slate-400 block tracking-tight truncate">Total Products</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[24px] font-bold text-slate-800 tracking-tight leading-none">{stats.total}</span>
              <span className="flex items-center text-[11px] font-bold text-[#10B981] leading-none bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3.5 h-3.5" /> +12.5%
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">vs last 7 days</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full shrink-0 bg-emerald-50 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[13px] font-bold text-slate-400 block tracking-tight truncate">Active Products</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[24px] font-bold text-slate-800 tracking-tight leading-none">{stats.active}</span>
              <span className="flex items-center text-[11px] font-bold text-[#10B981] leading-none bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3.5 h-3.5" /> +8.3%
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">vs last 7 days</span>
          </div>
        </div>

        {/* Inactive Products */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full shrink-0 bg-amber-50 text-amber-500">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[13px] font-bold text-slate-400 block tracking-tight truncate">Inactive Products</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[24px] font-bold text-slate-800 tracking-tight leading-none">{stats.inactive}</span>
              <span className="flex items-center text-[11px] font-bold text-rose-500 leading-none bg-rose-50 px-1.5 py-0.5 rounded-md">
                <ArrowDownRight className="w-3.5 h-3.5" /> -4.2%
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">vs last 7 days</span>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full shrink-0 bg-purple-50 text-purple-500">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[13px] font-bold text-slate-400 block tracking-tight truncate">Out of Stock</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[24px] font-bold text-slate-800 tracking-tight leading-none">{stats.outOfStock}</span>
              <span className="flex items-center text-[11px] font-bold text-rose-500 leading-none bg-rose-50 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3.5 h-3.5" /> +3.6%
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">vs last 7 days</span>
          </div>
        </div>

      </div>

      {/* Filter Row controls */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[280px] max-w-[420px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product name, SKU or category..." 
            className="w-full h-11 pl-10 pr-4 text-[13.5px] bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          
          <FilterSelect 
            value={categoryFilter} 
            onChange={(val) => {
              setCategoryFilter(val);
              setCurrentPage(1);
            }} 
            options={categoryOptions} 
          />
          
          <FilterSelect 
            value={statusFilter} 
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }} 
            options={statusOptions} 
          />

          <FilterSelect 
            value={stockFilter} 
            onChange={(val) => {
              setStockFilter(val);
              setCurrentPage(1);
            }} 
            options={stockOptions} 
          />

          <button className="flex items-center justify-center gap-2 h-11 px-4 border border-slate-100 bg-white rounded-xl hover:bg-slate-50 text-[13px] font-bold text-slate-600 shadow-sm transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>Filters</span>
          </button>

          {/* Clear Filters */}
          {(categoryFilter || statusFilter || stockFilter || searchQuery) && (
            <button 
              onClick={() => {
                setCategoryFilter('');
                setStatusFilter('');
                setStockFilter('');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="flex items-center gap-1.5 text-[13px] font-bold text-brand hover:text-brand-hover transition-colors px-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

      </div>

      {/* Table grid */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 pl-6 w-12">
                  <input 
                    type="checkbox"
                    checked={paginatedProducts.length > 0 && selectedProductIds.length === paginatedProducts.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-200 text-brand focus:ring-brand cursor-pointer"
                  />
                </th>
                <th 
                  onClick={() => handleSort('name')}
                  className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600 select-none"
                >
                  Product {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  SKU
                </th>
                <th className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th 
                  onClick={() => handleSort('price')}
                  className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600 select-none"
                >
                  Price {sortField === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th 
                  onClick={() => handleSort('stock')}
                  className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600 select-none"
                >
                  Stock {sortField === 'stock' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  onClick={() => handleSort('createdDate')}
                  className="py-4 px-4 text-[12px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600 select-none"
                >
                  Created At {sortField === 'createdDate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-4 pr-6 text-[12px] font-bold text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const isChecked = selectedProductIds.includes(p.id);
                  return (
                    <tr 
                      key={p.id} 
                      className={`group hover:bg-slate-50/50 transition-colors ${isChecked ? 'bg-slate-50/30' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-4.5 pl-6">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(p.id, e.target.checked)}
                          className="w-4 h-4 rounded border-slate-200 text-brand focus:ring-brand cursor-pointer"
                        />
                      </td>

                      {/* Product Preview box */}
                      <td className="py-4.5 px-4">
                        <div className="flex items-center gap-3.5">
                          {/* Image Box */}
                          <div className="w-[44px] h-[44px] rounded-xl flex items-center justify-center shrink-0 border border-slate-50 bg-slate-50">
                            {getProductSVG(p.iconName)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-brand transition-colors cursor-pointer" onClick={() => { setProductToView(p); setIsDetailsModalOpen(true); }}>
                              {p.name}
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5 leading-none">
                              {p.subtext}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-4.5 px-4 text-[13px] font-medium text-slate-500">
                        {p.sku}
                      </td>

                      {/* Category Badge */}
                      <td className="py-4.5 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getCategoryStyle(p.category)}`}>
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4.5 px-4 text-[13px] font-extrabold text-slate-800">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>

                      {/* Stock counts and low warnings */}
                      <td className="py-4.5 px-4">
                        {getStockColumn(p)}
                      </td>

                      {/* Status */}
                      <td className="py-4.5 px-4">
                        <Badge status={p.status} />
                      </td>

                      {/* Created At */}
                      <td className="py-4.5 px-4 text-[13px] font-medium text-slate-500">
                        <div className="flex flex-col">
                          <span>{p.createdDate}</span>
                          <span className="text-[11px] text-slate-400 mt-0.5 leading-none">{p.createdTime}</span>
                        </div>
                      </td>

                      {/* Action buttons (Edit in white box, Delete in red/pink outline) */}
                      <td className="py-4.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* Edit */}
                          <Link 
                            to={`/products/edit/${p.id}`}
                            className="w-8 h-8 rounded-lg border border-slate-100 bg-white flex items-center justify-center text-slate-500 hover:text-brand hover:border-brand/35 transition-colors"
                            aria-label="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                          {/* Delete */}
                          <button 
                            onClick={() => confirmDelete(p)}
                            className="w-8 h-8 rounded-lg border border-rose-100 bg-white flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            aria-label="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[14px] font-medium text-slate-400">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-50 bg-slate-50/20">
            <span className="text-[13px] font-medium text-slate-400">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems.toLocaleString('en-IN')} products
            </span>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-[13px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-brand-light text-brand border border-brand/10' 
                        : 'border border-transparent text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bulk actions floating bottom overlay */}
      {selectedProductIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3.5 rounded-xl shadow-xl flex items-center gap-5 border border-slate-800 animate-slide-up">
          <span className="text-[12px] font-bold text-slate-300">
            {selectedProductIds.length} Selected
          </span>
          <div className="w-[1px] h-5 bg-slate-800" />
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleBulkChangeStatus('Active')}
              className="text-[12px] font-extrabold hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Active
            </button>
            <button 
              onClick={() => handleBulkChangeStatus('Inactive')}
              className="text-[12px] font-extrabold hover:text-amber-400 transition-colors cursor-pointer"
            >
              Inactive
            </button>
            <button 
              onClick={() => handleExportCSV(true)}
              className="text-[12px] font-extrabold hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Export CSV
            </button>
            <button 
              onClick={handleBulkDelete}
              className="text-[12px] font-extrabold text-rose-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
        footerButtons={
          <>
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="h-10 px-4 border border-slate-100 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              className="h-10 px-4 bg-brand hover:bg-brand-hover text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
            >
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete product <span className="font-bold text-slate-800">"{productToDelete?.name}"</span>? This action is permanent and cannot be undone.</p>
      </Modal>

      {/* Product Details Modal (Visual fallback for eye icon view) */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Product Details"
        footerButtons={
          <button 
            onClick={() => setIsDetailsModalOpen(false)}
            className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        }
      >
        {productToView && (
          <div className="space-y-4 font-sans text-left">
            <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
              <div className="w-14 h-14 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0">
                {getProductSVG(productToView.iconName)}
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-800 leading-snug">{productToView.name}</h4>
                <span className="text-[12px] text-slate-400 block mt-0.5">SKU: {productToView.sku}</span>
                <span className="text-[11px] font-semibold text-slate-400 mt-1 block">Category: {productToView.category}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div>
                <span className="text-slate-400 font-medium block">Price</span>
                <span className="text-slate-800 font-extrabold text-[15px]">₹{productToView.price}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Stock Quantity</span>
                <span className="text-slate-800 font-extrabold text-[15px]">{productToView.stock} {productToView.unit}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Low Stock Threshold</span>
                <span className="text-slate-850 font-bold">{productToView.lowStockAlert}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Status</span>
                <Badge status={productToView.status} />
              </div>
            </div>

            <div className="border-t border-slate-50 pt-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
              <p className="text-[13px] text-slate-600 leading-relaxed mt-1">{productToView.shortDescription}</p>
            </div>
            
            {productToView.fullDescription && (
              <div className="border-t border-slate-50 pt-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Full Details</span>
                <p className="text-[13px] text-slate-600 leading-relaxed mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100/50">
                  {productToView.fullDescription}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}
