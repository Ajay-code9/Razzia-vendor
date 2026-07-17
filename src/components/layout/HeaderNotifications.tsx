import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, Settings, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadNotifications, saveNotifications } from '../../utils/notificationsData';
import type { Notification } from '../../utils/notificationsData';

// Map icon names to Lucide components
import * as Icons from 'lucide-react';

export default function HeaderNotifications() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(loadNotifications());
    
    // Refresh interval to simulate real-time updates (optional)
    const interval = setInterval(() => {
      setNotifications(loadNotifications());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;
  // Show up to 5 recent notifications in the dropdown
  const recentNotifications = notifications.filter(n => !n.isArchived).slice(0, 5);

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map(n => n.id === id ? { ...n, isArchived: true } : n);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleNotificationClick = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 border rounded-full transition-colors cursor-pointer ${
          isOpen ? 'bg-slate-100 border-slate-200' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
        }`}
      >
        <Bell className="w-[18px] h-[18px] text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white leading-none border border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-[360px] md:w-[400px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 bg-white/95 backdrop-blur">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-brand/10 text-brand text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleMarkAllAsRead}
                  className="p-1.5 text-slate-400 hover:text-brand hover:bg-red-50 rounded-lg transition-colors group"
                  title="Mark all as read"
                >
                  <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={() => { setIsOpen(false); navigate('/notifications'); }}
                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors group"
                  title="Settings"
                >
                  <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[380px] overflow-y-auto overscroll-contain">
              {recentNotifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <Bell className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-[13px] font-medium text-slate-500">No recent notifications</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {recentNotifications.map((notif) => {
                    const IconComponent = (Icons as any)[notif.icon.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')] || Icons.Bell;
                    return (
                      <div 
                        key={notif.id}
                        onClick={handleNotificationClick}
                        className={`group relative flex gap-4 p-4 border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          !notif.isRead ? 'bg-red-50/20' : ''
                        }`}
                      >
                        {!notif.isRead && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand" />
                        )}
                        
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.iconBg}`}>
                          <IconComponent className={`w-5 h-5 ${notif.iconColor}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-[13px] truncate ${!notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap shrink-0">
                              {notif.time}
                            </span>
                          </div>
                          <p className={`text-[12.5px] line-clamp-2 leading-relaxed ${!notif.isRead ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                            {notif.description}
                          </p>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute right-4 top-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                          {!notif.isRead && (
                            <button 
                              onClick={(e) => handleMarkAsRead(notif.id, e)}
                              className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-brand rounded shadow-sm hover:border-brand/30 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button 
                            onClick={(e) => handleRemove(notif.id, e)}
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-red-500 rounded shadow-sm hover:border-red-200 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-100">
              <button 
                onClick={() => { setIsOpen(false); navigate('/notifications'); }}
                className="w-full h-10 flex items-center justify-center gap-2 text-[13px] font-bold text-brand bg-white border border-slate-200 rounded-xl hover:border-brand hover:bg-red-50/50 hover:shadow-sm transition-all"
              >
                <Eye className="w-4 h-4" />
                View All Notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
