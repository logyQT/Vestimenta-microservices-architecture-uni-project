import { Mail, Phone, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-gold-500 text-xl font-serif tracking-[0.2em]">VESTIMENTA</h3>
            <div>
              <h4 className="text-white mb-3 font-serif">Our Mission</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                To redefine luxury fashion by curating timeless pieces that empower individuals to express their unique style with confidence and elegance.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-white mb-6 font-serif">Customer Care</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-zinc-500 hover:text-gold-500 transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/profile" className="text-zinc-500 hover:text-gold-500 transition-colors text-sm">My Account</Link></li>
              <li><Link to="/about" className="text-zinc-500 hover:text-gold-500 transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-6 font-serif">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/legal/privacy" className="text-zinc-500 hover:text-gold-500 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/legal/terms" className="text-zinc-500 hover:text-gold-500 transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link to="/legal/terms" className="text-zinc-500 hover:text-gold-500 transition-colors text-sm">Returns Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-6 font-serif">Connect</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:info@vestimenta.com" className="flex items-center gap-3 text-zinc-500 hover:text-gold-500 transition-colors text-sm group">
                  <Mail className="w-4 h-4 text-gold-500" />
                  <span>info@vestimenta.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="flex items-center gap-3 text-zinc-500 hover:text-gold-500 transition-colors text-sm group">
                  <Phone className="w-4 h-4 text-gold-500" />
                  <span>+1 (234) 567-890</span>
                </a>
              </li>
            </ul>
            <div className="mt-8 flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-gold-500 hover:border-gold-500/30 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">© 2025 Vestimenta. All rights reserved.</p>
          <div className="flex gap-6 text-zinc-600 text-sm">
            <span>Visa</span><span>Mastercard</span><span>Amex</span><span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
