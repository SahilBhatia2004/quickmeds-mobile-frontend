
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/hooks/use-cart";
import { AuthProvider } from "@/hooks/use-auth";

// Pages
import UserTypeSelection from "./pages/UserTypeSelection";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import SearchPage from "./pages/SearchPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import TrackOrderPage from "./pages/TrackOrderPage";
import AddressPage from "./pages/AddressPage";
import PhoneLogin from "./pages/auth/PhoneLogin";
import UpiPayment from "./pages/UpiPayment";
import LiveOrderTracking from "./pages/LiveOrderTracking";

// Admin and Vendor Pages
import AdminLogin from "./pages/AdminLogin";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorInventory from "./pages/vendor/VendorInventory";
import VendorOrders from "./pages/vendor/VendorOrders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Entry point - User type selection */}
              <Route path="/" element={<UserTypeSelection />} />
              <Route path="/home" element={<Index />} />
              
              {/* User authentication */}
              <Route path="/user/login" element={<PhoneLogin isVendor={false} />} />
              <Route path="/vendor/login" element={<PhoneLogin isVendor={true} />} />
              
              {/* Main app routes */}
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/track-order" element={<TrackOrderPage />} />
              <Route path="/track-order/:orderId" element={<LiveOrderTracking />} />
              <Route path="/address" element={<AddressPage />} />
              <Route path="/address/new" element={<AddressPage />} />
              
              {/* Payment routes */}
              <Route path="/payment-methods/upi" element={<UpiPayment />} />
              <Route path="/payment-methods" element={<Navigate to="/payment-methods/upi" replace />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              
              {/* Vendor Routes */}
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/inventory" element={<VendorInventory />} />
              <Route path="/vendor/active-orders" element={<VendorOrders />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
