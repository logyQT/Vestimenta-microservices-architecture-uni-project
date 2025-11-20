import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order } from '../types';
import { Package, User as UserIcon, CreditCard, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await api.orders.list();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  if (!user) {
     navigate('/login');
     return null;
  }

  return (
    <section className="min-h-screen pt-32 pb-16 px-6 bg-dark-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-b border-zinc-800 pb-8">
          <div>
            <h1 className="text-3xl text-white font-serif mb-2">Welcome, {user.name}</h1>
            <p className="text-zinc-500">Manage your account and view orders.</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="text-red-500 border border-zinc-800 px-6 py-2 hover:bg-red-500/10 transition-colors text-sm">
            Sign Out
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Tabs */}
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeTab === 'orders' ? 'bg-gold-500 text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
            >
              <Package className="w-4 h-4" /> My Orders
            </button>
            <button 
              onClick={() => setActiveTab('details')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeTab === 'details' ? 'bg-gold-500 text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
            >
              <UserIcon className="w-4 h-4" /> Personal Details
            </button>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
             {activeTab === 'orders' ? (
               <div className="space-y-4">
                 {orders.map(order => (
                   <div key={order.id} className="bg-zinc-900/50 border border-zinc-800 p-6">
                     <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 border-b border-zinc-800 pb-4 gap-4">
                       <div>
                         <p className="text-white font-serif">{order.id}</p>
                         <p className="text-zinc-500 text-xs">{order.date}</p>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className={`text-xs px-3 py-1 uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-500'}`}>
                            {order.status}
                          </span>
                          <span className="text-gold-500">${order.total}</span>
                       </div>
                     </div>
                     <div className="space-y-2">
                        {order.items.map((item, i) => (
                           <div key={i} className="flex items-center gap-4">
                             <img src={item.image} alt={item.name} className="w-12 h-16 object-cover" />
                             <div>
                               <p className="text-white text-sm">{item.name}</p>
                               <p className="text-zinc-500 text-xs">Size: {item.selectedSize}</p>
                             </div>
                           </div>
                        ))}
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
                <div className="bg-zinc-900/50 border border-zinc-800 p-8 max-w-lg">
                   <h3 className="text-white font-serif text-xl mb-6">Profile Information</h3>
                   <div className="space-y-4">
                      <div>
                         <label className="text-zinc-500 text-xs uppercase">Name</label>
                         <p className="text-white border-b border-zinc-700 py-2">{user.name}</p>
                      </div>
                      <div>
                         <label className="text-zinc-500 text-xs uppercase">Email</label>
                         <p className="text-white border-b border-zinc-700 py-2">{user.email}</p>
                      </div>
                      <div>
                         <label className="text-zinc-500 text-xs uppercase">Member ID</label>
                         <p className="text-white border-b border-zinc-700 py-2">{user.id}</p>
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