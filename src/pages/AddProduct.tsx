import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Send, 
  Upload, 
  X, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  Link2, 
  Image as ImageIcon,
  CheckCircle,
  FileCheck,
  ChevronDown,
  Plus
} from 'lucide-react';
import { loadProducts, saveProducts } from '../utils/productsData';
import type { Product } from '../utils/productsData';
import { useToast } from '../context/ToastContext';

export default function AddProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditMode = Boolean(id);

  // Load all products once for validation
  const allProducts = useMemo(() => loadProducts(), []);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('');
  const [lowStockAlert, setLowStockAlert] = useState('5');
  const [unit, setUnit] = useState('Pcs');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [status, setStatus] = useState<Product['status']>('Draft');
  const [images, setImages] = useState<string[]>([]);

  // Validation Error State
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load product if editing
  useEffect(() => {
    if (isEditMode) {
      const prod = allProducts.find(p => p.id === id);
      if (prod) {
        setName(prod.name);
        setSku(prod.sku);
        setCategory(prod.category);
        setSubCategory(prod.subCategory || '');
        setBrand(prod.brand || '');
        setTags(prod.tags || '');
        setPrice(prod.price.toString());
        setDiscountPrice(prod.discountPrice ? prod.discountPrice.toString() : '');
        setCostPrice(prod.costPrice ? prod.costPrice.toString() : '');
        setStock(prod.stock.toString());
        setLowStockAlert(prod.lowStockAlert.toString());
        setUnit(prod.unit);
        setShortDescription(prod.shortDescription);
        setFullDescription(prod.fullDescription);
        setStatus(prod.status);
        setImages(prod.images || []);
      } else {
        showToast('Product not found.', 'error');
        navigate('/products');
      }
    }
  }, [id, isEditMode, allProducts, navigate, showToast]);

  // Categories & Sub Categories lists
  const categoryOptions = ['Electronics', 'Fashion', 'Footwear', 'Grocery', 'Beauty'];
  const subCategoryOptions: Record<string, string[]> = {
    Electronics: ['Audio', 'Wearables', 'Mobiles', 'Accessories'],
    Fashion: ['Bags', 'Eyewear', 'Clothing', 'Accessories'],
    Footwear: ['Sports', 'Casual', 'Formal'],
    Grocery: ['Staples', 'Snacks', 'Beverages'],
    Beauty: ['Skincare', 'Haircare', 'Fragrance']
  };

  // Image Upload handler (Base64 local previews)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const filesArray = Array.from(files);

    if (images.length + filesArray.length > 5) {
      showToast('Maximum of 5 images allowed.', 'warning');
      return;
    }

    filesArray.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`Image ${file.name} is too large (max 5MB).`, 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setImages(prev => [...prev, evt.target?.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    if (images.length + filesArray.length > 5) {
      showToast('Maximum of 5 images allowed.', 'warning');
      return;
    }

    filesArray.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`Image ${file.name} is too large (max 5MB).`, 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setImages(prev => [...prev, evt.target?.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Live Summary indicators
  const summaryName = name || 'Not added';
  const summaryCategory = category || 'Not selected';
  const summaryPrice = price ? `₹${parseFloat(price).toLocaleString('en-IN')}` : '₹0';
  const summaryStock = stock || '0';

  // Rich Text Editor toolbar helper
  const handleEditorAction = (tag: string) => {
    showToast(`Applied ${tag} format.`, 'info');
    // Mock format wrapping inside the textarea value
    setFullDescription(prev => prev + ` [${tag}]`);
  };

  // Form Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Product name is required.';
    
    if (!sku.trim()) {
      newErrors.sku = 'SKU identifier is required.';
    } else {
      // Check SKU uniqueness
      const skuMatch = allProducts.find(p => p.sku.toLowerCase() === sku.trim().toLowerCase() && p.id !== id);
      if (skuMatch) {
        newErrors.sku = 'This SKU code is already taken by another product.';
      }
    }

    if (!category) newErrors.category = 'Please select a product category.';
    
    if (!price) {
      newErrors.price = 'Selling price is required.';
    } else if (parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a positive number.';
    }

    if (discountPrice && parseFloat(discountPrice) >= parseFloat(price)) {
      newErrors.discountPrice = 'Discount price must be less than the selling price.';
    }

    if (!stock) {
      newErrors.stock = 'Stock quantity is required.';
    } else if (parseInt(stock) < 0) {
      newErrors.stock = 'Stock quantity cannot be negative.';
    }

    if (!lowStockAlert) {
      newErrors.lowStockAlert = 'Low stock threshold is required.';
    } else if (parseInt(lowStockAlert) < 0) {
      newErrors.lowStockAlert = 'Threshold cannot be negative.';
    }

    if (!shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required.';
    } else if (shortDescription.length > 200) {
      newErrors.shortDescription = 'Short description exceeds 200 characters.';
    }

    if (fullDescription.length > 2000) {
      newErrors.fullDescription = 'Full description exceeds 2000 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSave = (publishState: boolean) => {
    if (!validateForm()) {
      showToast('Please correct validation errors on the form.', 'error');
      return;
    }

    const finalStatus: Product['status'] = publishState ? (status === 'Draft' ? 'Active' : status) : 'Draft';
    
    const formattedProduct: Product = {
      id: isEditMode && id ? id : `PROD-${Math.floor(Math.random() * 9000) + 1000}`,
      name: name.trim(),
      subtext: brand ? `${brand} product` : 'Quality Product',
      sku: sku.trim().toUpperCase(),
      category,
      subCategory,
      brand,
      tags,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      costPrice: costPrice ? parseFloat(costPrice) : undefined,
      stock: parseInt(stock),
      lowStockAlert: parseInt(lowStockAlert),
      unit,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      status: finalStatus,
      createdDate: isEditMode && id ? (allProducts.find(p => p.id === id)?.createdDate || '20 May, 2024') : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdTime: isEditMode && id ? (allProducts.find(p => p.id === id)?.createdTime || '10:30 AM') : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      images,
      iconName: category === 'Footwear' ? 'activity' : category === 'Fashion' ? 'bag' : 'headphones'
    };

    let updatedProducts = [...allProducts];
    if (isEditMode) {
      updatedProducts = updatedProducts.map(p => p.id === id ? formattedProduct : p);
    } else {
      updatedProducts.push(formattedProduct);
    }

    saveProducts(updatedProducts);
    showToast(
      isEditMode 
        ? `Successfully updated product: "${name}"`
        : `Successfully created and ${publishState ? 'published' : 'saved'} product: "${name}"`,
      'success'
    );
    navigate('/products');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 text-left">
      
      {/* Title Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">
            {isEditMode ? 'Edit Product' : 'Add Product'}
          </h1>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
            <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <Link to="/products" className="hover:text-brand transition-colors">Products</Link>
            <span>&gt;</span>
            <span className="text-slate-500">{isEditMode ? 'Edit Product' : 'Add Product'}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Back */}
          <Link 
            to="/products"
            className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4.5 h-4.5 text-slate-400" />
            <span>Back to Products</span>
          </Link>
          
          {/* Save Draft */}
          <button 
            onClick={() => handleSave(false)}
            className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white hover:bg-slate-50 text-[13px] font-bold text-slate-700 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-slate-400" />
            <span>Save as Draft</span>
          </button>

          {/* Publish */}
          <button 
            onClick={() => handleSave(true)}
            className="flex items-center gap-2 px-5 h-11 bg-brand hover:bg-brand-hover text-white font-extrabold text-[13px] rounded-xl transition-all duration-300 shadow-md shadow-brand/10 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isEditMode ? 'Save Changes' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {/* Grid container */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Form Details */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Product Information Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight border-b border-slate-50 pb-2">
              Product Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Product Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">
                  Product Name <span className="text-brand">*</span>
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder="Enter product name"
                  className={`h-11 px-4 text-[13.5px] border rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all ${
                    errors.name ? 'border-rose-300 bg-rose-50/10' : 'border-slate-100'
                  }`}
                />
                {errors.name && <span className="text-[11px] font-bold text-rose-500">{errors.name}</span>}
              </div>

              {/* SKU */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">
                  SKU (Stock Keeping Unit) <span className="text-brand">*</span>
                </label>
                <input 
                  type="text" 
                  value={sku}
                  onChange={(e) => {
                    setSku(e.target.value);
                    if (errors.sku) setErrors(prev => ({ ...prev, sku: '' }));
                  }}
                  placeholder="Enter SKU"
                  className={`h-11 px-4 text-[13.5px] border rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all ${
                    errors.sku ? 'border-rose-300 bg-rose-50/10' : 'border-slate-100'
                  }`}
                />
                <span className="text-[11px] text-slate-400">Unique product identifier</span>
                {errors.sku && <span className="text-[11px] font-bold text-rose-500">{errors.sku}</span>}
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">
                  Category <span className="text-brand">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubCategory('');
                    if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                  }}
                  className={`h-11 px-4 text-[13.5px] border rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all cursor-pointer ${
                    errors.category ? 'border-rose-300' : 'border-slate-100'
                  }`}
                >
                  <option value="">Select category</option>
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="text-[11px] font-bold text-rose-500">{errors.category}</span>}
              </div>

              {/* Sub Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">Sub Category</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!category}
                  className="h-11 px-4 text-[13.5px] border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all disabled:opacity-50 cursor-pointer"
                >
                  <option value="">Select sub category</option>
                  {category && subCategoryOptions[category]?.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">Brand</label>
                <input 
                  type="text" 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Enter brand name"
                  className="h-11 px-4 text-[13.5px] border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">Tags</label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags separated by comma"
                  className="h-11 px-4 text-[13.5px] border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all"
                />
                <span className="text-[11px] text-slate-400">Example: new, sale, trending</span>
              </div>

            </div>
          </div>

          {/* Pricing & Inventory Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight border-b border-slate-50 pb-2">
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">
                  Price (₹) <span className="text-brand">*</span>
                </label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors(prev => ({ ...prev, price: '' }));
                  }}
                  placeholder="Enter price"
                  className={`h-11 px-4 text-[13.5px] border rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all ${
                    errors.price ? 'border-rose-300 bg-rose-50/10' : 'border-slate-100'
                  }`}
                />
                {errors.price && <span className="text-[11px] font-bold text-rose-500">{errors.price}</span>}
              </div>

              {/* Discount Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">Discounted Price (₹)</label>
                <input 
                  type="number" 
                  value={discountPrice}
                  onChange={(e) => {
                    setDiscountPrice(e.target.value);
                    if (errors.discountPrice) setErrors(prev => ({ ...prev, discountPrice: '' }));
                  }}
                  placeholder="Enter discounted price"
                  className={`h-11 px-4 text-[13.5px] border rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all ${
                    errors.discountPrice ? 'border-rose-300' : 'border-slate-100'
                  }`}
                />
                <span className="text-[11px] text-slate-400">Leave empty if no discount</span>
                {errors.discountPrice && <span className="text-[11px] font-bold text-rose-500">{errors.discountPrice}</span>}
              </div>

              {/* Cost Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">Cost Price (₹)</label>
                <input 
                  type="number" 
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="Enter cost price"
                  className="h-11 px-4 text-[13.5px] border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all"
                />
                <span className="text-[11px] text-slate-400">For internal use only</span>
              </div>

              {/* Stock Quantity */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">
                  Stock Quantity <span className="text-brand">*</span>
                </label>
                <input 
                  type="number" 
                  value={stock}
                  onChange={(e) => {
                    setStock(e.target.value);
                    if (errors.stock) setErrors(prev => ({ ...prev, stock: '' }));
                  }}
                  placeholder="Enter stock quantity"
                  className={`h-11 px-4 text-[13.5px] border rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all ${
                    errors.stock ? 'border-rose-300 bg-rose-50/10' : 'border-slate-100'
                  }`}
                />
                {errors.stock && <span className="text-[11px] font-bold text-rose-500">{errors.stock}</span>}
              </div>

              {/* Low Stock Alert */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">
                  Low Stock Alert <span className="text-brand">*</span>
                </label>
                <input 
                  type="number" 
                  value={lowStockAlert}
                  onChange={(e) => {
                    setLowStockAlert(e.target.value);
                    if (errors.lowStockAlert) setErrors(prev => ({ ...prev, lowStockAlert: '' }));
                  }}
                  placeholder="Enter threshold limit"
                  className={`h-11 px-4 text-[13.5px] border rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all ${
                    errors.lowStockAlert ? 'border-rose-300 bg-rose-50/10' : 'border-slate-100'
                  }`}
                />
                <span className="text-[11px] text-slate-400">You'll be notified when stock is low</span>
                {errors.lowStockAlert && <span className="text-[11px] font-bold text-rose-500">{errors.lowStockAlert}</span>}
              </div>

              {/* Unit */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-600">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-11 px-4 text-[13.5px] border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Pcs">Pcs</option>
                  <option value="Box">Box</option>
                  <option value="Pairs">Pairs</option>
                  <option value="Kg">Kg</option>
                </select>
              </div>

            </div>
          </div>

          {/* Description Section Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight border-b border-slate-50 pb-2">
              Product Description
            </h3>

            {/* Short Description */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-slate-600">
                  Short Description <span className="text-brand">*</span>
                </label>
                <span className="text-[11px] text-slate-400">{shortDescription.length}/200</span>
              </div>
              <textarea 
                value={shortDescription}
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setShortDescription(e.target.value);
                    if (errors.shortDescription) setErrors(prev => ({ ...prev, shortDescription: '' }));
                  }
                }}
                placeholder="Enter short description"
                rows={3}
                className={`p-4 text-[13.5px] border rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 focus:bg-white transition-all resize-none ${
                  errors.shortDescription ? 'border-rose-300 bg-rose-50/10' : 'border-slate-100'
                }`}
              />
              {errors.shortDescription && <span className="text-[11px] font-bold text-rose-500">{errors.shortDescription}</span>}
            </div>

            {/* Full Description (Rich Text Editor fallback) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold text-slate-600">Full Description</label>
                <span className="text-[11px] text-slate-400">{fullDescription.length}/2000</span>
              </div>
              
              {/* Rich text Mock Toolbar */}
              <div className="border border-slate-100 rounded-xl overflow-hidden focus-within:border-brand/40 focus-within:ring-4 focus-within:ring-brand/5 transition-all bg-white">
                <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-slate-50 bg-slate-50/50">
                  
                  {/* Mock Paragraph selector */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white border border-slate-100 rounded px-2 py-1 cursor-pointer select-none">
                    <span>Paragraph</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  
                  <div className="w-[1px] h-4 bg-slate-200" />
                  
                  {/* Format buttons */}
                  <button type="button" onClick={() => handleEditorAction('Bold')} className="p-1 hover:bg-slate-100 rounded text-slate-500" title="Bold">
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleEditorAction('Italic')} className="p-1 hover:bg-slate-100 rounded text-slate-500" title="Italic">
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleEditorAction('Underline')} className="p-1 hover:bg-slate-100 rounded text-slate-500" title="Underline">
                    <Underline className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-[1px] h-4 bg-slate-200" />

                  {/* Lists */}
                  <button type="button" onClick={() => handleEditorAction('Unordered List')} className="p-1 hover:bg-slate-100 rounded text-slate-500" title="Bullet List">
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleEditorAction('Ordered List')} className="p-1 hover:bg-slate-100 rounded text-slate-500" title="Numbered List">
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-[1px] h-4 bg-slate-200" />

                  {/* Alignment & inserts */}
                  <button type="button" onClick={() => handleEditorAction('Align Left')} className="p-1 hover:bg-slate-100 rounded text-slate-500" title="Align">
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleEditorAction('Link')} className="p-1 hover:bg-slate-100 rounded text-slate-500" title="Insert Link">
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleEditorAction('Image')} className="p-1 hover:bg-slate-100 rounded text-slate-500" title="Insert Image">
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>

                </div>

                <textarea 
                  value={fullDescription}
                  onChange={(e) => {
                    if (e.target.value.length <= 2000) {
                      setFullDescription(e.target.value);
                      if (errors.fullDescription) setErrors(prev => ({ ...prev, fullDescription: '' }));
                    }
                  }}
                  placeholder="Enter full product description..."
                  rows={8}
                  className="w-full p-4 text-[13.5px] border-0 focus:outline-none focus:ring-0 bg-slate-50/20 resize-y min-h-[160px]"
                />
              </div>
              {errors.fullDescription && <span className="text-[11px] font-bold text-rose-500">{errors.fullDescription}</span>}
            </div>

          </div>

        </div>

        {/* Right Column: Upload, Preview summary, and Status selection */}
        <div className="w-full lg:w-[360px] xl:w-[380px] flex flex-col gap-6 shrink-0">
          
          {/* Images Upload Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
              Product Images
            </h3>

            {/* Drag drop area */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-brand/40 rounded-xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50/20 transition-all flex flex-col items-center justify-center min-h-[160px]"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                multiple 
                accept="image/*" 
                className="hidden" 
              />
              <Upload className="w-8 h-8 text-slate-400 mb-2.5 animate-pulse" />
              <h4 className="text-[13px] font-bold text-slate-700">Upload Product Images</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                Drag & drop images here or click to browse. JPG, PNG, WEBP up to 5MB
              </p>
            </div>

            {/* Thumbnail row */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square border border-slate-100 rounded-lg overflow-hidden bg-slate-50 group">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-rose-500/80 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border border-dashed border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors bg-slate-50/50 cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Product Live Summary Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
              Product Summary
            </h3>

            {/* Preview panel layout */}
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30 flex flex-col gap-3">
              {/* Box Image preview */}
              <div className="w-full aspect-[16/10] border border-slate-100/50 bg-slate-100/30 rounded-lg flex items-center justify-center overflow-hidden">
                {images.length > 0 ? (
                  <img src={images[0]} alt="main" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-350 select-none">
                    <ImageIcon className="w-10 h-10 stroke-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1.5">No Image Preview</span>
                  </div>
                )}
              </div>

              {/* Binds labels */}
              <div className="space-y-1.5 text-[13px] text-left">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="font-extrabold text-slate-800 truncate flex-1">{summaryName}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    status === 'Inactive' ? 'bg-slate-50 text-slate-500 border border-slate-150' :
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {status}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 leading-none">
                  <span>{summaryCategory}</span>
                  <span className="font-bold text-slate-700">{summaryStock} {unit} left</span>
                </div>
                <div className="h-px bg-slate-100 my-1" />
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400">Retail Price</span>
                  <span className="text-brand font-black text-[16px]">{summaryPrice}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Product Status Selection Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
              Product Status
            </h3>

            {/* Radio options container */}
            <div className="space-y-3.5 text-left">
              {/* Draft */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="status"
                  value="Draft"
                  checked={status === 'Draft'}
                  onChange={() => setStatus('Draft')}
                  className="w-4 h-4 mt-0.5 text-brand focus:ring-brand border-slate-200 cursor-pointer accent-brand"
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-850 group-hover:text-brand transition-colors">Draft</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Save as draft and publish later</span>
                </div>
              </label>

              {/* Active */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="status"
                  value="Active"
                  checked={status === 'Active'}
                  onChange={() => setStatus('Active')}
                  className="w-4 h-4 mt-0.5 text-brand focus:ring-brand border-slate-200 cursor-pointer accent-brand"
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-850 group-hover:text-brand transition-colors">Active</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Product will be live on your store</span>
                </div>
              </label>

              {/* Inactive */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="status"
                  value="Inactive"
                  checked={status === 'Inactive'}
                  onChange={() => setStatus('Inactive')}
                  className="w-4 h-4 mt-0.5 text-brand focus:ring-brand border-slate-200 cursor-pointer accent-brand"
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-850 group-hover:text-brand transition-colors">Inactive</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Product will be hidden from store</span>
                </div>
              </label>

            </div>
          </div>

        </div>

      </div>

      {/* Footer copyright */}
      <footer className="text-center text-[12px] text-slate-400 pt-8 pb-4">
        © 2024 Razzia. All rights reserved.
      </footer>

    </div>
  );
}
