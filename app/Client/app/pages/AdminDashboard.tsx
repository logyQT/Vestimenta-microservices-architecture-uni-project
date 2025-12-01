import { useState, useEffect } from "react";
import { api } from "../services/api";
import { LogEntry } from "../types";
import { Product, User } from "../types";
import { LayoutDashboard, Package, Users, Activity, Edit, Trash2, Plus, Save, X, RefreshCw } from "lucide-react";
import { ImageWithFallback } from "../components/shared/ImageWithFallback";
import { formatDate } from "../utils/utils";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// --- Components ---

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all border-b-2 ${active ? "border-gold-500 text-gold-500 bg-zinc-900" : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50"}`}>
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-sm ${color}`}>{children}</span>;

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"logs" | "products" | "users">("logs");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        navigate("/", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="text-zinc-500">Checking authorization...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16 pb-12">
      <div className="bg-zinc-900/50 border-b border-zinc-800 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif text-white py-6 flex items-center gap-3">
              <LayoutDashboard className="text-gold-500" /> Admin Console
            </h1>
            <div className="flex">
              <TabButton active={activeTab === "logs"} onClick={() => setActiveTab("logs")} icon={Activity} label="System Logs" />
              <TabButton active={activeTab === "products"} onClick={() => setActiveTab("products")} icon={Package} label="Products" />
              <TabButton active={activeTab === "users"} onClick={() => setActiveTab("users")} icon={Users} label="Users" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "logs" && <LogsView />}
        {activeTab === "products" && <ProductsManager />}
        {activeTab === "users" && <UsersView />}
      </div>
    </div>
  );
}

// --- Sub-Views ---

function LogsView() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterLevel, setFilterLevel] = useState("");
  const [filterSource, setFilterSource] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    const data = await api.admin.getLogs({
      level: filterLevel || undefined,
      source: filterSource || undefined,
      limit: 100,
    });
    // Sort by timestamp desc
    setLogs(data.sort((a, b) => b.timestamp - a.timestamp));
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 p-4 flex gap-4 items-end rounded-sm">
        <div className="flex-1">
          <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Log Level</label>
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="w-full bg-black border border-zinc-700 text-white p-2 outline-none focus:border-gold-500 text-sm">
            <option value="">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Source</label>
          <input type="text" value={filterSource} onChange={(e) => setFilterSource(e.target.value)} placeholder="e.g. API_GATEWAY" className="w-full bg-black border border-zinc-700 text-white p-2 outline-none focus:border-gold-500 text-sm" />
        </div>
        <button onClick={fetchLogs} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 border border-zinc-700 flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="border border-zinc-800 bg-zinc-900/30 rounded-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 font-medium">Time</th>
              <th className="p-4 font-medium">Level</th>
              <th className="p-4 font-medium">Source</th>
              <th className="p-4 font-medium">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {logs.map((log, idx) => (
              <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                <td className="p-4 text-zinc-500 font-mono text-xs whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-4">
                  <Badge color={log.level === "error" ? "bg-red-500/10 text-red-500 border border-red-500/20" : log.level === "warn" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"}>{log.level}</Badge>
                </td>
                <td className="p-4 text-zinc-300 font-medium">{log.source}</td>
                <td className="p-4 text-zinc-400 truncate max-w-lg" title={log.message}>
                  {log.message}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-600">
                  No logs found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-zinc-500">Loading users...</div>;

  return (
    <div className="border border-zinc-800 bg-zinc-900/30 rounded-sm overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-wider">
          <tr>
            <th className="p-4 font-medium">ID</th>
            <th className="p-4 font-medium">Username</th>
            <th className="p-4 font-medium">Email</th>
            <th className="p-4 font-medium">Role</th>
            <th className="p-4 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
              <td className="p-4 text-zinc-500 font-mono text-xs">{user.id}</td>
              <td className="p-4 text-white font-medium">{user.username}</td>
              <td className="p-4 text-zinc-400">{user.email}</td>
              <td className="p-4">
                <Badge color={user.role === "admin" ? "bg-gold-500/10 text-gold-500 border border-gold-500/20" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}>{user.role}</Badge>
              </td>
              <td className="p-4 text-zinc-500 text-xs">{formatDate(user.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorMode, setEditorMode] = useState<"list" | "edit" | "create">("list");
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});

  const fetchProducts = async () => {
    setLoading(true);
    const data = await api.products.getAll();
    setProducts(data.sort((a, b) => a.id - b.id));
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditorMode("edit");
  };

  const handleCreate = () => {
    setEditingProduct({
      name: "",
      description: "",
      price: 0,
      category: "For Her",
      image: "",
      images: [],
      sizes: ["S", "M", "L"],
      isNew: true,
    });
    setEditorMode("create");
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await api.products.delete(id);
      fetchProducts();
    }
  };

  const handleSave = async () => {
    if (!editingProduct.name || !editingProduct.price) return;

    try {
      if (editorMode === "create") {
        await api.products.create(editingProduct as Omit<Product, "id">);
      } else if (editorMode === "edit" && editingProduct.id) {
        await api.products.update(editingProduct.id, editingProduct);
      }
      setEditorMode("list");
      fetchProducts();
    } catch (e) {
      alert("Failed to save product");
    }
  };

  if (editorMode !== "list") {
    return (
      <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
        {/* Editor Form */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm space-y-6">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-serif text-white">{editorMode === "create" ? "Add New Product" : "Edit Product"}</h2>
            <button onClick={() => setEditorMode("list")} className="text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Product Name</label>
              <input type="text" value={editingProduct.name || ""} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full bg-black border border-zinc-700 text-white p-3 outline-none focus:border-gold-500 transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price ($)</label>
                <input type="number" value={editingProduct.price || 0} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} className="w-full bg-black border border-zinc-700 text-white p-3 outline-none focus:border-gold-500 transition-colors" />
              </div>
              <div>
                <label className="label">Category</label>
                <select value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full bg-black border border-zinc-700 text-white p-3 outline-none focus:border-gold-500 transition-colors">
                  <option>For Her</option>
                  <option>For Him</option>
                  <option>Accessories</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea rows={4} value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full bg-black border border-zinc-700 text-white p-3 outline-none focus:border-gold-500 transition-colors" />
            </div>

            <div>
              <label className="label">Main Image URL</label>
              <input type="text" value={editingProduct.image || ""} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} className="w-full bg-black border border-zinc-700 text-white p-3 outline-none focus:border-gold-500 transition-colors" />
            </div>

            <div>
              <label className="label">Sizes (comma separated)</label>
              <input type="text" value={editingProduct.sizes?.join(", ") || ""} onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value.split(",").map((s) => s.trim()) })} className="w-full bg-black border border-zinc-700 text-white p-3 outline-none focus:border-gold-500 transition-colors" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="isNew" checked={editingProduct.isNew || false} onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })} className="w-4 h-4 accent-gold-500" />
              <label htmlFor="isNew" className="text-zinc-400 text-sm">
                Mark as "New Collection"
              </label>
            </div>

            <button onClick={handleSave} className="w-full bg-gold-500 text-black py-3 mt-4 font-medium hover:bg-gold-400 transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <h3 className="text-zinc-500 text-sm uppercase tracking-widest">Live Preview</h3>
          <div className="bg-black border border-zinc-800 p-8 flex justify-center items-start min-h-[600px]">
            <div className="w-full max-w-sm bg-dark-900 group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 mb-4 border border-zinc-800">
                <ImageWithFallback src={editingProduct.image || ""} alt="Preview" className="w-full h-full object-cover" fallbackText="Preview" />
                {editingProduct.isNew && <div className="absolute top-3 right-3 bg-gold-500 text-black text-[10px] font-bold px-2 py-1 tracking-wider">NEW</div>}
              </div>
              <div>
                <div className="text-gold-500/70 text-xs tracking-widest mb-1 uppercase">{editingProduct.category || "Category"}</div>
                <h3 className="text-white font-serif text-lg">{editingProduct.name || "Product Name"}</h3>
                <p className="text-zinc-400 mt-1">${editingProduct.price || "0.00"}</p>
                <div className="flex gap-2 mt-4">
                  {editingProduct.sizes?.map((size) => (
                    <span key={size} className="border border-zinc-700 text-zinc-500 text-xs w-8 h-8 flex items-center justify-center">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={handleCreate} className="bg-gold-500 text-black px-4 py-2 font-medium hover:bg-gold-400 transition-colors flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="border border-zinc-800 bg-zinc-900/30 rounded-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 w-20">Img</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-zinc-500">
                  <div className="flex justify-center items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Loading products...
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="p-3">
                    <div className="w-10 h-12 bg-zinc-800 overflow-hidden">
                      <ImageWithFallback src={product.image} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4 text-white font-medium">
                    {product.name}
                    <div className="text-zinc-500 text-xs font-mono mt-0.5">ID: {product.id}</div>
                  </td>
                  <td className="p-4 text-zinc-400">{product.category}</td>
                  <td className="p-4 text-gold-500">${product.price}</td>
                  <td className="p-4">{product.isNew && <Badge color="bg-gold-500/10 text-gold-500 border border-gold-500/20">New</Badge>}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEdit(product)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-full transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
