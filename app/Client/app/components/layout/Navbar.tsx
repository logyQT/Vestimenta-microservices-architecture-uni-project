import { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { ProfileDropdown } from "./ProfileDropdown";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter() {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    setShowProfileDropdown(true);
  }

  function handleLeave() {
    timeout.current = setTimeout(() => setShowProfileDropdown(false), 100);
  }

  const onLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isMobileMenuOpen ? "bg-dark-900/95 backdrop-blur-md shadow-lg border-b border-white/5" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative group z-50">
            <span className="text-2xl font-serif tracking-[0.2em] text-gold-500">VESTIMENTA</span>
            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-gold-500 to-transparent group-hover:w-full transition-all duration-500"></div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-zinc-400 hover:text-gold-500 transition-colors duration-300 uppercase text-xs tracking-widest">Shop</Link>
            <Link to="/shop?category=For%20Her" className="text-zinc-400 hover:text-gold-500 transition-colors duration-300 uppercase text-xs tracking-widest">For Her</Link>
            <Link to="/shop?category=For%20Him" className="text-zinc-400 hover:text-gold-500 transition-colors duration-300 uppercase text-xs tracking-widest">For Him</Link>
            <Link to="/shop?category=Accessories" className="text-zinc-400 hover:text-gold-500 transition-colors duration-300 uppercase text-xs tracking-widest">Accessories</Link>

            <div className="h-4 w-[1px] bg-zinc-700"></div>

            {/* Icons */}
            <div className="flex items-center gap-6">
              {/* Profile */}
              <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
                <button 
                  className="text-zinc-400 hover:text-gold-500 transition-colors duration-300 flex items-center" 
                  onClick={() => !isAuthenticated && navigate("/login")}
                >
                  <User className="w-5 h-5" />
                </button>
                {showProfileDropdown && (
                  <ProfileDropdown isLoggedIn={isAuthenticated} user={user} onLogout={onLogout} loading={loading} />
                )}
              </div>

              {/* Cart */}
              <button 
                className="text-zinc-400 hover:text-gold-500 transition-colors duration-300 relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white z-50" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-dark-900 z-40 transition-transform duration-500 md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
           <div className="flex flex-col items-center justify-center h-full gap-8 text-center p-6">
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-white hover:text-gold-500">Shop All</Link>
              <Link to="/shop?category=For%20Her" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-white hover:text-gold-500">For Her</Link>
              <Link to="/shop?category=For%20Him" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-white hover:text-gold-500">For Him</Link>
              <div className="h-[1px] w-20 bg-zinc-800 my-4"></div>
              <button onClick={() => { setIsMobileMenuOpen(false); isAuthenticated ? navigate("/profile") : navigate("/login"); }} className="text-zinc-400 hover:text-white flex items-center gap-2">
                <User className="w-5 h-5" /> {isAuthenticated ? "My Account" : "Sign In"}
              </button>
           </div>
        </div>
      </div>
    </nav>
  );
}