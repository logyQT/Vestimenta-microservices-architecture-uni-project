import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle } from 'lucide-react';

export function Checkout() {
  const { items, cartTotal, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [processing, setProcessing] = useState(false);

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-dark-900 pt-32 flex flex-col items-center">
         <h2 className="text-2xl text-white font-serif mb-4">Your bag is empty</h2>
         <button onClick={() => navigate('/shop')} className="text-gold-500 hover:underline">Return to Shop</button>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      clearCart();
      setStep('success');
      setProcessing(false);
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
         <div className="max-w-md w-full bg-zinc-900 border border-gold-500/20 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-gold-500 mx-auto mb-6" />
            <h2 className="text-3xl font-serif text-white mb-4">Order Confirmed</h2>
            <p className="text-zinc-400 mb-8">Thank you for your purchase. You will receive an email confirmation shortly.</p>
            <button onClick={() => navigate('/shop')} className="bg-gold-500 text-black px-8 py-3 hover:bg-gold-400 transition-colors">Continue Shopping</button>
         </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen pt-32 pb-16 px-6 bg-dark-900">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div>
          <h2 className="text-2xl font-serif text-white mb-6">Order Summary</h2>
          <div className="bg-zinc-900/50 p-6 border border-zinc-800 space-y-6">
            {items.map(item => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-white font-serif">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-zinc-600 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                  </div>
                  <p className="text-zinc-500 text-sm">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                  <p className="text-gold-500">${item.price}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-zinc-800 pt-4 mt-4">
              <div className="flex justify-between text-zinc-400 mb-2"><span>Subtotal</span><span>${cartTotal}</span></div>
              <div className="flex justify-between text-zinc-400 mb-2"><span>Shipping</span><span>Free</span></div>
              <div className="flex justify-between text-white text-xl font-serif mt-4 pt-4 border-t border-zinc-800">
                 <span>Total</span><span>${cartTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          <h2 className="text-2xl font-serif text-white mb-6">Shipping Details</h2>
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" required className="bg-black/30 border border-zinc-800 p-3 text-white focus:border-gold-500 outline-none" />
              <input type="text" placeholder="Last Name" required className="bg-black/30 border border-zinc-800 p-3 text-white focus:border-gold-500 outline-none" />
            </div>
            <input type="text" placeholder="Address" required className="w-full bg-black/30 border border-zinc-800 p-3 text-white focus:border-gold-500 outline-none" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="City" required className="bg-black/30 border border-zinc-800 p-3 text-white focus:border-gold-500 outline-none" />
              <input type="text" placeholder="Postal Code" required className="bg-black/30 border border-zinc-800 p-3 text-white focus:border-gold-500 outline-none" />
            </div>
            
            <div className="pt-6 border-t border-zinc-800">
               <h3 className="text-white mb-4">Payment</h3>
               <div className="bg-zinc-900 p-4 border border-zinc-800 text-zinc-500 text-sm mb-4">
                  <p>Secure Credit Card Payment (Simulated)</p>
               </div>
               <button 
                 type="submit" 
                 disabled={processing}
                 className="w-full bg-gold-500 text-black py-4 font-medium hover:bg-gold-400 transition-colors uppercase tracking-widest"
               >
                 {processing ? "Processing Order..." : `Pay $${cartTotal}`}
               </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}