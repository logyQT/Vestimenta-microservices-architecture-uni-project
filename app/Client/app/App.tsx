import { HashRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/layout/CartDrawer";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Pages
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { Checkout } from "./pages/Checkout";
import { About, Contact } from "./pages/StaticPages";
import { TermsOfService, PrivacyPolicy } from "./pages/Legal";
import { AdminDashboard } from "./pages/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <ScrollToTop />
          <div className="min-h-screen bg-dark-900 text-zinc-100 font-sans selection:bg-gold-500 selection:text-black">
            <Navbar />
            <CartDrawer />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/legal/terms" element={<TermsOfService />} />
                <Route path="/legal/privacy" element={<PrivacyPolicy />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
}
