import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function StaticPage({ title, children }: { title: string, children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen pt-32 pb-16 px-6 bg-dark-900">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-zinc-500 hover:text-white mb-8 flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Back</button>
        <h1 className="text-4xl font-serif text-white mb-8 text-center">{title}</h1>
        <div className="text-zinc-400 space-y-6 leading-relaxed text-justify">
           {children}
        </div>
      </div>
    </section>
  );
}

export const About = () => (
  <StaticPage title="Our Story">
    <p>Vestimenta was born from a desire to bring timeless elegance back to the forefront of fashion. Founded in 2025, our atelier in Milan draws inspiration from classical architecture and modern minimalism.</p>
    <p>We believe that true luxury lies in the details. From the sourcing of the finest silks and wools to the precise stitching of every hem, our commitment to craftsmanship is unwavering.</p>
    <p>Our collections are designed not for a season, but for a lifetime. We reject the ephemeral nature of fast fashion in favor of pieces that age gracefully, becoming cherished parts of your personal narrative.</p>
  </StaticPage>
);

export const Contact = () => (
  <StaticPage title="Contact Us">
    <p className="text-center mb-8">We are at your disposal for any inquiries regarding our collections or services.</p>
    <div className="grid md:grid-cols-2 gap-8 mt-12">
       <div className="bg-zinc-900 p-8 text-center border border-zinc-800">
          <h3 className="text-gold-500 font-serif text-xl mb-2">Concierge</h3>
          <p>+1 (234) 567-890</p>
          <p>Mon-Fri, 9am - 6pm EST</p>
       </div>
       <div className="bg-zinc-900 p-8 text-center border border-zinc-800">
          <h3 className="text-gold-500 font-serif text-xl mb-2">Email</h3>
          <p>info@vestimenta.com</p>
          <p>press@vestimenta.com</p>
       </div>
    </div>
  </StaticPage>
);