
import React, { useState } from 'react';
import { Menu, X, Heart, ShieldCheck } from 'lucide-react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Accueil', value: 'home' as View },
    { label: 'Qui sommes-nous', value: 'about' as View },
    { label: 'Missions', value: 'missions' as View },
    { label: 'Actualités', value: 'news' as View },
    { label: 'Contact', value: 'contact' as View },
  ];

  return (
    <nav className="glass-nav fixed w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-blue-600 p-2 rounded-full mr-3 text-white">
              <Heart size={24} />
            </div>
            <div>
              <span className="text-xl font-bold text-blue-900 tracking-tight leading-none block">FMA Madagascar</span>
              <span className="text-[10px] uppercase text-blue-600 font-bold tracking-widest">Salésiennes de Don Bosco</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`text-sm font-medium transition-colors ${
                  currentView === item.value ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 transition-colors"
            >
              <ShieldCheck size={16} className="mr-2" />
              Accès CMS
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-blue-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onNavigate(item.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-medium ${
                  currentView === item.value ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('admin');
                setIsOpen(false);
              }}
              className="flex items-center w-full text-left px-3 py-4 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
            >
              <ShieldCheck size={20} className="mr-2" />
              Accès CMS
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
