import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      navigate("/profile");
    }
  };

  return (
    <section className="min-h-screen pt-24 pb-16 px-6 bg-dark-900 flex items-center justify-center relative">
      <div className="max-w-md w-full relative z-10">
        <div className="bg-zinc-900/80 border border-zinc-800 p-8 md:p-12 relative backdrop-blur-md">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold-500"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold-500"></div>

          <div className="text-center mb-8">
            <h1 className="text-3xl text-white font-serif mb-2">Join Vestimenta</h1>
            <p className="text-zinc-500 text-sm">Create an account to unlock exclusive collections.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-zinc-400 text-xs tracking-widest uppercase mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-black/50 border border-zinc-800 px-10 py-3 text-white focus:border-gold-500 outline-none"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-xs tracking-widest uppercase mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-black/50 border border-zinc-800 px-10 py-3 text-white focus:border-gold-500 outline-none"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-xs tracking-widest uppercase mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-black/50 border border-zinc-800 px-10 py-3 text-white focus:border-gold-500 outline-none"
                  required 
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button 
              type="submit" 
              className="w-full bg-gold-500 text-black py-3 font-medium hover:bg-gold-400 transition-colors uppercase tracking-widest text-sm"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center">
             <p className="text-zinc-500 text-sm">Already a member? <button onClick={() => navigate('/login')} className="text-gold-500 hover:underline ml-1">Sign In</button></p>
          </div>
        </div>
      </div>
    </section>
  );
}