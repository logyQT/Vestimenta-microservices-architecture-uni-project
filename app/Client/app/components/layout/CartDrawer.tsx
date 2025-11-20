import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../shared/ImageWithFallback';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, removeFromCart, cartTotal, addToCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-dark-900 border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-serif text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold-500" />
            Your Bag
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>Your shopping bag is empty</p>
              <button 
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                className="text-gold-500 hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                <div className="w-20 h-24 bg-zinc-800 flex-shrink-0 overflow-hidden">
                  <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-white font-serif text-sm">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-zinc-500 text-xs mt-1">Size: {item.selectedSize}</p>
                    <p className="text-gold-500 text-sm mt-1">${item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">Qty: {item.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
            <div className="flex justify-between mb-4 text-white">
              <span>Subtotal</span>
              <span className="font-serif text-gold-500">${cartTotal}</span>
            </div>
            <p className="text-xs text-zinc-500 mb-6">Shipping and taxes calculated at checkout.</p>
            <button 
              onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
              className="w-full bg-gold-500 text-black py-4 font-medium hover:bg-gold-400 transition-colors uppercase tracking-widest text-sm"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}