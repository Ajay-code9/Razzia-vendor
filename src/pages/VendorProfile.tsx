import { useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Edit3, Camera, CheckCircle, Phone, Mail, Calendar, User, MapPin,
  Shield, Key, Lock, Smartphone, LogOut, Eye, Store, Settings, Wallet,
  HelpCircle, ChevronRight, X, Upload, Download, Trash2, FileText,
  Clock, AlertCircle, ExternalLink, Star, Package, ShoppingBag, IndianRupee,
  Image as ImageIcon, Copy, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';

// ── Mock Profile Data ──────────────────────────────────────
interface VendorProfile {
  fullName: string;
  vendorId: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  alternateNumber: string;
  photo: string | null;
  businessName: string;
  gstNumber: string;
  panNumber: string;
  businessType: string;
  registrationDate: string;
  businessAddress: string;
  loginEmail: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
}

const defaultProfile: VendorProfile = {
  fullName: 'Ajay Kumar',
  vendorId: 'VEN-RAZ-1256',
  email: 'ajaystore@example.com',
  phone: '+91 98765 43210',
  dob: '15 May, 1995',
  gender: 'Male',
  alternateNumber: '+91 91234 56789',
  photo: null,
  businessName: 'Ajay Store',
  gstNumber: '07ABCDE1234F1Z5',
  panNumber: 'ABCDE1234F',
  businessType: 'Electronics',
  registrationDate: '10 Jan, 2023',
  businessAddress: '123, Market Street, Connaught Place,\nNew Delhi - 110001, India',
  loginEmail: 'ajaystore@example.com',
  twoFactorEnabled: true,
  lastLogin: '22 May, 2024 at 10:30 AM',
};

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  uploadDate: string;
  fileSize: string;
  preview: string | null;
}

const initialDocuments: Document[] = [
  { id: 'D1', name: 'GST Certificate', type: 'PDF', status: 'Verified', uploadDate: '10 Jan, 2023', fileSize: '1.2 MB', preview: null },
  { id: 'D2', name: 'PAN Card', type: 'Image', status: 'Verified', uploadDate: '10 Jan, 2023', fileSize: '450 KB', preview: null },
  { id: 'D3', name: 'Business License', type: 'PDF', status: 'Verified', uploadDate: '10 Jan, 2023', fileSize: '2.1 MB', preview: null },
  { id: 'D4', name: 'Cancelled Cheque', type: 'Image', status: 'Pending', uploadDate: '15 Mar, 2024', fileSize: '890 KB', preview: null },
  { id: 'D5', name: 'Identity Proof (Aadhaar)', type: 'Image', status: 'Verified', uploadDate: '10 Jan, 2023', fileSize: '520 KB', preview: null },
  { id: 'D6', name: 'Address Proof', type: 'PDF', status: 'Verified', uploadDate: '10 Jan, 2023', fileSize: '1.5 MB', preview: null },
];

const profileTabs = ['Personal Details', 'KYC Verification', 'Store Information', 'Documents'];

