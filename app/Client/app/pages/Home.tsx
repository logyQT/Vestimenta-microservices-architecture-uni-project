import { ArrowRight, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../components/shared/ImageWithFallback';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-dark-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Backgrounds */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-zinc-900/50 via-[#0a0a0a] to-black"></div>
          <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-block">
                <span className="text-gold-500 tracking-[0.3em] text-xs border border-gold-500/30 px-4 py-2">WINTER COLLECTION 2025</span>
              </div>
              <h1 className="text-5xl md:text-7xl text-white font-serif leading-tight">
                Elegance <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-400">Redefined</span>
              </h1>
              <p className="text-zinc-400 text-lg max-w-md font-light">
                Discover timeless sophistication with our curated collection of premium fashion. Where luxury meets style.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('/shop')} className="group relative bg-gold-500 text-black px-8 py-4 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2 font-medium">
                    Explore Collection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>
            </div>

            <div className="relative hidden md:block animate-fade-in">
               <div className="relative aspect-[3/4] overflow-hidden border border-gold-500/20">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1613909671501-f9678ffc1d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-serif text-white mb-4">Curated <span className="text-gold-500">Categories</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'For Her', img: 'https://images.unsplash.com/photo-1638717366457-dbcaf6b1afbc?q=80&w=1080', link: '/shop?category=For%20Her' },
              { title: 'For Him', img: 'https://images.unsplash.com/photo-1603122101829-e56305b0a5f7?q=80&w=1080', link: '/shop?category=For%20Him' },
              { title: 'Accessories', img: 'https://images.unsplash.com/photo-1725368844213-c167fe556f98?q=80&w=1080', link: '/shop?category=Accessories' }
            ].map((cat, i) => (
              <div key={i} onClick={() => navigate(cat.link)} className="group relative aspect-[3/4] cursor-pointer overflow-hidden border border-zinc-800">
                 <ImageWithFallback src={cat.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-3xl font-serif text-white italic border-b border-transparent group-hover:border-gold-500 transition-all">{cat.title}</h3>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900/30"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="border border-gold-500/20 p-12 md:p-16 relative bg-zinc-900/80 backdrop-blur">
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold-500"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold-500"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold-500"></div>

            <h2 className="text-4xl font-serif text-white mb-6">Join Our Inner Circle</h2>
            <p className="text-zinc-400 mb-8 max-w-lg mx-auto">Subscribe to receive updates, access to exclusive deals, and more.</p>
            
            <form className="flex max-w-md mx-auto gap-2" onSubmit={(e) => e.preventDefault()}>
               <input type="email" placeholder="Your email address" className="flex-1 bg-black/50 border border-zinc-700 px-4 py-3 text-white focus:border-gold-500 outline-none" />
               <button className="bg-gold-500 text-black px-6 py-3 hover:bg-gold-400 transition-colors"><Send className="w-5 h-5" /></button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}