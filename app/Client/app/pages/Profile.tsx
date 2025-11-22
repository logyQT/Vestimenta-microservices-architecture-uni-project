import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Order } from "../types";
import { Package, User as UserIcon, LogOut, SquarePen, Check, Lock, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/utils";

export function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [isVerifying, setIsVerifying] = useState(false);
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [pendingUpdate, setPendingUpdate] = useState<{ field: "username" | "email"; value: string } | null>(null);
  const [editing, setEditing] = useState<{ field: "username" | "email" | null; value: string }>({
    field: null,
    value: "",
  });

  const navigate = useNavigate();

  // Local state for optimistic UI updates or temporary inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Sync local state with user context when it loads
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await api.orders.list();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  // 1. Triggered by the Save Icon
  const modifyProfileDetails = (field: "username" | "email", newValue: string) => {
    // If no changes, just cancel edit
    if (field === "username" && newValue === user?.username) {
      cancelEditing();
      return;
    }
    if (field === "email" && newValue === user?.email) {
      cancelEditing();
      return;
    }

    // Open Modal
    setPendingUpdate({ field, value: newValue });
    setConfirmationPassword("");
    setUpdateError("");
    setIsVerifying(true);
  };

  // 2. Triggered by the Modal Confirm Button
  const finalizeUpdate = async () => {
    if (!confirmationPassword) {
      setUpdateError("Password is required.");
      return;
    }
    if (!pendingUpdate || !user) return;

    try {
      // Call API to update with password
      await updateUser({ [pendingUpdate.field]: pendingUpdate.value, password: confirmationPassword } as Partial<typeof user>);

      // Update local context and component state on success
      if (pendingUpdate.field === "username") setUsername(pendingUpdate.value);
      if (pendingUpdate.field === "email") setEmail(pendingUpdate.value);

      // Reset all states
      closeVerification();
      setEditing({ field: null, value: "" });
    } catch (error) {
      console.error("Failed to update profile", error);
      setUpdateError("Verification failed. Please check your password.");
    }
  };

  const closeVerification = () => {
    setIsVerifying(false);
    setPendingUpdate(null);
    setConfirmationPassword("");
    // We also cancel editing mode when modal is closed without saving to return to clean state
    setEditing({ field: null, value: "" });
  };

  const startEditing = (field: "username" | "email", currentValue: string) => {
    setEditing({ field, value: currentValue });
  };

  const cancelEditing = () => {
    // Prevent cancelling if we are in the middle of verification (modal is open)
    if (isVerifying) return;
    setEditing({ field: null, value: "" });
  };

  if (!user) {
    // A minimal loading state or redirect is handled by AuthContext/App usually,
    // but strictly following logic here:
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-gold-500">Loading profile...</div>;
  }

  return (
    <section className="min-h-screen pt-32 pb-16 px-6 bg-dark-900">
      {/* Password Verification Modal */}
      {isVerifying && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={closeVerification} className="absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white">Security Check</h3>
                <p className="text-zinc-500 text-sm">Verify your identity</p>
              </div>
            </div>

            <p className="text-zinc-300 mb-6 text-sm leading-relaxed">
              To update your <span className="text-white font-medium">{pendingUpdate?.field}</span>, please confirm your password below.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-2 block">Password</label>
                <input autoFocus type="password" value={confirmationPassword} onChange={(e) => setConfirmationPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && finalizeUpdate()} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white focus:border-gold-500 outline-none transition-colors font-sans rounded-sm" placeholder="Enter your password" />
              </div>

              {updateError && (
                <div className="flex items-center gap-3 text-red-400 text-sm bg-red-900/10 p-3 rounded border border-red-900/30">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {updateError}
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button onClick={closeVerification} className="flex-1 px-4 py-3 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors font-medium text-sm uppercase tracking-wide rounded-sm">
                  Cancel
                </button>
                <button onClick={finalizeUpdate} className="flex-1 px-4 py-3 bg-gold-500 text-black hover:bg-gold-600 transition-colors font-medium font-serif uppercase tracking-wide rounded-sm">
                  Confirm Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-b border-zinc-800 pb-8">
          <div>
            <h1 className="text-3xl text-white font-serif mb-2">Welcome, {user.username}</h1>
            <p className="text-zinc-500">Manage your account and view orders.</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-red-500 border border-zinc-800 px-6 py-2 hover:bg-red-500/10 transition-colors text-sm flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Tabs */}
          <div className="space-y-2">
            <button onClick={() => setActiveTab("orders")} className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeTab === "orders" ? "bg-gold-500 text-black font-medium" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}>
              <Package className="w-4 h-4" /> My Orders
            </button>
            <button onClick={() => setActiveTab("details")} className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeTab === "details" ? "bg-gold-500 text-black font-medium" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}>
              <UserIcon className="w-4 h-4" /> Personal Details
            </button>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === "orders" ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm hover:border-zinc-700 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 border-b border-zinc-800 pb-4 gap-4">
                      <div>
                        <p className="text-white font-serif font-medium">{order.id}</p>
                        <p className="text-zinc-500 text-xs mt-1">{formatDate(order.date)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs px-3 py-1 uppercase tracking-wider font-medium rounded-full ${order.status === "Delivered" ? "bg-green-900/30 text-green-400 border border-green-900/50" : "bg-yellow-900/30 text-yellow-500 border border-yellow-900/50"}`}>{order.status}</span>
                        <span className="text-gold-500 font-serif text-lg">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-zinc-950/50 p-2 rounded">
                          <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded-sm" />
                          <div>
                            <p className="text-white text-sm font-medium">{item.name}</p>
                            <p className="text-zinc-500 text-xs mt-0.5">
                              Size: <span className="text-zinc-300">{item.selectedSize}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 max-w-lg rounded-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gold-500"></div>
                <h3 className="text-white font-serif text-2xl mb-8">Profile Information</h3>

                <div className="space-y-6">
                  {/* Member Since - Read Only */}
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">Member since</p>
                    <p className="text-white font-serif text-lg">{formatDate(user.created_at)}</p>
                  </div>

                  {/* Name - Editable */}
                  <div>
                    <label className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1 block">Name</label>
                    <div className="relative border-b border-zinc-700 py-2 h-10 flex items-center group">
                      {editing.field === "username" ? (
                        <>
                          <input
                            autoFocus
                            type="text"
                            value={editing.value}
                            onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                            onBlur={cancelEditing}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") modifyProfileDetails("username", editing.value);
                            }}
                            className="bg-transparent text-white w-full outline-none font-serif text-lg placeholder-zinc-600"
                          />
                          <button onMouseDown={(e) => e.preventDefault()} onClick={() => modifyProfileDetails("username", editing.value)} className="absolute right-0 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-400 transition-colors p-1" title="Save">
                            <Check className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-white font-serif text-lg w-full truncate pr-8">{username}</span>
                          <button onClick={() => startEditing("username", username)} className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-gold-500 transition-all cursor-pointer p-1 opacity-50 group-hover:opacity-100" title="Edit Name">
                            <SquarePen className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Email - Editable */}
                  <div>
                    <label className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1 block">Email</label>
                    <div className="relative border-b border-zinc-700 py-2 h-10 flex items-center group">
                      {editing.field === "email" ? (
                        <>
                          <input
                            autoFocus
                            type="email"
                            value={editing.value}
                            onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                            onBlur={cancelEditing}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") modifyProfileDetails("email", editing.value);
                            }}
                            className="bg-transparent text-white w-full outline-none font-serif text-lg placeholder-zinc-600"
                          />
                          <button onMouseDown={(e) => e.preventDefault()} onClick={() => modifyProfileDetails("email", editing.value)} className="absolute right-0 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-400 transition-colors p-1" title="Save">
                            <Check className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-white font-serif text-lg w-full truncate pr-8">{email}</span>
                          <button onClick={() => startEditing("email", email)} className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-gold-500 transition-all cursor-pointer p-1 opacity-50 group-hover:opacity-100" title="Edit Email">
                            <SquarePen className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Member ID - Read Only */}
                  <div>
                    <label className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1 block">Member ID</label>
                    <p className="text-zinc-400 border-b border-zinc-800 py-2 font-mono text-sm">{user.id}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
