import { useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Package, User } from "lucide-react";
import { User as UserType } from "../../types";

interface ProfileDropdownProps {
  isLoggedIn: boolean;
  user: UserType | null;
  onLogout: () => void;
  loading: boolean;
}

export function ProfileDropdown({ isLoggedIn, user, onLogout, loading }: ProfileDropdownProps) {
  const navigate = useNavigate();

  if (isLoggedIn) {
    return (
      <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-gold-500/20 shadow-xl shadow-black/50 z-50 animate-fade-in">
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold-500"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold-500"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold-500"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold-500"></div>

        {/* User Info */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-black" />
            </div>
            <div className="overflow-hidden">
              <div className="text-white text-sm truncate font-serif">{loading ? "Loading..." : user?.username}</div>
              <div className="text-zinc-500 text-xs truncate">{loading ? "Loading..." : user?.email}</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <button onClick={() => navigate("/profile")} className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-zinc-800 transition-colors group">
            <LayoutDashboard className="w-4 h-4 text-gold-500 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Dashboard</span>
          </button>
          <button onClick={() => navigate("/profile")} className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-zinc-800 transition-colors group">
            <Package className="w-4 h-4 text-gold-500 group-hover:scale-110 transition-transform" />
            <span className="text-sm">My Orders</span>
          </button>
        </div>

        {/* Logout */}
        <div className="p-2 border-t border-zinc-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors group">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Log Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-gold-500/20 shadow-xl shadow-black/50 z-50">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold-500"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold-500"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold-500"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold-500"></div>

      <div className="p-2">
        <button onClick={() => navigate("/login")} className="w-full px-4 py-2 text-white hover:bg-zinc-800 transition-colors text-sm text-left">
          Sign In
        </button>
        <button onClick={() => navigate("/register")} className="w-full px-4 py-2 text-gold-500 hover:bg-zinc-800 transition-colors text-sm text-left">
          Create Account
        </button>
      </div>
    </div>
  );
}
