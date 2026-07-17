import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/Dashboard';
import OrdersPage from '../pages/Orders';
import OrderDetailsPage from '../pages/OrderDetails';
import ProductsPage from '../pages/Products';
import AddProductPage from '../pages/AddProduct';
import LiveStreamingPage from '../pages/LiveStreaming';
import AnalyticsPage from '../pages/Analytics';
import CustomersPage from '../pages/Customers';
import EarningsPage from '../pages/Earnings';
import MarketingPage from '../pages/Marketing';
import SettingsPage from '../pages/Settings';
import HelpSupportPage from '../pages/HelpSupport';
import NotificationsPage from '../pages/Notifications';
import VendorProfilePage from '../pages/VendorProfile';

import LiveSetupPage from '../pages/LiveSetup';
import LiveSessionPage from '../pages/LiveSession';
import LoginPage from '../pages/Login';
import SignupPage from '../pages/Signup';
import ForgotPasswordPage from '../pages/ForgotPassword';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Main layout wrapper routes */}
        <Route 
          path="/" 
          element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <MainLayout>
              <OrdersPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/orders/:id" 
          element={
            <MainLayout>
              <OrderDetailsPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/products" 
          element={
            <MainLayout>
              <ProductsPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/products/add" 
          element={
            <MainLayout>
              <AddProductPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/products/edit/:id" 
          element={
            <MainLayout>
              <AddProductPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/live" 
          element={<Navigate to="/live/setup" replace />} 
        />
        <Route 
          path="/live-streaming" 
          element={<Navigate to="/live/setup" replace />} 
        />
        <Route 
          path="/live/setup" 
          element={
            <MainLayout>
              <LiveSetupPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/live/session" 
          element={
            <MainLayout>
              <LiveSessionPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <MainLayout>
              <AnalyticsPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/customers" 
          element={
            <MainLayout>
              <CustomersPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/earnings" 
          element={
            <MainLayout>
              <EarningsPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/marketing" 
          element={
            <MainLayout>
              <MarketingPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/help-support" 
          element={
            <MainLayout>
              <HelpSupportPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <MainLayout>
              <NotificationsPage />
            </MainLayout>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <MainLayout>
              <VendorProfilePage />
            </MainLayout>
          } 
        />

        {/* Fallback redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