export default function VendorProfilePage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Personal Details');
  const [profile, setProfile] = useState<VendorProfile>(defaultProfile);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const photoRef = useRef<HTMLInputElement>(null);

  // Modals & drawers
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isKycDrawerOpen, setIsKycDrawerOpen] = useState(false);
  const [isChangePwOpen, setIsChangePwOpen] = useState(false);
  const [isLogoutAllOpen, setIsLogoutAllOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({ ...defaultProfile });
  const [editDirty, setEditDirty] = useState(false);

  // Password form
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
      showToast('Profile photo updated!', 'success');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    showToast('Profile photo removed.', 'info');
  };

  const handleEditChange = (key: keyof VendorProfile, val: string) => {
    setEditForm(prev => ({ ...prev, [key]: val }));
    setEditDirty(true);
  };

  const handleSaveProfile = () => {
    setProfile({ ...editForm });
    setIsEditOpen(false);
    setEditDirty(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handleCloseEdit = () => {
    if (editDirty && !window.confirm('You have unsaved changes. Discard?')) return;
    setIsEditOpen(false);
    setEditForm({ ...profile });
    setEditDirty(false);
  };

  const openEditModal = () => {
    setEditForm({ ...profile });
    setEditDirty(false);
    setIsEditOpen(true);
  };

  const handleChangePassword = () => {
    if (!currentPw) { showToast('Enter your current password.', 'error'); return; }
    if (newPw.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return; }
    if (newPw !== confirmPw) { showToast('Passwords do not match.', 'error'); return; }
    setIsChangePwOpen(false);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    showToast('Password changed successfully!', 'success');
  };

  const handleDocUpload = (docId: string) => {
    showToast(`Document upload simulated for ${documents.find(d => d.id === docId)?.name}.`, 'info');
  };

  const handleDocReplace = (docId: string) => {
    showToast(`Document replaced for ${documents.find(d => d.id === docId)?.name}.`, 'success');
  };

  const handleDocDownload = (docId: string) => {
    showToast(`Downloading ${documents.find(d => d.id === docId)?.name}...`, 'info');
  };

  const handleDocRemove = (docId: string) => {
    if (window.confirm('Remove this document?')) {
      setDocuments(prev => prev.filter(d => d.id !== docId));
      showToast('Document removed.', 'success');
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'Verified': return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">Verified</span>;
      case 'Pending': return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100">Pending</span>;
      case 'Rejected': return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-500 border border-rose-100">Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto font-sans text-slate-800 text-left">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-slate-800 tracking-tight leading-tight">Vendor Profile</h1>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 mt-1">
            <Link to="/" className="hover:text-brand transition-colors">Dashboard</Link>
            <span>&gt;</span><span className="text-slate-500">Vendor Profile</span>
          </div>
        </div>
        <button onClick={openEditModal} className="flex items-center gap-2 px-4 h-11 border border-slate-100 bg-white text-[13px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm cursor-pointer self-start sm:self-auto">
          <Edit3 className="w-4 h-4 text-slate-400" /><span>Edit Profile</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-100 overflow-x-auto">
        {profileTabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-5 py-3 text-[13px] font-bold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${activeTab === t ? 'border-brand text-brand' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Grid Main + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── Personal Details Tab ── */}
          {activeTab === 'Personal Details' && (
            <>
              {/* Personal Details Card */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left">
                <h3 className="text-[15px] font-bold text-slate-800 mb-5">Personal Details</h3>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Photo + Basic Info */}
                  <div className="flex flex-col items-center sm:items-start gap-3 min-w-[180px]">
                    <div className="relative group">
                      <div className="w-[100px] h-[100px] rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                        {photoPreview ? <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                          : <span className="text-[36px] font-black text-slate-400 select-none">{profile.fullName.charAt(0)}</span>}
                      </div>
                      <button onClick={() => photoRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 cursor-pointer transition-transform group-hover:scale-110">
                        <Camera className="w-4 h-4 text-slate-500" />
                      </button>
                      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="text-[16px] font-extrabold text-slate-800 block">{profile.fullName}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 ml-1">Verified</span>
                      <span className="text-[11.5px] text-slate-400 font-medium block mt-1">Vendor ID: {profile.vendorId}</span>
                      <div className="flex items-center gap-1.5 mt-2 text-[11.5px] text-slate-500 font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />{profile.email}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-[11.5px] text-slate-500 font-medium">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />{profile.phone}
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
                    {[
                      { label: 'Full Name', val: profile.fullName },
                      { label: 'Phone Number', val: profile.phone },
                      { label: 'Date of Birth', val: profile.dob },
                      { label: 'Email Address', val: profile.email },
                      { label: 'Gender', val: profile.gender },
                      { label: 'Alternate Number', val: profile.alternateNumber },
                    ].map((f, i) => (
                      <div key={i}>
                        <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">{f.label}</span>
                        <span className="text-[13px] font-bold text-slate-800 mt-0.5 block">{f.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Business Details Card */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left">
                <h3 className="text-[15px] font-bold text-slate-800 mb-5">Business Details</h3>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-14 h-14 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                    <Store className="w-7 h-7 text-purple-500" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
                    <div><span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Business Name</span><span className="text-[13px] font-bold text-slate-800 mt-0.5 block">{profile.businessName}</span></div>
                    <div><span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">GST Number</span><span className="text-[13px] font-bold text-slate-800 mt-0.5 inline">{profile.gstNumber}</span> {statusBadge('Verified')}</div>
                    <div><span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Business Type</span><span className="text-[13px] font-bold text-slate-800 mt-0.5 block">{profile.businessType}</span></div>
                    <div><span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">PAN Number</span><span className="text-[13px] font-bold text-slate-800 mt-0.5 inline">{profile.panNumber}</span> {statusBadge('Verified')}</div>
                    <div><span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Date of Registration</span><span className="text-[13px] font-bold text-slate-800 mt-0.5 block">{profile.registrationDate}</span></div>
                    <div><span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Business Address</span><span className="text-[13px] font-bold text-slate-800 mt-0.5 block whitespace-pre-line">{profile.businessAddress}</span></div>
                  </div>
                </div>
              </div>

              {/* Account Security Card */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left">
                <h3 className="text-[15px] font-bold text-slate-800 mb-5">Account Security</h3>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Shield className="w-7 h-7 text-emerald-500" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
                    <div><span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Login Email</span><span className="text-[13px] font-bold text-slate-800 mt-0.5 block">{profile.loginEmail}</span></div>
                    <div><span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Two Factor Authentication</span>
                      <span className={`text-[13px] font-bold mt-0.5 block ${profile.twoFactorEnabled ? 'text-emerald-500' : 'text-slate-500'}`}>{profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span></div>
                    <div><span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Password</span>
                      <span className="text-[13px] font-bold text-slate-800 mt-0.5 inline">••••••••••</span>
                      <button onClick={() => setIsChangePwOpen(true)} className="text-[11px] font-bold text-brand hover:underline cursor-pointer ml-2">Change Password</button></div>
                    <div><span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Last Login</span><span className="text-[13px] font-bold text-slate-800 mt-0.5 block">{profile.lastLogin}</span></div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── KYC Verification Tab ── */}
          {activeTab === 'KYC Verification' && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left space-y-6">
              <h3 className="text-[16px] font-bold text-slate-800">KYC Verification</h3>
              {/* Status Banner */}
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle className="w-6 h-6 text-emerald-500" /></div>
                <div>
                  <h4 className="text-[14px] font-extrabold text-emerald-700">KYC Verified</h4>
                  <p className="text-[12px] text-emerald-600 font-medium mt-0.5">Your identity has been successfully verified. All documents are approved.</p>
                </div>
              </div>
              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Verification Status', val: 'Verified', color: 'text-emerald-500' },
                  { label: 'Verified On', val: '18 May, 2024', color: 'text-slate-800' },
                  { label: 'Verified By', val: 'Razzia Admin', color: 'text-slate-800' },
                  { label: 'KYC Level', val: 'Level 3 (Full)', color: 'text-slate-800' },
                ].map((d, i) => (
                  <div key={i} className="bg-slate-50/50 border border-slate-100/50 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{d.label}</span>
                    <span className={`text-[13px] font-extrabold mt-0.5 block ${d.color}`}>{d.val}</span>
                  </div>
                ))}
              </div>
              {/* Verification Timeline */}
              <div>
                <h4 className="text-[13px] font-bold text-slate-700 mb-3">Verification Timeline</h4>
                <div className="space-y-4 relative pl-6 border-l-2 border-emerald-200">
                  {[
                    { title: 'KYC Submitted', date: '10 Jan, 2023', desc: 'Documents submitted for verification.', done: true },
                    { title: 'Under Review', date: '12 Jan, 2023', desc: 'Documents are being reviewed by the team.', done: true },
                    { title: 'KYC Verified', date: '18 Jan, 2023', desc: 'Your identity has been verified successfully.', done: true },
                  ].map((step, i) => (
                    <div key={i} className="relative">
                      <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 ${step.done ? 'bg-emerald-400 border-emerald-500' : 'bg-slate-200 border-slate-300'}`} />
                      <h5 className="text-[12.5px] font-bold text-slate-800">{step.title}</h5>
                      <p className="text-[11px] text-slate-400 font-medium">{step.date} — {step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setIsKycDrawerOpen(true)} className="h-10 px-5 bg-brand hover:bg-brand-hover text-white font-bold text-[12.5px] rounded-xl cursor-pointer shadow-sm shadow-brand/10">View Full KYC Details</button>
            </div>
          )}

          {/* ── Store Information Tab ── */}
          {activeTab === 'Store Information' && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left space-y-5">
              <h3 className="text-[16px] font-bold text-slate-800">Store Information</h3>
              <div className="flex items-center gap-4 bg-slate-50/50 border border-slate-100/50 p-4 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center text-white font-black text-[20px] shrink-0 shadow-sm">R</div>
                <div>
                  <span className="text-[15px] font-extrabold text-slate-800">{profile.businessName}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 ml-2">Active</span>
                  <span className="text-[11.5px] text-slate-400 font-medium block mt-0.5">Store ID: STORE-RAZ-1256</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Products', val: '156', icon: <Package className="w-4.5 h-4.5 text-blue-500" /> },
                  { label: 'Total Orders', val: '3,562', icon: <ShoppingBag className="w-4.5 h-4.5 text-purple-500" /> },
                  { label: 'Total Earnings', val: '₹45,680', icon: <IndianRupee className="w-4.5 h-4.5 text-emerald-500" /> },
                  { label: 'Rating', val: '⭐ 4.8', icon: <Star className="w-4.5 h-4.5 text-amber-500" /> },
                ].map((s, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.02, y: -2 }} className="bg-white border border-slate-100 p-4 rounded-xl text-center hover:shadow-widget transition-shadow cursor-default">
                    <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-2">{s.icon}</div>
                    <span className="text-[18px] font-black text-slate-800 block">{s.val}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Store Category', val: 'Electronics & Gadgets' },
                  { label: 'Store Since', val: 'January 2023' },
                  { label: 'Store URL', val: 'razzia.com/store/ajay-store' },
                  { label: 'Followers', val: '1,245' },
                ].map((f, i) => (
                  <div key={i}>
                    <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">{f.label}</span>
                    <span className="text-[13px] font-bold text-slate-800 mt-0.5 block">{f.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Documents Tab ── */}
          {activeTab === 'Documents' && (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-[16px] font-bold text-slate-800">Documents</h3>
                <button onClick={() => showToast('Upload new document flow coming soon.', 'info')} className="flex items-center gap-1.5 px-4 h-9 bg-brand hover:bg-brand-hover text-white font-bold text-[12px] rounded-xl cursor-pointer shadow-sm shadow-brand/10">
                  <Upload className="w-4 h-4" />Upload Document
                </button>
              </div>
              <div className="space-y-3">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-colors group">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {doc.type === 'PDF' ? <FileText className="w-5 h-5 text-brand" /> : <ImageIcon className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-slate-800">{doc.name}</span>
                        {statusBadge(doc.status)}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{doc.type} · {doc.fileSize} · Uploaded {doc.uploadDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => showToast(`Previewing ${doc.name}...`, 'info')} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer" title="Preview"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleDocDownload(doc.id)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer" title="Download"><Download className="w-4 h-4" /></button>
                      <button onClick={() => handleDocReplace(doc.id)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer" title="Replace"><RefreshCw className="w-4 h-4" /></button>
                      <button onClick={() => handleDocRemove(doc.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer" title="Remove"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-6">
          {/* KYC Verification Card */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[14px] font-bold text-slate-800">KYC Verification</h3>
              {statusBadge('Verified')}
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><CheckCircle className="w-5 h-5 text-emerald-500" /></div>
              <div><span className="text-[12.5px] font-bold text-slate-800 block">Your KYC is verified</span><span className="text-[11px] text-slate-400 font-medium">Your identity has been successfully verified.</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Verified On</span><span className="text-[12.5px] font-bold text-slate-800 mt-0.5 block">18 May, 2024</span></div>
              <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Verified By</span><span className="text-[12.5px] font-bold text-slate-800 mt-0.5 block">Razzia Admin</span></div>
            </div>
            <button onClick={() => setIsKycDrawerOpen(true)} className="w-full h-10 bg-brand hover:bg-brand-hover text-white font-bold text-[12.5px] rounded-xl cursor-pointer shadow-sm shadow-brand/10">View KYC Details</button>
          </div>

          {/* Store Summary */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-4">
            <h3 className="text-[14px] font-bold text-slate-800">Store Summary</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-black text-[14px] shrink-0 shadow-sm">R</div>
              <div>
                <span className="text-[13px] font-extrabold text-slate-800 inline">{profile.businessName}</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 ml-1.5">Active</span>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">Store ID: STORE-RAZ-1256</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Total Products', val: '156' },
                { label: 'Total Orders', val: '3,562' },
                { label: 'Total Earnings', val: '₹45,680' },
                { label: 'Rating', val: '⭐ 4.8' },
              ].map((s, i) => (
                <div key={i}><span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider leading-tight">{s.label}</span><span className="text-[14px] font-black text-slate-800 mt-0.5 block">{s.val}</span></div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-2">
            <h3 className="text-[14px] font-bold text-slate-800 mb-2">Quick Actions</h3>
            {[
              { icon: <Eye className="w-4.5 h-4.5 text-blue-500" />, label: 'View Store', action: () => showToast('Opening store preview...', 'info') },
              { icon: <Settings className="w-4.5 h-4.5 text-emerald-500" />, label: 'Store Settings', action: () => navigate('/settings') },
              { icon: <Wallet className="w-4.5 h-4.5 text-amber-500" />, label: 'Bank & Payout Details', action: () => navigate('/earnings') },
              { icon: <LogOut className="w-4.5 h-4.5 text-brand" />, label: 'Logout from All Devices', action: () => setIsLogoutAllOpen(true), isRed: true },
            ].map((a, i) => (
              <button key={i} onClick={a.action} className={`w-full flex items-center gap-3 py-2.5 hover:bg-slate-50 rounded-xl px-2 transition-colors cursor-pointer text-left ${a.isRed ? 'text-brand' : ''}`}>
                {a.icon}
                <span className={`text-[12.5px] font-bold flex-1 ${a.isRed ? 'text-brand' : 'text-slate-700'}`}>{a.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </button>
            ))}
          </div>

          {/* Need Help */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left space-y-3">
            <h3 className="text-[14px] font-bold text-slate-800">Need Help?</h3>
            <p className="text-[12px] text-slate-400 font-medium leading-relaxed">If you have any questions or need assistance, our support team is here to help.</p>
            <Link to="/help-support" className="inline-flex items-center gap-1.5 px-4 h-9 border border-brand/20 bg-[#FFF5F5] hover:bg-[#FFE5E5] text-brand font-bold text-[12px] rounded-xl transition-colors cursor-pointer">
              <HelpCircle className="w-4 h-4" />Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      <Modal isOpen={isEditOpen} onClose={handleCloseEdit} title="Edit Profile"
        footerButtons={<><button onClick={handleCloseEdit} className="h-10 px-4 border border-slate-150 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-xl cursor-pointer bg-white">Cancel</button>
          <button onClick={handleSaveProfile} className="h-10 px-5 bg-brand hover:bg-brand-hover text-white text-[13px] font-bold rounded-xl cursor-pointer">Save Changes</button></>}>
        <div className="space-y-4 text-left text-[13px]">
          {[
            { label: 'Full Name', key: 'fullName' as const, type: 'text' },
            { label: 'Email Address', key: 'email' as const, type: 'email' },
            { label: 'Phone Number', key: 'phone' as const, type: 'tel' },
            { label: 'Date of Birth', key: 'dob' as const, type: 'text' },
            { label: 'Gender', key: 'gender' as const, type: 'text' },
            { label: 'Alternate Number', key: 'alternateNumber' as const, type: 'tel' },
          ].map(f => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">{f.label}</label>
              <input type={f.type} value={editForm[f.key] as string} onChange={e => handleEditChange(f.key, e.target.value)}
                className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5 text-[13.5px] font-bold text-slate-800" />
            </div>
          ))}
          {editDirty && <p className="text-[10.5px] font-bold text-amber-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />You have unsaved changes.</p>}
        </div>
      </Modal>

      {/* ── Change Password Modal ── */}
      <Modal isOpen={isChangePwOpen} onClose={() => setIsChangePwOpen(false)} title="Change Password"
        footerButtons={<><button onClick={() => setIsChangePwOpen(false)} className="h-10 px-4 border border-slate-150 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-xl cursor-pointer bg-white">Cancel</button>
          <button onClick={handleChangePassword} className="h-10 px-5 bg-brand hover:bg-brand-hover text-white text-[13px] font-bold rounded-xl cursor-pointer">Update Password</button></>}>
        <div className="space-y-4 text-left text-[13px]">
          <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5" /></div>
          <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">New Password</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5" /></div>
          <div className="flex flex-col gap-1.5"><label className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="w-full h-11 px-3.5 border border-slate-100 rounded-xl focus:outline-none focus:border-brand/40 focus:ring-4 focus:ring-brand/5" /></div>
        </div>
      </Modal>

      {/* ── Logout All Devices Modal ── */}
      <Modal isOpen={isLogoutAllOpen} onClose={() => setIsLogoutAllOpen(false)} title="Logout from All Devices"
        footerButtons={<><button onClick={() => setIsLogoutAllOpen(false)} className="h-10 px-4 border border-slate-150 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-xl cursor-pointer bg-white">Cancel</button>
          <button onClick={() => { setIsLogoutAllOpen(false); showToast('Logged out from all devices.', 'success'); }} className="h-10 px-5 bg-brand hover:bg-brand-hover text-white text-[13px] font-bold rounded-xl cursor-pointer">Logout All</button></>}>
        <p className="text-[13px] text-slate-600 leading-relaxed">This will log you out from all devices except the current one. You will need to re-login on other devices. Are you sure you want to continue?</p>
      </Modal>

      {/* ── KYC Details Drawer ── */}
      <AnimatePresence>
        {isKycDrawerOpen && (
          <>
            <div onClick={() => setIsKycDrawerOpen(false)} className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-slate-100 shadow-2xl flex flex-col font-sans text-left">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 shrink-0">
                <span className="text-[15px] font-black text-slate-800">KYC Verification Details</span>
                <button onClick={() => setIsKycDrawerOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Status */}
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
                  <div><span className="text-[14px] font-extrabold text-emerald-700 block">KYC Verified</span>
                    <span className="text-[11.5px] text-emerald-600 font-medium">Verified on 18 May, 2024 by Razzia Admin</span></div>
                </div>
                {/* Verification Timeline */}
                <div>
                  <h4 className="text-[13px] font-bold text-slate-700 mb-4">Verification Timeline</h4>
                  <div className="space-y-5 relative pl-6 border-l-2 border-emerald-200">
                    {[
                      { title: 'Documents Submitted', date: '10 Jan, 2023, 02:30 PM', desc: 'All required documents uploaded for verification.', done: true },
                      { title: 'Under Review', date: '12 Jan, 2023, 10:00 AM', desc: 'Your documents are being reviewed by our verification team.', done: true },
                      { title: 'Additional Info Requested', date: '14 Jan, 2023, 11:45 AM', desc: 'Business address proof was requested for additional verification.', done: true },
                      { title: 'Info Submitted', date: '15 Jan, 2023, 03:15 PM', desc: 'Additional address proof document was submitted.', done: true },
                      { title: 'KYC Approved', date: '18 Jan, 2023, 09:00 AM', desc: 'Your KYC verification has been approved. All documents verified.', done: true },
                    ].map((step, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 ${step.done ? 'bg-emerald-400 border-emerald-500' : 'bg-slate-200 border-slate-300'}`} />
                        <h5 className="text-[12.5px] font-bold text-slate-800">{step.title}</h5>
                        <p className="text-[10.5px] text-slate-400 font-medium">{step.date}</p>
                        <p className="text-[11.5px] text-slate-505 font-medium mt-0.5">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Documents Summary */}
                <div>
                  <h4 className="text-[13px] font-bold text-slate-700 mb-3">Submitted Documents</h4>
                  <div className="space-y-2">
                    {['GST Certificate', 'PAN Card', 'Business License', 'Identity Proof (Aadhaar)', 'Address Proof'].map((d, i) => (
                      <div key={i} className="flex items-center gap-2 py-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-[12px] font-semibold text-slate-700">{d}</span>
                        {statusBadge('Verified')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-50 shrink-0">
                <button onClick={() => showToast('Downloading KYC report...', 'info')} className="flex items-center gap-1.5 h-9 px-3 border border-slate-100 rounded-lg text-[11.5px] font-bold text-slate-655 hover:bg-slate-50 cursor-pointer"><Download className="w-3.5 h-3.5 text-slate-400" />Download Report</button>
                <button onClick={() => { setIsKycDrawerOpen(false); showToast('KYC re-submission not required.', 'info'); }} className="flex items-center gap-1.5 h-9 px-3 border border-slate-100 rounded-lg text-[11.5px] font-bold text-slate-655 hover:bg-slate-50 cursor-pointer"><RefreshCw className="w-3.5 h-3.5 text-slate-400" />Resubmit</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
