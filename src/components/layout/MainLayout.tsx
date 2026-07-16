import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import PageAnimate from '../common/PageAnimate';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#F8F9FA]">
      {/* Navigation Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Right Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <PageAnimate>
            {children}
          </PageAnimate>
        </main>
      </div>
    </div>
  );
}
