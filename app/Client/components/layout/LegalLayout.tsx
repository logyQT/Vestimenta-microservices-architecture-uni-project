import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Section {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated?: string;
  sections: Section[];
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, sections, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-dark-900 pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 border-b border-zinc-800 pb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-gold-500 transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{title}</h1>
          {lastUpdated && <p className="text-zinc-500 text-sm">Last updated: {lastUpdated}</p>}
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="hidden lg:block col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="border-l-2 border-gold-500 pl-4">
                <h3 className="text-white font-serif text-lg">Contents</h3>
              </div>
              <ul className="space-y-4">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block text-sm text-zinc-500 hover:text-gold-500 transition-colors"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Mobile Table of Contents (Simple List) */}
          <div className="lg:hidden col-span-1 bg-zinc-900/50 p-6 border border-zinc-800">
             <h3 className="text-gold-500 font-serif mb-4 uppercase tracking-widest text-sm">Table of Contents</h3>
             <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-zinc-400 hover:text-white text-sm">{section.title}</a>
                  </li>
                ))}
             </ul>
          </div>

          {/* Content */}
          <div className="col-span-1 lg:col-span-3">
            <div className="prose prose-invert prose-lg max-w-none text-zinc-400 font-light leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
